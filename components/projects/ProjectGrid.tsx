"use client";

import { useMemo, useState } from "react";
import ProjectCard, { type ProjectCardData } from "./ProjectCard";
import { cn } from "@/lib/utils";

/** Filterable portfolio. Filters are generated only from categories that have data. */
export default function ProjectGrid({ projects }: { projects: ProjectCardData[] }) {
  const filters = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      set.add(p.sector);
      set.add(p.category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);
  const [active, setActive] = useState("All");
  const visible = active === "All" ? projects : projects.filter((p) => p.category === active || p.sector === active);

  return (
    <div>
      <div role="group" aria-label="Filter portfolio" className="mb-14 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={active === f}
            onClick={() => setActive(f)}
            className={cn(
              "min-h-11 border px-5 text-[0.72rem] uppercase tracking-[0.16em] transition-colors",
              active === f
                ? "border-gold bg-gold text-navy-deep"
                : "border-line-light text-white/75 hover:border-gold hover:text-gold",
            )}
          >
            {f}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "collection" : "collections"}
      </p>
      <ul className="grid gap-x-8 gap-y-20 md:grid-cols-2">
        {visible.map((p, i) => (
          <li key={p.slug} className={cn(i % 2 === 1 && "md:mt-32")}>
            <ProjectCard project={p} index={projects.indexOf(p)} aspect={i % 3 === 0 ? "aspect-[4/5]" : "aspect-[4/3]"} />
          </li>
        ))}
      </ul>
    </div>
  );
}
