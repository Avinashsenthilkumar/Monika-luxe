"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import type { ResolvedImage } from "@/lib/assets";

/** Clip-path wipe + slow settle as the image enters the viewport. */
export default function ImageReveal({
  image,
  className,
  sizes = "100vw",
  priority = false,
  direction = "up",
  parallax = false,
}: {
  image: ResolvedImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  direction?: "up" | "left" | "right";
  parallax?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const from =
          direction === "left" ? "inset(0 100% 0 0)" : direction === "right" ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)";
        gsap.fromTo(
          wrap.current,
          { clipPath: from },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: { trigger: wrap.current, start: "top 85%", once: true },
          },
        );
        gsap.fromTo(
          inner.current,
          { scale: 1.18 },
          {
            scale: 1,
            duration: 2,
            ease: "expo.out",
            scrollTrigger: { trigger: wrap.current, start: "top 85%", once: true },
          },
        );
        if (parallax) {
          gsap.fromTo(
            inner.current,
            { yPercent: -4 },
            {
              yPercent: 4,
              ease: "none",
              scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }
      });
      return () => mm.revert();
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={cn("relative overflow-hidden bg-navy", className)}>
      <div ref={inner} className="absolute -inset-[5%]">
        <Image src={image.src} alt={image.alt} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    </div>
  );
}
