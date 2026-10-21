import Image from "next/image";
import Link from "next/link";
import type { ResolvedImage } from "@/lib/assets";

export interface RoomSlide {
  id: string;
  title: string;
  kicker: string;
  text: string;
  href: string;
  image: ResolvedImage;
}

/**
 * Interior chapters — the company's own portfolio photography presented as a
 * room-by-room camera sequence. Each layer is wiped in by the journey timeline.
 */
export default function InteriorRevealScene({ rooms }: { rooms: RoomSlide[] }) {
  return (
    <div data-rooms className="invisible absolute inset-0 opacity-0">
      {rooms.map((room, i) => (
        <div key={room.id} data-room={i} className="absolute inset-0 overflow-hidden bg-navy-deep [clip-path:inset(0_0_0_100%)]">
          <div data-room-media className="absolute inset-0 scale-125">
            <Image src={room.image.src} alt={room.image.alt} fill sizes="100vw" className="object-cover" loading="lazy" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/20 to-navy-deep/40" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-24 md:px-14 md:pb-20">
            <p data-room-kicker className="eyebrow mb-4 flex items-center gap-3 text-gold">
              <span>
                05 · {String(i + 1).padStart(2, "0")} / {String(rooms.length).padStart(2, "0")}
              </span>
              <span aria-hidden className="h-px w-8 bg-current" />
              <span>{room.kicker}</span>
            </p>
            <h3 className="overflow-hidden">
              <span
                data-room-title
                className="block font-sans text-[clamp(3rem,10vw,10.5rem)] font-extralight uppercase leading-[0.86] tracking-[-0.02em] text-white"
              >
                {room.title}
              </span>
            </h3>
            <div data-room-text className="mt-6 flex max-w-2xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <p className="max-w-md text-sm leading-relaxed text-white/75 md:text-base">{room.text}</p>
              <Link
                href={room.href}
                className="pointer-events-auto eyebrow shrink-0 border-b border-gold/60 pb-1 text-white transition-colors hover:text-gold"
              >
                View gallery →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
