"use client";

import { useEffect, useRef, type RefObject } from "react";
import { frameUrl, type SequenceManifest } from "@/lib/sequence";
import type { SceneBridge } from "./HouseConstructionScene";

/**
 * Plays a pre-rendered walkthrough (photoreal frames exported from Lumion/D5/
 * Blender or an AI video) in sync with scroll. Frames stream in coarse-to-fine
 * so the film is scrubbable within a second and sharpens as the rest arrive.
 *
 * Landscape screens: full-bleed cover. Portrait phones: the film plays inside a
 * rounded "screen" (positioned by the [data-film-frame] element, so CSS owns the
 * layout) over a soft, blurred copy of the same frame — no harsh letterboxing.
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
    // tiny offscreen canvas: drawing a frame into it and scaling back up gives a cheap blur on every browser
    const blur = document.createElement("canvas");
    blur.width = 40;
    blur.height = 24;
    const bctx = blur.getContext("2d");

    const n = sequence.frames;
    const pattern = mobile && sequence.mobilePath ? sequence.mobilePath : sequence.path;
    const images: Array<HTMLImageElement | null> = new Array(n).fill(null);
    let disposed = false;
    let frame = 0;
    let lastDrawn = -1;
    let readyFired = false;
    let dpr = 1;
    // portrait "screen" rectangle in canvas pixels, or null for full-bleed
    let card: { x: number; y: number; w: number; h: number; r: number } | null = null;

    const nearestLoaded = (i: number) => {
      for (let d = 0; d < n; d++) {
        if (images[i - d]) return i - d;
        if (images[i + d]) return i + d;
      }
      return -1;
    };

    const cover = (img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const s = Math.max(w / iw, h / ih);
      ctx.drawImage(img, x + (w - iw * s) / 2, y + (h - ih * s) / 2, iw * s, ih * s);
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
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

      if (card) {
        // 1 · blurred, darkened backdrop from the same frame
        if (bctx) {
          bctx.imageSmoothingEnabled = true;
          bctx.drawImage(img, 0, 0, blur.width, blur.height);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          const s = Math.max(cw / blur.width, ch / blur.height) * 1.15;
          ctx.drawImage(blur, (cw - blur.width * s) / 2, (ch - blur.height * s) / 2, blur.width * s, blur.height * s);
        }
        const g = ctx.createLinearGradient(0, 0, 0, ch);
        g.addColorStop(0, "rgba(6,18,42,0.78)");
        g.addColorStop(0.45, "rgba(6,18,42,0.62)");
        g.addColorStop(1, "rgba(6,18,42,0.94)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, cw, ch);

        // 2 · the film itself, crisp, inside a rounded screen with a gold hairline
        const { x, y, w, h, r } = card;
        ctx.save();
        roundRect(x, y, w, h, r);
        ctx.clip();
        ctx.imageSmoothingQuality = "high";
        cover(img, x, y, w, h);
        ctx.restore();
        roundRect(x + 0.5 * dpr, y + 0.5 * dpr, w - dpr, h - dpr, r);
        ctx.lineWidth = dpr;
        ctx.strokeStyle = "rgba(201,162,77,0.55)";
        ctx.stroke();
      } else {
        cover(img, 0, 0, cw, ch);
      }

      if (!readyFired) {
        readyFired = true;
        onReady?.();
      }
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      card = null;
      if (canvas.clientWidth / canvas.clientHeight < 0.85) {
        const slot = canvas.parentElement?.parentElement?.querySelector<HTMLElement>("[data-film-frame]");
        const c = canvas.getBoundingClientRect();
        const f = slot?.getBoundingClientRect();
        card =
          f && f.width > 0
            ? { x: (f.left - c.left) * dpr, y: (f.top - c.top) * dpr, w: f.width * dpr, h: f.height * dpr, r: 18 * dpr }
            : {
                x: 16 * dpr,
                y: canvas.height * 0.15,
                w: canvas.width - 32 * dpr,
                h: Math.min(canvas.width - 32 * dpr, canvas.height * 0.42),
                r: 18 * dpr,
              };
      }
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
