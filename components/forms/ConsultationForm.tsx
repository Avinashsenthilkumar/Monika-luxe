"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { budgetRanges, company, contactMethods, projectTypes, whatsappLink } from "@/lib/content";
import { cn } from "@/lib/utils";
import { enquirySchema, type EnquiryInput } from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "error" | "unconfigured";

const field =
  "w-full border-0 border-b border-current/25 bg-transparent px-0 py-3 text-base outline-none transition-colors placeholder:text-current/35 focus:border-gold focus-visible:outline-none aria-[invalid=true]:border-red-400";
const labelCls = "eyebrow mb-1 block opacity-70";

export default function ConsultationForm({
  defaultProjectType,
  tone = "dark",
}: {
  defaultProjectType?: (typeof projectTypes)[number];
  tone?: "dark" | "light";
}) {
  const uid = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EnquiryInput>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      message: "",
      consent: false,
      contactMethod: "Phone call",
      projectType: defaultProjectType,
    },
  });

  const onSubmit = async (data: EnquiryInput) => {
    setStatus("submitting");
    setServerMessage("");
    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: honeypot.current?.value ?? "", startedAt: startedAt.current }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        message?: string;
        fieldErrors?: Partial<Record<keyof EnquiryInput, string[]>>;
      };
      if (res.ok && json.ok) {
        setStatus("success");
        reset();
      } else if (res.status === 503 && json.code === "not_configured") {
        setStatus("unconfigured");
      } else if (res.status === 422 && json.fieldErrors) {
        for (const [key, msgs] of Object.entries(json.fieldErrors)) {
          if (msgs?.[0]) setError(key as keyof EnquiryInput, { message: msgs[0] });
        }
        setStatus("idle");
      } else {
        setStatus("error");
        setServerMessage(json.message ?? "");
      }
    } catch {
      setStatus("error");
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const err = (name: keyof EnquiryInput) => errors[name]?.message;
  const ids = (name: string) => ({ id: `${uid}-${name}`, "aria-describedby": `${uid}-${name}-error` });
  const fieldError = (name: keyof EnquiryInput) => (
    <p id={`${uid}-${name}-error`} className="mt-2 min-h-[1.25rem] text-xs text-red-400" role={err(name) ? "alert" : undefined}>
      {err(name) ?? ""}
    </p>
  );

  if (status === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-gold/50 p-8 outline-none md:p-12">
        <p className="eyebrow text-gold">Enquiry received</p>
        <p className="mt-4 font-serif text-4xl">Thank you — we&apos;ll be in touch.</p>
        <p className="mt-4 max-w-md opacity-70">
          Our team will contact you shortly. If it&apos;s urgent, call us on{" "}
          <a className="underline decoration-gold underline-offset-4" href={`tel:${company.phone.e164}`}>
            {company.phone.display}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="eyebrow mt-8 border-b border-current/40 pb-1 hover:text-gold"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className={cn("relative", tone === "dark" ? "text-white" : "text-navy")}>
      {/* honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${uid}-website`}>Leave this field empty</label>
        <input ref={honeypot} id={`${uid}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-x-10 gap-y-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-name`} className={labelCls}>
            Full name *
          </label>
          <input {...register("name")} {...ids("name")} autoComplete="name" aria-invalid={!!err("name")} className={field} />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={`${uid}-phone`} className={labelCls}>
            Phone number *
          </label>
          <input
            {...register("phone")}
            {...ids("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91"
            aria-invalid={!!err("phone")}
            className={field}
          />
          {fieldError("phone")}
        </div>
        <div>
          <label htmlFor={`${uid}-email`} className={labelCls}>
            Email address *
          </label>
          <input
            {...register("email")}
            {...ids("email")}
            type="email"
            autoComplete="email"
            aria-invalid={!!err("email")}
            className={field}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={`${uid}-location`} className={labelCls}>
            Project location *
          </label>
          <input
            {...register("location")}
            {...ids("location")}
            placeholder="e.g. Thanjavur"
            aria-invalid={!!err("location")}
            className={field}
          />
          {fieldError("location")}
        </div>
        <div>
          <label htmlFor={`${uid}-projectType`} className={labelCls}>
            Project type *
          </label>
          <select
            {...register("projectType")}
            {...ids("projectType")}
            aria-invalid={!!err("projectType")}
            className={cn(field, "appearance-none [&>option]:text-navy-deep")}
          >
            <option value="">Select…</option>
            {projectTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldError("projectType")}
        </div>
        <div>
          <label htmlFor={`${uid}-budget`} className={labelCls}>
            Approximate budget (optional)
          </label>
          <select
            {...register("budget", { setValueAs: (v: string) => (v === "" ? undefined : v) })}
            {...ids("budget")}
            className={cn(field, "appearance-none [&>option]:text-navy-deep")}
          >
            <option value="">Select…</option>
            {budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {fieldError("budget")}
        </div>
        <div className="md:col-span-2">
          <label htmlFor={`${uid}-message`} className={labelCls}>
            Tell us about your project *
          </label>
          <textarea
            {...register("message")}
            {...ids("message")}
            rows={4}
            aria-invalid={!!err("message")}
            className={cn(field, "resize-y")}
          />
          {fieldError("message")}
        </div>
        <fieldset className="md:col-span-2" aria-describedby={`${uid}-contactMethod-error`}>
          <legend className={labelCls}>Preferred contact method *</legend>
          <div className="mt-3 flex flex-wrap gap-3">
            {contactMethods.map((m) => (
              <label key={m} className="cursor-pointer">
                <input {...register("contactMethod")} type="radio" value={m} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center border border-current/25 px-5 text-sm transition-colors peer-checked:border-gold peer-checked:bg-gold peer-checked:text-navy-deep peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-gold">
                  {m}
                </span>
              </label>
            ))}
          </div>
          {fieldError("contactMethod")}
        </fieldset>
        <div className="md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              {...register("consent")}
              type="checkbox"
              aria-invalid={!!err("consent")}
              aria-describedby={`${uid}-consent-error`}
              className="mt-0.5 h-5 w-5 shrink-0 accent-[#c9a24d]"
            />
            <span className="opacity-80">I agree to be contacted by Monika Luxe about this enquiry. *</span>
          </label>
          {fieldError("consent")}
        </div>
      </div>

      <div ref={statusRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {status === "unconfigured" && (
          <div className="mb-6 border border-gold/50 p-5 text-sm">
            <p className="font-medium">Online enquiries are not connected yet.</p>
            <p className="mt-2 opacity-75">
              Your details were not sent. Please call{" "}
              <a className="underline decoration-gold underline-offset-4" href={`tel:${company.phone.e164}`}>
                {company.phone.display}
              </a>{" "}
              or{" "}
              <a
                className="underline decoration-gold underline-offset-4"
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
              >
                message us on WhatsApp
              </a>
              .
            </p>
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="mb-6 border border-red-400/60 p-5 text-sm">
            <p className="font-medium">We couldn&apos;t send your enquiry.</p>
            <p className="mt-2 opacity-75">
              {serverMessage || "Please try again in a moment, or"} call{" "}
              <a className="underline underline-offset-4" href={`tel:${company.phone.e164}`}>
                {company.phone.display}
              </a>
              .
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex min-h-13 items-center justify-center gap-3 bg-gold px-9 py-4 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep transition-colors hover:bg-white disabled:cursor-wait disabled:opacity-60"
        >
          {status === "submitting" ? "Sending…" : "Send Enquiry"}
          {status !== "submitting" && <span aria-hidden>→</span>}
        </button>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow border-b border-current/30 pb-1 text-center hover:text-gold"
        >
          Or chat on WhatsApp ↗
        </a>
      </div>
    </form>
  );
}
