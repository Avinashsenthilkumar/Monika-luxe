#!/usr/bin/env node
/**
 * Turns a rendered walkthrough video into scroll frames for the home-page film.
 *
 *   node scripts/make-sequence.mjs exterior.mp4 [interior.mp4 …] [--fps 24] [--blueprint]
 *
 * Several clips play one after another; landscape and portrait clips can be mixed
 * (the player frames each one to suit the screen). Frames are sized by their long side.
 *
 * Needs ffmpeg on your PATH. Writes:
 *   public/sequences/house/desktop/frame_0001.webp …  (1920 px wide)
 *   public/sequences/house/mobile/frame_0001.webp  …  (1280 px wide)
 *   public/sequences/house/manifest.json
 * The site switches from the real-time 3D model to these frames automatically.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const fpsIdx = args.indexOf("--fps");
const fps = fpsIdx >= 0 ? Number(args[fpsIdx + 1]) : 24;
const blueprint = args.includes("--blueprint");
const clips = args.filter((a, i) => !a.startsWith("--") && (fpsIdx < 0 || i !== fpsIdx + 1));

if (!clips.length || clips.some((c) => !fs.existsSync(c))) {
  console.error("Usage: node scripts/make-sequence.mjs exterior.mp4 [interior.mp4 …] [--fps 24] [--blueprint]");
  process.exit(1);
}
const probe = (file) =>
  execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", file])
    .toString()
    .trim()
    .split(",")
    .map(Number);

const out = path.join(root, "public", "sequences", "house");
fs.rmSync(out, { recursive: true, force: true });
for (const [dir, long, q] of [
  ["desktop", 1920, 78],
  ["mobile", 1280, 74],
]) {
  const target = path.join(out, dir);
  fs.mkdirSync(target, { recursive: true });
  let start = 1;
  for (const clip of clips) {
    console.log(`[sequence] exporting ${dir} frames from ${path.basename(clip)}…`);
    const [w, h] = probe(clip);
    const scale = w >= h ? `${long}:-2` : `-2:${long}`;
    execFileSync(
      "ffmpeg",
      [
        "-v",
        "error",
        "-i",
        clip,
        "-an",
        "-vf",
        `fps=${fps},scale=${scale}:flags=lanczos,unsharp=5:5:0.7:3:3:0.0`,
        "-c:v",
        "libwebp",
        "-quality",
        String(q),
        "-start_number",
        String(start),
        path.join(target, "frame_%04d.webp"),
      ],
      { stdio: "inherit" },
    );
    start = fs.readdirSync(target).filter((f) => f.endsWith(".webp")).length + 1;
  }
}

const frames = fs.readdirSync(path.join(out, "desktop")).filter((f) => f.endsWith(".webp")).length;
const first = probe(clips[0]);
const manifest = {
  frames,
  path: "/sequences/house/desktop/frame_%04d.webp",
  mobilePath: "/sequences/house/mobile/frame_%04d.webp",
  width: first[0],
  height: first[1],
  blueprintSheet: blueprint,
};
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
const size = (dir) => fs.readdirSync(path.join(out, dir)).reduce((s, f) => s + fs.statSync(path.join(out, dir, f)).size, 0);
console.log(
  `[sequence] ${frames} frames · desktop ${(size("desktop") / 1e6).toFixed(1)} MB · mobile ${(size("mobile") / 1e6).toFixed(1)} MB`,
);
console.log("[sequence] done — commit public/sequences/house and redeploy.");
