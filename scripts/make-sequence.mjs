#!/usr/bin/env node
/**
 * Turns a rendered walkthrough video into scroll frames for the home-page film.
 *
 *   node scripts/make-sequence.mjs path/to/walkthrough.mp4 [--fps 24] [--blueprint]
 *
 * Needs ffmpeg on your PATH. Writes:
 *   public/sequences/house/desktop/frame_0001.webp …  (1600 px wide)
 *   public/sequences/house/mobile/frame_0001.webp  …  (800 px wide)
 *   public/sequences/house/manifest.json
 * The site switches from the real-time 3D model to these frames automatically.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const input = args.find((a) => !a.startsWith("--"));
const fpsIdx = args.indexOf("--fps");
const fps = fpsIdx >= 0 ? Number(args[fpsIdx + 1]) : 24;
const blueprint = args.includes("--blueprint");

if (!input || !fs.existsSync(input)) {
  console.error("Usage: node scripts/make-sequence.mjs path/to/walkthrough.mp4 [--fps 24] [--blueprint]");
  process.exit(1);
}

const out = path.join(root, "public", "sequences", "house");
fs.rmSync(out, { recursive: true, force: true });
for (const [dir, width, q] of [
  ["desktop", 1600, 72],
  ["mobile", 800, 65],
]) {
  const target = path.join(out, dir);
  fs.mkdirSync(target, { recursive: true });
  console.log(`[sequence] exporting ${dir} frames…`);
  execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-i",
      input,
      "-vf",
      `fps=${fps},scale=${width}:-2:flags=lanczos`,
      "-c:v",
      "libwebp",
      "-quality",
      String(q),
      path.join(target, "frame_%04d.webp"),
    ],
    { stdio: "inherit" },
  );
}

const frames = fs.readdirSync(path.join(out, "desktop")).filter((f) => f.endsWith(".webp")).length;
const probe = execFileSync("ffprobe", [
  "-v",
  "error",
  "-select_streams",
  "v:0",
  "-show_entries",
  "stream=width,height",
  "-of",
  "csv=p=0",
  input,
])
  .toString()
  .trim()
  .split(",")
  .map(Number);
const manifest = {
  frames,
  path: "/sequences/house/desktop/frame_%04d.webp",
  mobilePath: "/sequences/house/mobile/frame_%04d.webp",
  width: probe[0],
  height: probe[1],
  blueprintSheet: blueprint,
};
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
const size = (dir) => fs.readdirSync(path.join(out, dir)).reduce((s, f) => s + fs.statSync(path.join(out, dir, f)).size, 0);
console.log(
  `[sequence] ${frames} frames · desktop ${(size("desktop") / 1e6).toFixed(1)} MB · mobile ${(size("mobile") / 1e6).toFixed(1)} MB`,
);
console.log("[sequence] done — commit public/sequences/house and redeploy.");
