import Image from "next/image";
import Link from "next/link";
import type { ResolvedImage } from "@/lib/assets";
import { cn } from "@/lib/utils";

export interface ProjectCardData {
  slug: string;
  title: string;
  category: string;
  sector: string;
  count: number;
  cover: ResolvedImage;
  description: string;
}

export default function ProjectCard({
  project,
  className,
  aspect = "aspect-[4/5]",
  sizes = "(min-width: 768px) 50vw, 100vw",
  index,
}: {
  project: ProjectCardData;
  className?: string;
  aspect?: string;
  sizes?: string;
  index?: number;
}) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-navy", aspect)}>
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxe)] group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100" />
        <span className="eyebrow absolute left-5 top-5 bg-navy-deep/60 px-3 py-1.5 text-white">{project.category}</span>
        <span className="eyebrow absolute bottom-5 right-5 text-white/80">{project.count} images</span>
      </div>
      <div className="mt-5 flex items-baseline justify-between gap-6">
        <h3 className="font-serif text-3xl transition-colors group-hover:text-gold md:text-4xl">
          {typeof index === "number" && (
            <span className="eyebrow mr-4 align-middle text-slate">{String(index + 1).padStart(2, "0")}</span>
          )}
          {project.title}
        </h3>
        <span aria-hidden className="text-xl transition-transform duration-500 group-hover:translate-x-1">
          →
        </span>
      </div>
      <p className="mt-2 max-w-md text-sm leading-relaxed opacity-65">{project.description}</p>
    </Link>
  );
}
