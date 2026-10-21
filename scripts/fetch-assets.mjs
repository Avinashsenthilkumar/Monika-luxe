#!/usr/bin/env node
/**
 * Copies every image listed in lib/assets.ts from the current WordPress site
 * into /public so the new site is fully self-hosted.
 *
 *   npm run assets:fetch          → download missing files (fails loudly)
 *   node scripts/fetch-assets.mjs --soft   → used by `prebuild`; never fails the build
 *
 * IMPORTANT: run this (and commit /public/images) BEFORE the old WordPress
 * site is switched off — afterwards the source URLs will no longer exist.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const soft = process.argv.includes("--soft");
const manifest = await fs.readFile(path.join(root, "lib/assets.ts"), "utf8");

const entries = [...manifest.matchAll(/img\(\s*"(\w+)",\s*"([^"]+)",\s*"([^"]+)"/g)].map(([, id, local, remote]) => ({
  id,
  local,
  remote,
}));

const sources = (remote) => [
  `https://monikaluxeinteriors.com/wp-content/uploads/${remote}`,
  `https://i0.wp.com/monikaluxeinteriors.com/wp-content/uploads/${remote}?w=2400&ssl=1`,
];

let ok = 0;
let skipped = 0;
const failed = [];

for (const e of entries) {
  const dest = path.join(root, "public", e.local);
  try {
    await fs.access(dest);
    skipped++;
    continue;
  } catch {
    /* missing → download */
  }
  let done = false;
  for (const url of sources(e.remote)) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const type = res.headers.get("content-type") ?? "";
      if (!res.ok || !type.startsWith("image/")) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buf);
      ok++;
      done = true;
      break;
    } catch {
      /* try next source */
    }
  }
  if (!done) failed.push(e);
}

console.log(`[assets] ${ok} downloaded, ${skipped} already present, ${failed.length} unavailable (of ${entries.length}).`);
if (failed.length) {
  console.log("[assets] Unavailable — the site will fall back to the original URLs for:");
  for (const f of failed) console.log(`  - ${f.id}: ${f.remote}`);
  if (!soft) process.exit(1);
}
