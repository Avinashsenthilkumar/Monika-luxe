import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbJsonLd } from "@/lib/seo";

export default function PageHero({
  eyebrow,
  title,
  intro,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  crumbs: Array<{ name: string; path: string }>;
  children?: ReactNode;
}) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <section className="relative overflow-hidden bg-navy-deep pb-20 pt-40 text-white md:pb-28 md:pt-52">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(all)) }} />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(rgb(255_255_255/0.7)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/0.7)_1px,transparent_1px)] [background-size:96px_96px]"
      />
      <div className="container-luxe relative">
        <nav aria-label="Breadcrumb" className="mb-10">
          <ol className="eyebrow flex flex-wrap items-center gap-2 text-white/50">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-2">
                {i < all.length - 1 ? (
                  <>
                    <Link href={c.path} className="hover:text-gold">
                      {c.name}
                    </Link>
                    <span aria-hidden>/</span>
                  </>
                ) : (
                  <span aria-current="page" className="text-white/80">
                    {c.name}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <p className="eyebrow mb-6 flex items-center gap-4 text-gold">
          <span aria-hidden className="h-px w-10 bg-current" /> {eyebrow}
        </p>
        <h1 className="max-w-5xl font-serif text-display text-balance">
          <span className="reveal-line">
            <span className="gold-foil animate-rise">{title}</span>
          </span>
        </h1>
        {intro && (
          <div className="animate-fade mt-10 max-w-2xl text-lg leading-relaxed text-white/65 [animation-delay:250ms]">
            {intro}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
