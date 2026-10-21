import Reveal from "@/components/ui/Reveal";
import { philosophy } from "@/lib/content";

export default function Philosophy() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="relative overflow-hidden bg-navy-deep text-white">
      <div className="container-luxe py-20 md:py-28">
        <div className="grid gap-16 md:grid-cols-12">
          <div className="md:sticky md:top-32 md:col-span-5 md:self-start">
            <Reveal>
              <p className="eyebrow mb-8 flex items-center gap-4 text-gold">
                <span aria-hidden className="h-px w-10 bg-current" /> Philosophy
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 id="philosophy-title" className="font-serif text-headline text-balance">
                Good Design Is Felt <em className="text-gold-light">Before It Is Explained.</em>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 max-w-md leading-relaxed text-white/60">
                Elegance, comfort and individuality — built on quality craftsmanship, innovative design and timely execution.
              </p>
            </Reveal>
          </div>

          <ol className="md:col-span-6 md:col-start-7">
            {philosophy.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 0.04} className="group border-t border-line-light py-9 last:border-b">
                <div className="flex gap-8">
                  <span className="eyebrow pt-2 text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-serif text-3xl transition-colors duration-500 group-hover:text-gold md:text-4xl">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-md text-white/60">{item.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
