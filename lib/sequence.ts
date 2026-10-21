/** Rendered walkthrough played frame-by-frame on scroll (see docs/RENDERED-FILM.md). */
export interface SequenceManifest {
  /** number of frames */
  frames: number;
  /** URL pattern for desktop frames, e.g. "/sequences/house/desktop/frame_%04d.webp" (1-based) */
  path: string;
  /** optional lighter frames for phones */
  mobilePath?: string;
  width: number;
  height: number;
  /** show the drafting-sheet overlay (title block, north arrow) during the first chapter */
  blueprintSheet?: boolean;
}

export function frameUrl(pattern: string, index: number) {
  return pattern.replace("%04d", String(index + 1).padStart(4, "0"));
}
