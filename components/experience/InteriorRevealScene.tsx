import Link from "next/link";
import type { ResolvedImage } from "@/lib/assets";

export interface RoomSlide {
  id: string;
  title: string;
  kicker: string;
  text: string;
  href: string;
  /** used by the static fallback only — the film itself renders the rooms in 3D */
  image?: ResolvedImage;
}

/**
 * Titles for the interior chapter. The rooms themselves are rendered in WebGL
 * (living room inside the villa, then the kitchen, bedroom and office sets).
 */
export default function InteriorRevealScene({ rooms }: { rooms: RoomSlide[] }) {
  return (
    <div data-rooms className="pointer-events-none invisible absolute inset-0 opacity-0">
      {rooms.map((room, i) => (
        <div key={room.id} data-room={i} className="invisible absolute inset-0 opacity-0">
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy-deep/85 via-navy-deep/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] md:px-14 md:pb-20">
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
              <p className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">{room.text}</p>
              <Link
                href={room.href}
                className="pointer-events-auto eyebrow shrink-0 border-b border-gold/60 pb-1 text-white transition-colors hover:text-gold"
              >
                See our {room.kicker.toLowerCase()} →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
