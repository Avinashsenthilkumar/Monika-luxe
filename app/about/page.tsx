import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Testimonials from "@/components/home/Testimonials";
import ConsultationCTA from "@/components/home/ConsultationCTA";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import { resolveId } from "@/lib/assets.server";
import { company, team } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About the Studio — Founder & Team",
  description:
    "Meet Monika Luxe Construction & Interiors, Thanjavur — founded by civil engineer Er. V. Monika, with a team of engineers, an architect and site specialists.",
  path: "/about",
});

export default function AboutPage() {
  const [founder, ...rest] = team;
  const founderImg = resolveId(founder.image);
  return (
    <>
      <PageHero
        eyebrow="About the studio"
        title={
          <>
            Design & Engineering, <em className="text-gold-light">One Team.</em>
          </>
        }
        intro={<p>{company.intro}</p>}
        crumbs={[{ name: "About", path: "/about" }]}
      />

      {/* Founder */}
      <section aria-labelledby="founder-title" className="bg-white text-navy">
        <div className="container-luxe grid gap-14 py-20 md:grid-cols-12 md:py-28">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-gold-light">
              <Image
                src={founderImg.src}
                alt={founderImg.alt}
                fill
                priority
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <div className="flex flex-col justify-center md:col-span-6 md:col-start-7">
            <Reveal>
              <p className="eyebrow mb-6 text-slate">Founder · Interior Designer · Civil Engineer</p>
              <h2 id="founder-title" className="font-serif text-headline">
                {founder.name}
              </h2>
              <p className="mt-3 text-sm text-navy/60">{founder.qualifications}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="mt-10 font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.15]">
                Combining creative design with engineering expertise, her vision is to transform every project into a masterpiece
                — balancing beauty, function and long-term value.
              </p>
              <p className="mt-8 leading-relaxed text-navy/70">
                {founder.bio} She has delivered residential and commercial projects across Tamil Nadu.
              </p>
              <ul className="mt-10 flex flex-wrap gap-2">
                {founder.focus.map((f) => (
                  <li key={f} className="border border-navy/20 px-3 py-1.5 text-xs uppercase tracking-[0.14em]">
                    {f}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Team */}
      <section id="team" aria-labelledby="team-title" className="bg-mist text-navy">
        <div className="container-luxe py-20 md:py-28">
          <Reveal>
            <p className="eyebrow mb-8 flex items-center gap-4 text-slate">
              <span aria-hidden className="h-px w-10 bg-current" /> The Team
            </p>
            <h2 id="team-title" className="max-w-3xl font-serif text-headline text-balance">
              Engineers, an architect, <em className="text-slate">and people on site every day.</em>
            </h2>
          </Reveal>
          <ul className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((m, i) => {
              const img = resolveId(m.image);
              return (
                <Reveal as="li" key={m.name} delay={(i % 3) * 0.06}>
                  <article>
                    <div className="relative aspect-[4/5] overflow-hidden bg-gold-light">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl">{m.name}</h3>
                    <p className="eyebrow mt-2 text-slate">{m.role}</p>
                    <p className="mt-4 text-sm text-navy/60">{m.qualifications}</p>
                    {m.bio && <p className="mt-3 text-sm leading-relaxed text-navy/75">{m.bio}</p>}
                    {m.credentials && (
                      <ul className="mt-4 space-y-1.5 border-l border-gold/60 pl-4 text-xs leading-relaxed text-navy/70">
                        {m.credentials.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    )}
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {m.focus.map((f) => (
                        <li
                          key={f}
                          className="border border-navy/15 px-2.5 py-1 text-[0.65rem] uppercase tracking-[0.12em] text-navy/70"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </article>
                </Reveal>
              );
            })}
          </ul>
          <div className="mt-20">
            <Link
              href="/contact#enquiry"
              className="eyebrow inline-flex items-center gap-3 border-b border-navy/30 pb-1 hover:border-gold hover:text-gold"
            >
              Talk to the team →
            </Link>
          </div>
        </div>
      </section>

      <Testimonials />
      <ConsultationCTA id="about-enquiry" />
    </>
  );
}
