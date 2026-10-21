import { chapters } from "./chapters";

/** Vertical chapter index; the active item is toggled by the timeline. */
export default function JourneyProgress() {
  return (
    <ol
      aria-hidden
      className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col gap-4 text-navy transition-colors duration-700 group-data-[tone=ivory]/stage:text-white md:right-8 md:flex"
    >
      {chapters.map((c, i) => (
        <li
          key={c.id}
          data-progress-item={i}
          className="group/item flex items-center justify-end gap-3 font-mono text-[0.6rem] uppercase tracking-[0.2em] opacity-40 transition-opacity duration-500 data-[active=true]:opacity-100"
        >
          <span className="translate-x-2 opacity-0 transition-all duration-500 group-data-[active=true]/item:translate-x-0 group-data-[active=true]/item:opacity-100">
            {c.label}
          </span>
          <span className="w-5 text-right">{c.index}</span>
          <span className="h-px w-4 bg-current transition-all duration-500 group-data-[active=true]/item:w-10 group-data-[active=true]/item:bg-gold" />
        </li>
      ))}
    </ol>
  );
}
