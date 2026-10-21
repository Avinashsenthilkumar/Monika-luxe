import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProjectCard, { type ProjectCardData } from "@/components/projects/ProjectCard";

export default function FeaturedProjects({ projects }: { projects: ProjectCardData[] }) {
  const [a, b, c, d] = projects;
  return (
    <section aria-labelledby="work-title" className="bg-navy-deep text-white">
      <div className="container-luxe py-28 md:py-40">
        <div className="mb-16 flex flex-col justify-between gap-8 md:mb-24 md:flex-row md:items-end">
          <div>
            <Reveal>
              <p className="eyebrow mb-8 flex items-center gap-4 text-gold">
                <span aria-hidden className="h-px w-10 bg-current" /> Selected Work
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="work-title" className="max-w-3xl font-serif text-headline text-balance">
                Rooms We Have <em className="text-gold-light">Shaped.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <Link
              href="/projects"
              className="eyebrow inline-flex items-center gap-3 border-b border-gold/50 pb-1 hover:text-gold"
            >
              All portfolio collections →
            </Link>
          </Reveal>
        </div>

        <div className="grid gap-x-8 gap-y-20 md:grid-cols-12">
          {a && (
            <Reveal className="md:col-span-7">
              <ProjectCard project={a} index={0} aspect="aspect-[4/3]" sizes="(min-width: 768px) 58vw, 100vw" />
            </Reveal>
          )}
          {b && (
            <Reveal className="md:col-span-4 md:col-start-9 md:mt-40" delay={0.08}>
              <ProjectCard project={b} index={1} sizes="(min-width: 768px) 33vw, 100vw" />
            </Reveal>
          )}
          {c && (
            <Reveal className="md:col-span-5 md:col-start-2" delay={0.04}>
              <ProjectCard project={c} index={2} sizes="(min-width: 768px) 42vw, 100vw" />
            </Reveal>
          )}
          {d && (
            <Reveal className="md:col-span-5 md:col-start-8 md:mt-56" delay={0.1}>
              <ProjectCard project={d} index={3} aspect="aspect-[1/1]" sizes="(min-width: 768px) 42vw, 100vw" />
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
