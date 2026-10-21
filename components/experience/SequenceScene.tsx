"use client";

import { useEffect, useRef, type RefObject } from "react";
import { frameUrl, type SequenceManifest } from "@/lib/sequence";
import type { SceneBridge } from "./HouseConstructionScene";

/**
 * Plays a pre-rendered walkthrough (photoreal frames exported from Lumion/D5/
 * Blender or an AI video) in sync with scroll. Frames stream in coarse-to-fine
 * so the film is scrubbable within a second and sharpens as the rest arrive.
 */
export default function SequenceScene({
  bridge,
  sequence,
  mobile,
  onReady,
}: {
  bridge: RefObject<SceneBridge>;
  sequence: SequenceManifest;
  mobile: boolean;
  onReady?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    const n = sequence.frames;
    const pattern = mobile && sequence.mobilePath ? sequence.mobilePath : sequence.path;
    const images: Array<HTMLImageElement | null> = new Array(n).fill(null);
    let disposed = false;
    let frame = 0;
    let lastDrawn = -1;
    let readyFired = false;

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < n; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };

    const draw = () => {
      frame = 0;
      const want = Math.round(Math.min(1, Math.max(0, bridge.current.progress)) * (n - 1));
      const i = nearestLoaded(want);
      if (i < 0 || i === lastDrawn) return;
      lastDrawn = i;
      const img = images[i]!;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      lastDrawn = -1;
      request();
    };

    // coarse-to-fine load order: every 16th frame, then 8th, 4th, 2nd, all
    const order: number[] = [];
    const seen = new Set<number>();
    for (const step of [16, 8, 4, 2, 1]) {
      for (let i = 0; i < n; i += step) {
        if (!seen.has(i)) {
          seen.add(i);
          order.push(i);
        }
      }
    }
    if (!seen.has(n - 1)) order.push(n - 1);
    let cursor = 0;
    let inFlight = 0;
    const MAX = mobile ? 4 : 6;
    const pump = () => {
      while (!disposed && inFlight < MAX && cursor < order.length) {
        const i = order[cursor++];
        inFlight++;
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(pattern, i);
        img
          .decode()
          .then(() => {
            if (disposed) return;
            images[i] = img;
            lastDrawn = -1;
            request();
          })
          .catch(() => undefined)
          .finally(() => {
            inFlight--;
            pump();
          });
      }
    };

    const b = bridge.current;
    b.invalidate = request;
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    pump();

    return () => {
      disposed = true;
      if (frame) cancelAnimationFrame(frame);
      ro.disconnect();
      b.invalidate = undefined;
    };
  }, [bridge, sequence, mobile, onReady]);

  return <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block h-full w-full" />;
}
