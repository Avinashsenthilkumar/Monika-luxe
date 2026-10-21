"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMediaQuery, usePrefersReducedMotion, useWebGLSupport } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import BlueprintScene from "./BlueprintScene";
import { chapters, PHASE, ROOM_WINDOWS } from "./chapters";
import ExperienceFallback from "./ExperienceFallback";
import FinalReveal from "./FinalReveal";
import InteriorRevealScene, { type RoomSlide } from "./InteriorRevealScene";
import JourneyProgress from "./JourneyProgress";
import PlanDrawing from "./PlanDrawing";
import SceneCaption from "./SceneCaption";
import type { SceneBridge } from "./HouseConstructionScene";

// Three.js is split into its own chunk and never rendered on the server.
const HouseConstructionScene = dynamic(() => import("./HouseConstructionScene"), { ssr: false });

const captionChapters = chapters.filter((c) => c.id !== "interiors" && c.id !== "final");

export default function ArchitecturalJourney({ rooms }: { rooms: RoomSlide[] }) {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [failed, setFailed] = useState(false);
  const [mountScene, setMountScene] = useState(false);
  const [ready, setReady] = useState(false);
  const [quality, setQuality] = useState<"high" | "low">("high");

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const bridge = useRef<SceneBridge>({ progress: 0 });

  const useFallback = reduced || webgl === false || failed;

  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  // Pick a render budget for this device.
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 8;
    const memory = nav.deviceMemory ?? 8;
    setQuality(isMobile || cores <= 4 || memory <= 4 ? "low" : "high");
  }, [isMobile]);

  // Load the 3D chunk only when the section approaches, and only once the main thread is idle.
  useEffect(() => {
    if (useFallback || webgl !== true) return;
    const el = section.current;
    if (!el) return;
    let handle = 0;
    const hasIdle = typeof window.requestIdleCallback === "function";
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        const start = () => setMountScene(true);
        handle = hasIdle ? window.requestIdleCallback(start, { timeout: 1500 }) : window.setTimeout(start, 250);
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [useFallback, webgl]);

  useGSAP(
    () => {
      if (useFallback) return;
      const root = section.current;
      const stageEl = stage.current;
      if (!root || !stageEl) return;
      const q = gsap.utils.selector(root);

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (isMobile ? 6.5 : 8))}`,
          pin: stageEl,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // ---------- progress → 3D, chapter index, colour tone ----------
      const items = q("[data-progress-item]");
      let lastChapter = -1;
      let lastTone = "";
      const sync = () => {
        const p = tl.progress();
        bridge.current.progress = p;
        bridge.current.invalidate?.();

        const idx = chapters.findIndex((c) => p >= c.at[0] && p < c.at[1]);
        if (idx !== lastChapter) {
          lastChapter = idx;
          items.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
        }
        const tone = p < 0.46 ? "ink" : "ivory";
        if (tone !== lastTone) {
          lastTone = tone;
          stageEl.dataset.tone = tone;
        }
      };
      tl.eventCallback("onUpdate", sync);

      // ---------- blueprint sheet ----------
      tl.fromTo(q("[data-bp-draw]"), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.08 }, 0.005);
      tl.to(q("[data-scroll-hint]"), { autoAlpha: 0, duration: 0.02 }, 0.01);
      tl.to(q("[data-bp-fade]"), { autoAlpha: 0, duration: 0.05, stagger: 0.003 }, PHASE.blueprintFade[0]);

      // ---------- captions ----------
      captionChapters.forEach((c, i) => {
        const el = q(`[data-caption="${c.id}"]`);
        if (i > 0) tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.025 }, c.at[0] + 0.006);
        tl.to(el, { autoAlpha: 0, y: -30, duration: 0.02 }, c.at[1] - 0.024);
      });

      // ---------- dusk scrim keeps ivory captions legible ----------
      tl.fromTo(q("[data-scrim]"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.05 }, 0.43);

      // ---------- passing through the glass ----------
      const flash = q("[data-flash]");
      tl.fromTo(flash, { autoAlpha: 0 }, { autoAlpha: 0.5, duration: 0.016 }, 0.566);
      tl.to(flash, { autoAlpha: 0, duration: 0.03 }, 0.584);

      // ---------- interior chapters: titles over the 3D rooms, dip-to-black at each cut ----------
      const roomsEl = q("[data-rooms]");
      const windows = [ROOM_WINDOWS.living, ROOM_WINDOWS.kitchen, ROOM_WINDOWS.bedroom, ROOM_WINDOWS.office];
      tl.set(roomsEl, { autoAlpha: 1 }, windows[0][0]);
      q("[data-room]").forEach((room, i) => {
        const [a, b] = windows[Math.min(i, windows.length - 1)];
        const len = b - a;
        const title = room.querySelector("[data-room-title]");
        const details = room.querySelectorAll("[data-room-kicker], [data-room-text]");
        tl.fromTo(room, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.008 }, a + 0.004);
        if (title) tl.fromTo(title, { yPercent: 105 }, { yPercent: 0, duration: len * 0.3, ease: "power3.out" }, a + len * 0.1);
        tl.fromTo(
          details,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: len * 0.2, stagger: len * 0.05 },
          a + len * 0.2,
        );
        tl.to(room, { autoAlpha: 0, duration: 0.008 }, b - 0.012);
      });
      tl.to(roomsEl, { autoAlpha: 0, duration: 0.01 }, PHASE.final[0]);
      const dip = q("[data-dip]");
      for (const [, cut] of windows) {
        tl.to(dip, { autoAlpha: 1, duration: 0.006 }, cut - 0.006);
        tl.to(dip, { autoAlpha: 0, duration: 0.01 }, cut);
      }

      // ---------- final reveal ----------
      tl.set(q("[data-final]"), { autoAlpha: 1 }, PHASE.final[0] + 0.004);
      tl.fromTo(
        q("[data-final-item]"),
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.03, stagger: 0.008, ease: "power2.out" },
        PHASE.final[0] + 0.012,
      );

      // Pin the timeline length to exactly 1 so positions above equal scroll progress.
      tl.set({}, {}, 1);
      sync();
    },
    { scope: section, dependencies: [useFallback, isMobile, rooms.length], revertOnUpdate: true },
  );

  if (useFallback) return <ExperienceFallback rooms={rooms} />;

  return (
    <section ref={section} id="journey" aria-label="From blueprint to finished home" className="relative bg-white">
      <p className="sr-only">
        A scroll-driven film: a floor plan is drawn, the structure rises, stone, timber and glass are applied, the lights come on
        at dusk and the camera enters the home, followed by photographs of our kitchens, bedrooms, workspaces and living rooms.
      </p>
      <div ref={stage} data-tone="ink" className="group/stage relative h-svh w-full overflow-hidden bg-white">
        <div className="absolute inset-0">
          {mountScene && <HouseConstructionScene bridge={bridge} quality={quality} onReady={onReady} onError={onError} />}
        </div>

        {/* Poster until WebGL has rendered its first frame */}
        <div
          aria-hidden
          className={cn(
            "blueprint-grid pointer-events-none absolute inset-0 flex items-center justify-center bg-white transition-opacity duration-1000",
            ready ? "opacity-0" : "opacity-100",
          )}
        >
          <PlanDrawing className="h-[62%] w-auto max-w-[88%] opacity-70" />
        </div>

        <BlueprintScene />
        <div
          data-scrim
          aria-hidden
          className="pointer-events-none invisible absolute inset-0 bg-[radial-gradient(ellipse_at_10%_95%,rgba(6,18,42,0.7),transparent_60%)] opacity-0"
        />
        <div data-flash aria-hidden className="pointer-events-none invisible absolute inset-0 bg-[#f7e7cf] opacity-0" />
        <InteriorRevealScene rooms={rooms} />
        <div data-dip aria-hidden className="pointer-events-none invisible absolute inset-0 bg-navy-deep opacity-0" />

        {captionChapters.map((c, i) => (
          <SceneCaption key={c.id} chapter={c} first={i === 0} />
        ))}

        <FinalReveal />
        <JourneyProgress />

        <div
          data-scroll-hint
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-navy md:flex"
        >
          <span className="eyebrow">Scroll to build</span>
          <span className="block h-10 w-px bg-navy/60 animate-scroll-cue" />
        </div>

        <a
          href="#studio"
          className="eyebrow absolute bottom-6 right-24 z-10 border-b border-current/40 pb-1 text-navy transition-colors hover:text-gold group-data-[tone=ivory]/stage:text-white md:bottom-10 md:right-32"
        >
          Skip the film ↓
        </a>
      </div>
    </section>
  );
}
