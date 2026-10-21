import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectGallery from "@/components/projects/ProjectGallery";
import PageHero from "@/components/ui/PageHero";
import { resolveIds } from "@/lib/assets.server";
import { getProject, projects, services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.title} — Portfolio`,
    description: `${p.description} Interior design by Monika Luxe, Thanjavur.`,
    path: `/projects/${p.slug}`,
  });
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const images = resolveIds(p.images);
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const service = services.find((s) => s.images.some((id) => p.images.includes(id)));

  return (
    <>
      <PageHero
        eyebrow={`${p.sector} · ${p.category}`}
        title={p.title}
        intro={<p>{p.description}</p>}
        crumbs={[
          { name: "Projects", path: "/projects" },
          { name: p.title, path: `/projects/${p.slug}` },
        ]}
      >
        <dl className="mt-14 grid max-w-3xl grid-cols-2 gap-px bg-line-light text-sm md:grid-cols-3">
          <div className="bg-navy-deep py-4 pr-4">
            <dt className="eyebrow text-slate">Category</dt>
            <dd className="mt-2">{p.category}</dd>
          </div>
          <div className="bg-navy-deep py-4 pr-4">
            <dt className="eyebrow text-slate">Sector</dt>
            <dd className="mt-2">{p.sector}</dd>
          </div>
          {p.location && (
            <div className="bg-navy-deep py-4 pr-4">
              <dt className="eyebrow text-slate">Location</dt>
              <dd className="mt-2">{p.location}</dd>
            </div>
          )}
          <div className="col-span-2 bg-navy-deep py-4 pr-4 md:col-span-3">
            <dt className="eyebrow text-slate">Design highlights</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {p.highlights.map((h) => (
                <span key={h} className="border border-line-light px-3 py-1 text-xs uppercase tracking-[0.12em]">
                  {h}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </PageHero>

      <section aria-label={`${p.title} gallery`} className="bg-navy-deep pb-20 text-white md:pb-28">
        <div className="container-luxe">
          <ProjectGallery images={images} title={p.title} />
          <div className="mt-20 flex flex-col gap-6 border-t border-line-light pt-10 md:flex-row md:items-center md:justify-between">
            <p className="max-w-xl text-white/65">Planning something similar? Tell us about your space.</p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={service ? `/contact?service=${service.slug}#enquiry` : "/contact#enquiry"}
                className="inline-flex min-h-12 items-center bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep hover:bg-white"
              >
                Start Your Project
              </Link>
              {service && (
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex min-h-12 items-center border border-line-light px-7 text-[0.75rem] uppercase tracking-[0.2em] hover:border-gold hover:text-gold"
                >
                  {service.title}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <Link href={`/projects/${next.slug}`} className="group block bg-navy text-white">
        <div className="container-luxe flex items-center justify-between py-16">
          <div>
            <p className="eyebrow text-slate">Next collection</p>
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
