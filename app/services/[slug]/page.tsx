import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ConsultationForm from "@/components/forms/ConsultationForm";
import BeforeAfterSlider from "@/components/projects/BeforeAfterSlider";
import ServiceMotif from "@/components/services/ServiceMotif";
import ImageReveal from "@/components/ui/ImageReveal";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { resolveIds } from "@/lib/assets.server";
import { beforeAfterPairs } from "@/lib/before-after";
import { getService, projects, serviceToProjectType, services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({ title: s.seo.title, description: s.seo.description, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Params }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const images = resolveIds(s.images);
  const related = projects.filter((p) => p.images.some((id) => s.images.includes(id)));
  const pairs = beforeAfterPairs.filter((p) => p.service === s.slug);
  const idx = services.findIndex((x) => x.slug === s.slug);
  const next = services[(idx + 1) % services.length];

  return (
    <>
      <PageHero
        eyebrow={`Service ${s.index} — ${s.eyebrow}`}
        title={s.title}
        intro={<p>{s.summary}</p>}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: s.title, path: `/services/${s.slug}` },
        ]}
      />

      <section className="bg-white text-navy">
        <div className="container-luxe grid gap-14 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            {images[0] ? (
              <ImageReveal image={images[0]} priority sizes="(min-width: 768px) 58vw, 100vw" className="aspect-[4/3] w-full" />
            ) : (
              <ServiceMotif variant={s.motif} tone="light" className="aspect-[4/3] w-full" />
            )}
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <Reveal>
              <h2 className="font-serif text-4xl leading-tight">How we approach it</h2>
              {s.body.map((para) => (
                <p key={para.slice(0, 24)} className="mt-6 leading-relaxed text-navy/75">
                  {para}
                </p>
              ))}
              <h3 className="eyebrow mt-12 text-slate">Typically covers</h3>
              <ul className="mt-4 border-t border-navy/15">
                {s.scope.map((x) => (
                  <li key={x} className="flex justify-between border-b border-navy/15 py-3 text-sm">
                    {x}{" "}
                    <span aria-hidden className="text-gold">
                      +
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>

        {images.length > 1 && (
          <div className="container-luxe grid grid-cols-2 gap-4 pb-24 md:grid-cols-4 md:pb-32">
            {images.slice(1).map((img) => (
              <div key={img.src} className="relative aspect-square overflow-hidden bg-gold-light">
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover" />
              </div>
            ))}
          </div>
        )}

        {pairs.length > 0 && (
          <div className="container-luxe pb-24 md:pb-32">
            <h2 className="mb-10 font-serif text-4xl">Before &amp; after</h2>
            <div className="grid gap-12">
              {pairs.map((pair) => (
                <BeforeAfterSlider key={pair.id} before={pair.before} after={pair.after} caption={pair.caption} />
              ))}
            </div>
          </div>
        )}

        {related.length > 0 && (
          <div className="container-luxe pb-24 md:pb-32">
            <p className="eyebrow mb-4 text-slate">From the portfolio</p>
            <ul className="flex flex-wrap gap-6">
              {related.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="font-serif text-3xl underline decoration-gold/50 underline-offset-8 hover:text-gold"
                  >
                    {p.title} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section id="enquiry" aria-labelledby="service-enquiry-title" className="bg-navy-deep text-white">
        <div className="container-luxe grid gap-14 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-4">
            <p className="eyebrow mb-6 text-gold">Enquire</p>
            <h2 id="service-enquiry-title" className="font-serif text-5xl leading-[1.02]">
              Start a {s.eyebrow.toLowerCase()} conversation.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <ConsultationForm defaultProjectType={serviceToProjectType[s.slug]} />
          </div>
        </div>
      </section>

      <Link href={`/services/${next.slug}`} className="group block bg-navy text-white">
        <div className="container-luxe flex items-center justify-between py-16">
          <div>
            <p className="eyebrow text-slate">Next service</p>
            <p className="mt-3 font-serif text-4xl transition-colors group-hover:text-gold md:text-6xl">{next.title}</p>
          </div>
          <span aria-hidden className="text-4xl transition-transform group-hover:translate-x-2">
            →
          </span>
        </div>
      </Link>
    </>
  );
}
