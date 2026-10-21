import type { ResolvedImage } from "./assets";

export interface BeforeAfterPair {
  id: string;
  /** service slug the pair belongs to */
  service: string;
  caption: string;
  before: ResolvedImage;
  after: ResolvedImage;
}

/**
 * Genuine before/after photographs of the SAME space only.
 * Empty until the company supplies authentic pairs — the slider is hidden
 * automatically while this list is empty. Example entry:
 *
 * {
 *   id: "residence-renovation-01",
 *   service: "renovation",
 *   caption: "Living room renovation, Thanjavur",
 *   before: { src: "/images/before-after/01-before.jpg", alt: "Living room before renovation", width: 1600, height: 1000 },
 *   after:  { src: "/images/before-after/01-after.jpg",  alt: "Living room after renovation",  width: 1600, height: 1000 },
 * }
 */
export const beforeAfterPairs: BeforeAfterPair[] = [];
