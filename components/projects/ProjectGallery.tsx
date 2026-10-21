"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/lib/assets";
import { cn } from "@/lib/utils";
import { useLenis } from "@/components/layout/SmoothScroll";

/** Asymmetric gallery with an accessible fullscreen viewer. */
export default function ProjectGallery({ images, title }: { images: ResolvedImage[]; title: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const lenis = useLenis();

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && dialog.current) {
        const f = dialog.current.querySelectorAll<HTMLElement>("button");
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lenis?.start();
      opener.current?.focus();
    };
  }, [open === null, close, step, lenis]); // eslint-disable-line react-hooks/exhaustive-deps

  const layout = [
    "md:col-span-8 aspect-[4/3]",
    "md:col-span-4 aspect-[3/4]",
    "md:col-span-5 aspect-square",
    "md:col-span-7 aspect-[16/11]",
  ];

  return (
    <>
      <ul className="grid gap-4 md:grid-cols-12 md:gap-6">
        {images.map((img, i) => (
          <li key={`${img.src}-${i}`} className={cn("relative", layout[i % layout.length])}>
            <button
              type="button"
              onClick={(e) => {
                opener.current = e.currentTarget;
                setOpen(i);
              }}
              className="group absolute inset-0 overflow-hidden bg-navy"
              aria-label={`Open image ${i + 1} of ${images.length}: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                priority={i === 0}
                className="object-cover transition-transform duration-[1400ms] ease-[var(--ease-luxe)] group-hover:scale-[1.04]"
              />
              <span className="eyebrow absolute bottom-4 right-4 bg-navy-deep/60 px-3 py-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                View ⤢
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open !== null && images[open] && (
        <div
          ref={dialog}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${open + 1} of ${images.length}`}
          className="fixed inset-0 z-[90] flex flex-col bg-navy-deep/95 text-white"
        >
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <p className="eyebrow text-white/70">
              {String(open + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </p>
            <button ref={closeBtn} type="button" onClick={close} className="eyebrow min-h-11 px-3 hover:text-gold">
              Close ✕
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={images[open].src} alt={images[open].alt} fill sizes="100vw" className="object-contain" />
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-5 md:px-8">
            <button
              type="button"
              onClick={() => step(-1)}
              className="eyebrow min-h-11 border border-line-light px-5 hover:border-gold hover:text-gold"
            >
              ← Previous
            </button>
            <p className="hidden max-w-lg text-center text-sm text-white/60 md:block">{images[open].alt}</p>
            <button
              type="button"
              onClick={() => step(1)}
              className="eyebrow min-h-11 border border-line-light px-5 hover:border-gold hover:text-gold"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
