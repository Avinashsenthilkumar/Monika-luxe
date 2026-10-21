"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Opening frame: a front elevation of a contemporary residence drafts itself
 * in gold line-work, the windows warm up, and the headline rises. Pure SVG +
 * CSS, so it paints immediately with no image or WebGL dependency.
 */

const L = "draw-norm"; // stroke-drawing class (pathLength = 1)

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-drawing]", { yPercent: 14, scale: 1.06, ease: "none", scrollTrigger: st });
        gsap.to("[data-hero-copy]", { yPercent: -18, autoAlpha: 0.15, ease: "none", scrollTrigger: st });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col overflow-hidden bg-navy-deep text-white"
    >
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_70%,rgba(201,162,77,0.16),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-deep to-transparent"
      />

      {/* elevation drawing */}
      <div
        data-hero-drawing
        aria-hidden
        className="absolute inset-x-0 bottom-[6vh] flex justify-center md:bottom-[4vh] md:justify-end"
      >
        <svg viewBox="0 0 1200 520" className="w-[150%] max-w-none translate-x-[8%] md:w-[78%] md:translate-x-[4%]" fill="none">
          <defs>
            <linearGradient id="warm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffcf95" stopOpacity="0.55" />
              <stop offset="1" stopColor="#c9a24d" stopOpacity="0.12" />
            </linearGradient>
            <linearGradient id="pool" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5fb3be" stopOpacity="0" />
              <stop offset="0.5" stopColor="#5fb3be" stopOpacity="0.35" />
              <stop offset="1" stopColor="#5fb3be" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* glowing glazing */}
          <g className="animate-glow [animation-delay:2.1s]">
            <rect x="562" y="280" width="396" height="141" fill="url(#warm)" />
            <rect x="460" y="168" width="400" height="72" fill="url(#warm)" />
            <rect x="344" y="168" width="88" height="72" fill="url(#warm)" />
            <rect x="268" y="310" width="168" height="22" fill="url(#warm)" />
            <rect x="300" y="452" width="700" height="6" fill="url(#pool)" />
          </g>

          <g stroke="#c9a24d" strokeWidth="1.2">
            <path pathLength={1} className={`${L} [animation-delay:0ms]`} d="M20 440 H1180" />
            <rect pathLength={1} className={`${L} [animation-delay:150ms]`} x="200" y="422" width="800" height="18" />
            <rect pathLength={1} className={`${L} [animation-delay:300ms]`} x="240" y="278" width="320" height="144" />
            <rect pathLength={1} className={`${L} [animation-delay:420ms]`} x="560" y="278" width="400" height="144" />
            <rect pathLength={1} className={`${L} [animation-delay:560ms]`} x="300" y="266" width="640" height="12" />
            <rect pathLength={1} className={`${L} [animation-delay:700ms]`} x="320" y="138" width="580" height="128" />
            <rect pathLength={1} className={`${L} [animation-delay:840ms]`} x="270" y="124" width="700" height="14" />
            <rect pathLength={1} className={`${L} [animation-delay:980ms]`} x="460" y="168" width="400" height="72" />
            <rect pathLength={1} className={`${L} [animation-delay:1040ms]`} x="344" y="168" width="88" height="72" />
            <rect pathLength={1} className={`${L} [animation-delay:1100ms]`} x="468" y="310" width="56" height="112" />
            <rect pathLength={1} className={`${L} [animation-delay:1160ms]`} x="268" y="310" width="168" height="22" />
            <path
              pathLength={1}
              className={`${L} [animation-delay:1220ms]`}
              d="M660 278 V422 M860 278 V422 M720 278 V422 M726 278 V422"
            />
            <path pathLength={1} className={`${L} [animation-delay:1300ms]`} d="M300 452 H1000" />
          </g>

          {/* interior hints */}
          <g stroke="#e2c88f" strokeOpacity="0.55" strokeWidth="1">
            <path
              pathLength={1}
              className={`${L} [animation-delay:1500ms]`}
              d="M650 404 H800 V422 M650 404 V422 M652 388 H798 V404"
            />
            <path pathLength={1} className={`${L} [animation-delay:1600ms]`} d="M700 300 H780 M705 278 V300 M775 278 V300" />
            <path
              pathLength={1}
              className={`${L} [animation-delay:1650ms]`}
              d="M480 186 V222 M520 186 V222 M600 186 V222 M680 186 V222 M760 186 V222"
            />
          </g>

          {/* trees */}
          <g stroke="#7d8aa3" strokeWidth="1">
            <path
              pathLength={1}
              className={`${L} [animation-delay:1700ms]`}
              d="M120 440 V350 M110 355 C60 340 70 260 120 250 C170 260 180 340 130 355"
            />
            <path
              pathLength={1}
              className={`${L} [animation-delay:1780ms]`}
              d="M180 440 V380 M172 384 C150 300 165 230 180 210 C195 230 210 300 188 384"
            />
            <path
              pathLength={1}
              className={`${L} [animation-delay:1860ms]`}
              d="M1080 440 V340 M1068 345 C1010 330 1020 240 1080 230 C1140 240 1150 330 1092 345"
            />
          </g>

          {/* annotations */}
          <g stroke="#7d8aa3" strokeOpacity="0.7" strokeWidth="1">
            <path pathLength={1} className={`${L} [animation-delay:1900ms]`} d="M270 92 H970 M270 86 V98 M970 86 V98" />
            <path
              pathLength={1}
              className={`${L} [animation-delay:1950ms]`}
              d="M1010 124 H1040 M1010 278 H1040 M1010 440 H1040"
            />
          </g>
          <g className="animate-fade fill-[#7d8aa3] font-mono text-[11px] tracking-[0.12em] [animation-delay:2.2s]">
            <text x="620" y="82" textAnchor="middle">
              17.50
            </text>
            <text x="1048" y="128">
              +7.90
            </text>
            <text x="1048" y="282">
              +4.05
            </text>
            <text x="1048" y="444">
              ±0.00
            </text>
          </g>
        </svg>
      </div>

      {/* copy */}
      <div
        data-hero-copy
        className="container-luxe relative z-10 flex flex-1 flex-col justify-start pt-36 md:justify-center md:pt-24"
      >
        <p className="eyebrow animate-fade mb-8 flex items-center gap-4 text-gold [animation-delay:300ms]">
          <span aria-hidden className="h-px w-10 bg-current" />
          Interiors &amp; Construction · Thanjavur
        </p>
        <h1 id="hero-title" className="max-w-[12ch] font-serif text-display">
          <span className="reveal-line">
            <span className="gold-foil animate-rise [animation-delay:350ms]">Architecture</span>
          </span>
          <span className="reveal-line">
            <span className="gold-foil animate-rise [animation-delay:500ms]">
              That <em className="text-gold-light">Moves</em> You.
            </span>
          </span>
        </h1>
        <p className="animate-fade mt-8 max-w-md text-base leading-relaxed text-white/70 [animation-delay:900ms] md:text-lg">
          Thoughtfully designed interiors and construction, shaped around the way you want to live.
        </p>
        <div className="animate-fade mt-10 flex flex-wrap gap-4 [animation-delay:1100ms]">
          <Link
            href="#journey"
            className="inline-flex min-h-12 items-center gap-3 border border-white/35 px-7 text-[0.75rem] uppercase tracking-[0.2em] transition-colors hover:border-gold hover:text-gold"
          >
            Discover Our Approach <span aria-hidden>↓</span>
          </Link>
          <Link
            href="/contact#enquiry"
            className="inline-flex min-h-12 items-center gap-3 bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep transition-colors hover:bg-white"
          >
            Start Your Project <span aria-hidden>→</span>
          </Link>
        </div>
      </div>

      <div aria-hidden className="relative z-10 flex justify-center pb-8">
        <span className="block h-12 w-px bg-white/50 animate-scroll-cue" />
      </div>
    </section>
  );
}
