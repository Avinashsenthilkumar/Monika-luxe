import Image from "next/image";
import Link from "next/link";
import { chapters } from "./chapters";
import PlanDrawing from "./PlanDrawing";
import type { RoomSlide } from "./InteriorRevealScene";

/**
 * Static version of the journey for reduced-motion users and devices without
 * WebGL. Same story, same content — no scroll-linked motion.
 */
export default function ExperienceFallback({ rooms }: { rooms: RoomSlide[] }) {
  const [blueprint, structure, materials, enter] = chapters;
  return (
    <section id="journey" aria-label="From blueprint to finished home" className="bg-white text-navy">
      <div className="container-luxe grid gap-12 py-24 md:grid-cols-2 md:items-center md:py-32">
        <div>
          <p className="eyebrow mb-5 text-slate">
            {blueprint.index} — {blueprint.label}
          </p>
          <h2 className="font-serif text-headline text-balance">{blueprint.title}</h2>
          <p className="mt-6 max-w-md text-navy/70">{blueprint.text}</p>
          <ol className="mt-12 space-y-8 border-l border-navy/15 pl-6">
            {[structure, materials, enter].map((c) => (
              <li key={c.id}>
                <p className="eyebrow mb-2 text-slate">
                  {c.index} — {c.label}
                </p>
                <p className="font-serif text-2xl">{c.title}</p>
                <p className="mt-2 max-w-md text-sm text-navy/70">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="blueprint-grid border border-navy/15 bg-mist p-6">
          <PlanDrawing className="h-auto w-full" />
          <p className="eyebrow mt-4 text-navy/50">Illustrative concept · not a client project</p>
        </div>
      </div>

      <div className="bg-navy-deep py-24 text-white md:py-32">
        <div className="container-luxe">
          <p className="eyebrow mb-5 text-gold">05 — Interiors</p>
          <h2 className="font-serif text-headline">Room by room.</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {rooms.map((room) => (
              <Link key={room.id} href={room.href} className="group block">
                {room.image && (
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                    <Image
                      src={room.image.src}
                      alt={room.image.alt}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="mt-4 flex items-baseline justify-between gap-4">
                  <h3 className="font-sans text-3xl font-extralight uppercase">{room.title}</h3>
                  <span className="eyebrow text-gold">View →</span>
                </div>
                <p className="mt-2 max-w-md text-sm text-white/65">{room.text}</p>
              </Link>
            ))}
          </div>

          <div className="mt-24 max-w-3xl">
            <h2 className="font-serif text-display">
              Your Vision. <em className="text-gold-light">Our Craft.</em>
            </h2>
            <p className="mt-8 max-w-lg text-white/75">
              From the first architectural line to the final finishing detail, we bring thoughtfully designed spaces to life.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/contact#enquiry"
                className="inline-flex min-h-12 items-center bg-gold px-7 text-[0.75rem] uppercase tracking-[0.2em] text-navy-deep hover:bg-white"
              >
                Start Your Project
              </Link>
              <Link
                href="/projects"
                className="inline-flex min-h-12 items-center border border-white/40 px-7 text-[0.75rem] uppercase tracking-[0.2em] hover:border-gold hover:text-gold"
              >
                Explore Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
