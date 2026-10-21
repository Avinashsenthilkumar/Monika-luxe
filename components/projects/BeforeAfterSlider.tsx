"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ResolvedImage } from "@/lib/assets";

/** Draggable, keyboard-accessible comparison of two photos of the same space. */
export default function BeforeAfterSlider({
  before,
  after,
  caption,
}: {
  before: ResolvedImage;
  after: ResolvedImage;
  caption?: string;
}) {
  const [pos, setPos] = useState(50);
  const frame = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((x: number) => {
    const rect = frame.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else if (e.key === "Home") setPos(0);
    else if (e.key === "End") setPos(100);
    else return;
    e.preventDefault();
  };

  const clip = `inset(0 ${100 - pos}% 0 0)`;

  return (
    <figure>
      <div
        ref={frame}
        className="relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden bg-navy"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image src={after.src} alt={after.alt} fill sizes="100vw" className="object-cover" />
        {/* dynamic clip-path is runtime state, applied through a CSS variable */}
        <div className="absolute inset-0 [clip-path:var(--clip)]" ref={(el) => el?.style.setProperty("--clip", clip)}>
          <Image src={before.src} alt={before.alt} fill sizes="100vw" className="object-cover" />
        </div>
        <span className="eyebrow absolute left-4 top-4 bg-navy-deep/70 px-3 py-1.5 text-white">Before</span>
        <span className="eyebrow absolute right-4 top-4 bg-navy-deep/70 px-3 py-1.5 text-white">After</span>
        <div
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          aria-valuetext={`${Math.round(pos)}% before image shown`}
          onKeyDown={onKey}
          className="absolute inset-y-0 w-px -translate-x-1/2 cursor-ew-resize bg-white left-[var(--pos)]"
          ref={(el) => el?.style.setProperty("--pos", `${pos}%`)}
        >
          <span className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white bg-navy-deep/70 text-white">
            ⇆
          </span>
        </div>
      </div>
      {caption && <figcaption className="mt-3 text-sm opacity-70">{caption}</figcaption>}
    </figure>
  );
}
