import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import type { ResolvedImage } from "@/lib/assets";
import { company } from "@/lib/content";

export default function StudioIntroduction({ founder }: { founder: ResolvedImage }) {
  return (
    <section id="studio" aria-labelledby="studio-title" className="relative bg-white text-navy">
      <div className="container-luxe py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="eyebrow mb-8 flex items-center gap-4 text-slate">
                <span aria-hidden className="h-px w-10 bg-current" /> The Studio
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="studio-title" className="font-serif text-headline text-balance">
                Spaces That Feel Like <em className="text-slate">They Were Always Yours.</em>
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col justify-end md:col-span-5">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-navy/75">{company.intro}</p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-6 leading-relaxed text-navy/65">
                From luxury home interiors and modular kitchens to complete construction, renovation, painting and rooftop
                gardens, we offer end-to-end turnkey solutions — guided by a simple belief:{" "}
                <span className="text-navy">{company.philosophy.toLowerCase()}</span>
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 h-px bg-navy/15 md:mt-28" />

        <div className="mt-16 grid gap-12 md:mt-20 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-4">
            <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden bg-gold-light">
              <Image
                src={founder.src}
                alt={founder.alt}
                fill
                sizes="(min-width: 768px) 30vw, 90vw"
                className="object-cover grayscale-[25%]"
              />
            </div>
          </Reveal>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="eyebrow mb-6 text-slate">Founder · Interior Designer · Civil Engineer</p>
              <p className="font-serif text-[clamp(1.8rem,3.2vw,3rem)] leading-[1.1] text-balance">
                Er. V. Monika combines creative design with engineering expertise — her vision is to transform every project into
                a masterpiece, balancing beauty, function and long-term value.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-10 grid grid-cols-1 gap-px bg-navy/15 sm:grid-cols-3">
                {company.values.map((v, i) => (
                  <li key={v} className="bg-white py-5 pr-4">
                    <span className="eyebrow block text-slate">0{i + 1}</span>
                    <span className="mt-2 block text-sm">{v}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/about"
                className="eyebrow mt-10 inline-flex items-center gap-3 border-b border-navy/30 pb-1 transition-colors hover:border-gold hover:text-gold"
              >
                Meet the studio →
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
