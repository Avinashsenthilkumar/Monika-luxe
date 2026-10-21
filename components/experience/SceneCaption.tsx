import type { Chapter } from "./chapters";
import { cn } from "@/lib/utils";

/** One caption per film chapter; the journey timeline fades them in and out. */
export default function SceneCaption({ chapter, first = false }: { chapter: Chapter; first?: boolean }) {
  return (
    <div
      data-caption={chapter.id}
      className={cn(
        "pointer-events-none absolute bottom-20 left-4 right-4 max-w-xl p-5 md:bottom-16 md:left-10 md:p-7",
        chapter.tone === "ink" ? "bg-white/90 text-navy" : "bg-navy-deep/70 text-white",
        !first && "invisible opacity-0",
      )}
    >
      <p className={cn("eyebrow mb-4 flex items-center gap-3", chapter.tone === "ink" ? "text-slate" : "text-gold")}>
        <span>{chapter.index}</span>
        <span aria-hidden className="h-px w-8 bg-current" />
        <span>{chapter.label}</span>
      </p>
      <h3 className="font-serif text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.02] text-balance">{chapter.title}</h3>
      {chapter.text && (
        <p
          className={cn(
            "mt-4 max-w-md text-sm leading-relaxed md:text-base",
            chapter.tone === "ink" ? "text-navy/70" : "text-white/75",
          )}
        >
          {chapter.text}
        </p>
      )}
    </div>
  );
}
