import Reveal from "@/components/ui/Reveal";
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  return (
    <section id="testimonials" aria-labelledby="testimonials-title" className="bg-white text-navy">
      <div className="container-luxe py-20 md:py-28">
        <Reveal>
          <p className="eyebrow mb-8 flex items-center gap-4 text-slate">
            <span aria-hidden className="h-px w-10 bg-current" /> In Their Words
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id="testimonials-title" className="sr-only">
            Client testimonials
          </h2>
          <figure>
            <blockquote className="max-w-5xl font-serif text-[clamp(2.2rem,5vw,5rem)] leading-[1.04] text-balance">
              <span aria-hidden className="text-gold">
                “
              </span>
              {testimonials[0].quote}
              <span aria-hidden className="text-gold">
                ”
              </span>
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium">{testimonials[0].name}</span>
              <span aria-hidden className="h-px w-8 bg-navy/30" />
              <span className="text-navy/60">
                {testimonials[0].location} · {testimonials[0].context}
              </span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-20 grid gap-px bg-navy/15 md:mt-28 md:grid-cols-2">
          {testimonials.slice(1).map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className="bg-white py-10 md:py-12 md:pr-14 md:even:pl-14">
              <figure>
                <blockquote className="font-serif text-3xl leading-[1.15] md:text-4xl">“{t.quote}”</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-navy/60">
                    {" "}
                    — {t.location} · {t.context}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
