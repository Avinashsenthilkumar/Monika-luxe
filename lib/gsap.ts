"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Avoid re-measuring when the mobile address bar shows/hides.
  ScrollTrigger.config({ ignoreMobileResize: true });
  // Phones/tablets: take over touch scrolling so pinned sections stay locked while the
  // browser toolbar shows/hides (fixes the iOS Safari "jumping / not animating" pin).
  if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll(true);
}

export { gsap, ScrollTrigger, useGSAP };
