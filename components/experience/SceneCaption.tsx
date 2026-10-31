import type { Chapter } from "./chapters";
import { cn } from "@/lib/utils";

/** One caption per film chapter; the journey timeline fades them in and out. */
export default function SceneCaption({ chapter, first = false, film = false }: { chapter: Chapter; first?: boolean; film?: boolean }) {
  return (
    <div
      data-caption={chapter.id}
      className={cn(
        "pointer-events-none absolute bottom-[calc(env(safe-area-inset-bottom,0px)+5.75rem)] left-4 right-4 max-w-xl p-5 md:bottom-16 md:left-10 md:p-7",
        chapter.tone === "ink" ? "bg-white/90 text-navy" : "bg-navy-deep/70 text-white",
        // over the rendered film: a gold-edged panel on desktop; on phones the text sits under the film screen
        film && "md:border-l-2 md:border-gold max-md:bg-transparent max-md:p-0 max-md:text-white",
        !first && "invisible opacity-0",
      )}
    >
      <p className={cn("eyebrow mb-4 flex items-center gap-3", chapter.tone === "ink" ? "text-slate" : "text-gold", film && "max-md:mb-3 max-md:text-gold")}>
        <span>{chapter.index}</span>
        <span aria-hidden className="h-px w-8 bg-current" />
        <span>{chapter.label}</span>
      </p>
      <h3
        className={cn(
          "font-serif text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.02] text-balance",
          film && "max-md:text-[1.8rem] max-md:text-gold-light",
        )}
      >{chapter.title}</h3>
      {chapter.text && (
        <p
          className={cn(
            "mt-4 max-w-md text-sm leading-relaxed md:text-base",
            chapter.tone === "ink" ? "text-navy/70" : "text-white/75",
            film && "max-md:mt-2.5 max-md:text-white/75",
          )}
        >
          {chapter.text}
        </p>
      )}
    </div>
  );
}
