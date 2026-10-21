import type { Metadata } from "next";
import Link from "next/link";
import ServicesShowcase from "@/components/home/ServicesShowcase";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PageHero from "@/components/ui/PageHero";
import { resolveIds } from "@/lib/assets.server";
import { services } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services — Interiors, Kitchens, Construction & Renovation",
  description:
    "Luxury interior design, modular kitchens, complete construction, renovation, commercial interiors, painting and rooftop gardening in Thanjavur, Tamil Nadu.",
  path: "/services",
});

export default function ServicesPage() {
  const items = services.map((s) => ({ ...s, resolved: resolveIds(s.images.slice(0, 1)) }));
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Interiors to Construction, <em className="text-gold-light">Under One Roof.</em>
          </>
        }
        intro={
          <p>
            Premium interior design and construction, from a single room to a complete home — planned and executed by one team.
          </p>
        }
        crumbs={[{ name: "Services", path: "/services" }]}
      >
        <nav aria-label="Services" className="mt-14 flex flex-wrap gap-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="border border-line-light px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.16em] text-white/75 transition-colors hover:border-gold hover:text-gold"
            >
              {s.title}
            </Link>
          ))}
        </nav>
      </PageHero>
      <ServicesShowcase items={items} />
      <ConsultationCTA id="services-enquiry" />
    </>
  );
}
