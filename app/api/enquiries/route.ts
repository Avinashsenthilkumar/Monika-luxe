import { NextResponse } from "next/server";
import { spamGuardSchema, enquirySchema, type EnquiryInput } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ---------- very small in-memory rate limit (per server instance) ---------- */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function escapeHtml(v: string) {
  return v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c);
}

function rows(d: EnquiryInput): Array<[string, string]> {
  return [
    ["Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email],
    ["Project type", d.projectType],
    ["Location", d.location],
    ["Budget", d.budget ?? "Not specified"],
    ["Preferred contact", d.contactMethod],
    ["Message", d.message],
  ];
}

async function sendWithResend(d: EnquiryInput) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!key || !to) return null;
  const from = process.env.ENQUIRY_FROM_EMAIL || "Monika Luxe Website <onboarding@resend.dev>";
  const text = rows(d)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
  const html = `<h2 style="font-family:Georgia,serif">New project enquiry</h2><table cellpadding="6">${rows(d)
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v).replace(/\n/g, "<br/>")}</td></tr>`)
    .join("")}</table>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      reply_to: d.email,
      subject: `New enquiry — ${d.projectType} — ${d.name}`,
      text,
      html,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
  return true;
}

async function sendToWebhook(d: EnquiryInput) {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ENQUIRY_WEBHOOK_SECRET) headers["x-enquiry-secret"] = process.env.ENQUIRY_WEBHOOK_SECRET;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...d, submittedAt: new Date().toISOString(), source: "website" }),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  return true;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }

  const guard = spamGuardSchema.safeParse(body);
  if (!guard.success) {
    return NextResponse.json({ ok: false, message: "Invalid request." }, { status: 400 });
  }
  // Honeypot filled → silently drop (bots only; real visitors never see this field).
  if (guard.data.website) return NextResponse.json({ ok: true });
  if (Date.now() - guard.data.startedAt < 2500) {
    return NextResponse.json({ ok: false, message: "That was very fast — please try again." }, { status: 429 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, message: "Too many enquiries from this connection. Please call us instead." },
      { status: 429 },
    );
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, fieldErrors: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    const results = await Promise.all([sendWithResend(parsed.data), sendToWebhook(parsed.data)]);
    if (results.every((r) => r === null)) {
      return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
    }
  } catch (error) {
    console.error("[enquiries] delivery failed", error);
    return NextResponse.json({ ok: false, message: "Our enquiry service is temporarily unavailable." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
