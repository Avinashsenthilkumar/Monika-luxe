import type { Metadata } from "next";
import Link from "next/link";
import Philosophy from "@/components/home/Philosophy";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { company } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Design Philosophy",
  description:
    "The Monika Luxe design philosophy: every space should reflect elegance, comfort and individuality — built on quality craftsmanship, innovative design and timely execution.",
  path: "/philosophy",
});

export default function PhilosophyPage() {
  return (
    <>
      <PageHero
        eyebrow="Philosophy"
        title={
          <>
            Elegance, Comfort, <em className="text-gold-light">Individuality.</em>
          </>
        }
        intro={<p>{company.philosophy}</p>}
        crumbs={[{ name: "Philosophy", path: "/philosophy" }]}
      />
      <Philosophy />
      <section aria-labelledby="values-title" className="bg-white text-navy">
        <div className="container-luxe py-28 md:py-36">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4 text-slate">
              <span aria-hidden className="h-px w-10 bg-current" /> What we hold to
            </p>
            <h2 id="values-title" className="max-w-3xl font-serif text-headline">
              Three promises on <em className="text-slate">every project.</em>
            </h2>
          </Reveal>
          <ul className="mt-16 grid gap-px bg-navy/15 md:grid-cols-3">
            {company.values.map((v, i) => (
              <Reveal as="li" key={v} delay={i * 0.06} className="bg-white py-10 md:pr-10">
                <span className="eyebrow text-gold-deep">0{i + 1}</span>
                <p className="mt-4 font-serif text-4xl text-navy">{v}</p>
              </Reveal>
            ))}
          </ul>
          <Link
            href="/process"
            className="eyebrow mt-16 inline-flex border-b border-navy/30 pb-1 hover:border-gold hover:text-gold-deep"
          >
            See how we work →
          </Link>
        </div>
      </section>
      <ConsultationCTA id="philosophy-enquiry" />
    </>
  );
}
