"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { processSteps } from "@/lib/content";

/**
 * "From First Conversation to Final Reveal" — a gold construction line draws
 * down the timeline as you scroll and each stage's frame is drafted in turn.
 */
export default function DesignProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-process-line]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-process-list]", start: "top 70%", end: "bottom 60%", scrub: true },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-process-step]").forEach((step) => {
          const edges = step.querySelectorAll<HTMLElement>("[data-edge]");
          const content = step.querySelectorAll("[data-process-content]");
          const tl = gsap.timeline({
            scrollTrigger: { trigger: step, start: "top 72%", toggleActions: "play none none reverse" },
          });
          edges.forEach((edge, i) => {
            const prop = i % 2 === 0 ? "scaleX" : "scaleY";
            tl.fromTo(edge, { [prop]: 0 }, { [prop]: 1, duration: 0.28, ease: "power1.inOut" }, i * 0.26);
          });
          tl.fromTo(
            content,
            { autoAlpha: 0, x: 20 },
            { autoAlpha: 1, x: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
            0.25,
          );
          tl.fromTo(step.querySelector("[data-process-dot]"), { scale: 0 }, { scale: 1, duration: 0.4 }, 0);
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" aria-labelledby="process-title" className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgb(255_255_255/0.6)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.6)_1px,transparent_1px)] [background-size:64px_64px]"
      />
      <div className="container-luxe relative py-28 md:py-40">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:sticky md:top-32 md:col-span-5 md:self-start">
            <p className="eyebrow mb-8 flex items-center gap-4 text-gold">
              <span aria-hidden className="h-px w-10 bg-current" /> Process
            </p>
            <h2 id="process-title" className="font-serif text-headline text-balance">
              From First Conversation <em className="text-gold-light">to Final Reveal.</em>
            </h2>
            <p className="mt-8 max-w-md leading-relaxed text-white/60">
              A clear sequence, one coordinated team. Timelines depend on the scope of each project and are agreed with you during
              planning.
            </p>
          </div>

          <ol data-process-list className="relative md:col-span-6 md:col-start-7">
            <span aria-hidden className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-white/10" />
            <span
              aria-hidden
              data-process-line
              className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-gold"
            />
            {processSteps.map((step) => (
              <li key={step.index} data-process-step className="relative pb-14 pl-12 last:pb-0">
                <span
                  aria-hidden
                  data-process-dot
                  className="absolute left-0 top-6 h-[15px] w-[15px] rounded-full border border-gold bg-navy"
                />
                <div className="relative p-6 md:p-8">
                  <span aria-hidden data-edge className="absolute left-0 top-0 h-px w-full origin-left bg-gold/70" />
                  <span aria-hidden data-edge className="absolute right-0 top-0 h-full w-px origin-top bg-gold/70" />
                  <span aria-hidden data-edge className="absolute bottom-0 right-0 h-px w-full origin-right bg-gold/70" />
                  <span aria-hidden data-edge className="absolute bottom-0 left-0 h-full w-px origin-bottom bg-gold/70" />
                  <p data-process-content className="eyebrow text-gold">
                    Stage {step.index}
                  </p>
                  <h3 data-process-content className="mt-3 font-serif text-3xl md:text-4xl">
                    {step.title}
                  </h3>
                  <p data-process-content className="mt-3 max-w-md text-white/65">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
