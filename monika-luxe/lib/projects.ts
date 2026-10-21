import type { ProjectCardData } from "@/components/projects/ProjectCard";
import { resolveId } from "./assets.server";
import type { Project } from "./content";

export function toCardData(p: Project): ProjectCardData {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    sector: p.sector,
    count: p.images.length,
    cover: resolveId(p.images[0]),
    description: p.description,
  };
}
