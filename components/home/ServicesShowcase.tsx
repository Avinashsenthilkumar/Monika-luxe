import Link from "next/link";
import ImageReveal from "@/components/ui/ImageReveal";
import Reveal from "@/components/ui/Reveal";
import ServiceMotif from "@/components/services/ServiceMotif";
import type { ResolvedImage } from "@/lib/assets";
import type { Service } from "@/lib/content";
import { cn } from "@/lib/utils";

export interface ServiceWithImage extends Service {
  resolved: ResolvedImage[];
}

/** Alternating full-width editorial sections — no icon-card grids. */
export default function ServicesShowcase({ items }: { items: ServiceWithImage[] }) {
  return (
    <section aria-labelledby="services-title" className="bg-mist text-navy">
      <div className="container-luxe pb-10 pt-20 md:pt-28">
        <Reveal>
          <p className="eyebrow mb-8 flex items-center gap-4 text-slate">
            <span aria-hidden className="h-px w-10 bg-current" /> Services
          </p>
        </Reveal>
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-8" delay={0.05}>
            <h2 id="services-title" className="font-serif text-headline text-balance">
              Every Detail. <em className="text-slate">A Different Feeling.</em>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4" delay={0.1}>
            <p className="leading-relaxed text-navy/65">
              Interiors, construction and finishing under one roof — so the idea on paper is the home you walk into.
            </p>
          </Reveal>
        </div>
      </div>

      {items.map((s, i) => {
        const flip = i % 2 === 1;
        const dark = i % 3 === 2;
        return (
          <article
            key={s.slug}
            id={`service-${s.slug}`}
            aria-labelledby={`service-title-${s.slug}`}
            className={cn("relative", dark ? "bg-navy text-white" : "bg-mist text-navy")}
          >
            <div className={cn("container-luxe grid gap-10 py-16 md:grid-cols-12 md:items-center md:gap-0 md:py-24")}>
              <div className={cn("md:col-span-7", flip && "md:order-2 md:col-start-6")}>
                {s.resolved.length > 0 ? (
                  <ImageReveal
                    image={s.resolved[0]}
                    direction={flip ? "right" : "left"}
                    sizes="(min-width: 768px) 58vw, 100vw"
                    className="aspect-[4/3] w-full md:aspect-[16/11]"
                  />
                ) : (
                  <ServiceMotif
                    variant={s.motif}
                    tone={dark ? "dark" : "light"}
                    className="aspect-[4/3] w-full md:aspect-[16/11]"
                  />
                )}
              </div>
              <div className={cn("md:col-span-4", flip ? "md:order-1 md:col-start-1" : "md:col-start-9")}>
                <Reveal>
                  <p className={cn("eyebrow mb-6", dark ? "text-gold" : "text-slate")}>
                    Section {s.index} — {s.eyebrow}
                  </p>
                  <h3
                    id={`service-title-${s.slug}`}
                    className="font-serif text-[clamp(2.2rem,3.6vw,3.6rem)] leading-[1.02] text-balance"
                  >
                    {s.title}
                  </h3>
                  <p className={cn("mt-6 leading-relaxed", dark ? "text-white/70" : "text-navy/70")}>{s.summary}</p>
                  <ul className={cn("mt-8 border-t", dark ? "border-line-light" : "border-navy/15")}>
                    {s.scope.map((x) => (
                      <li
                        key={x}
                        className={cn(
                          "flex items-center justify-between border-b py-3 text-sm",
                          dark ? "border-line-light" : "border-navy/15",
                        )}
                      >
                        {x}
                        <span aria-hidden className="text-gold">
                          +
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-6">
                    <Link
                      href={`/contact?service=${encodeURIComponent(s.slug)}#enquiry`}
                      className={cn(
                        "inline-flex min-h-11 items-center px-6 text-[0.72rem] uppercase tracking-[0.2em] transition-colors",
                        dark ? "bg-gold text-navy-deep hover:bg-white" : "bg-navy text-white hover:bg-gold hover:text-navy-deep",
                      )}
                    >
                      Enquire
                    </Link>
                    <Link
                      href={`/services/${s.slug}`}
                      className="eyebrow border-b border-current/30 pb-1 transition-colors hover:text-gold"
                    >
                      Learn more →
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
