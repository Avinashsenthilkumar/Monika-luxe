import fs from "node:fs";
import path from "node:path";
import type { SequenceManifest } from "./sequence";

/** Returns the rendered-film manifest if frames have been added to /public/sequences/house. */
export function readSequence(): SequenceManifest | null {
  try {
    const file = path.join(process.cwd(), "public", "sequences", "house", "manifest.json");
    if (!fs.existsSync(file)) return null;
    const m = JSON.parse(fs.readFileSync(file, "utf8")) as SequenceManifest;
    if (!m.frames || !m.path) return null;
    return m;
  } catch {
    return null;
  }
}
