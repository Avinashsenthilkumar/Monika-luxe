/**
 * DOM layer for the drawing phase: sheet border, title block, north arrow and
 * registration marks. Animated by the journey timeline via data attributes.
 * The 3D floor plan itself is drawn in WebGL (see three/buildHouse.ts).
 */
export default function BlueprintScene() {
  return (
    <div data-bp-layer aria-hidden className="pointer-events-none absolute inset-0 text-navy">
      {/* sheet border */}
      <div data-bp-fade className="absolute inset-4 border border-navy/25 md:inset-8" />
      <div data-bp-fade className="absolute inset-5 border border-navy/10 md:inset-10" />

      {/* registration marks */}
      {[
        "left-3 top-3 md:left-6 md:top-6",
        "right-3 top-3 md:right-6 md:top-6",
        "bottom-3 left-3 md:bottom-6 md:left-6",
        "bottom-3 right-3 md:bottom-6 md:right-6",
      ].map((pos) => (
        <svg key={pos} data-bp-fade viewBox="0 0 24 24" className={`absolute h-5 w-5 ${pos}`}>
          <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.75" />
          <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="0.75" />
        </svg>
      ))}

      {/* north arrow */}
      <svg data-bp-fade viewBox="0 0 60 80" className="absolute right-10 top-28 h-16 w-12 md:right-20 md:top-32 md:h-20 md:w-16">
        <circle cx="30" cy="44" r="22" fill="none" stroke="currentColor" strokeWidth="0.8" pathLength={1} data-bp-draw />
        <path d="M30 14 L40 56 L30 48 L20 56 Z" fill="none" stroke="currentColor" strokeWidth="0.8" pathLength={1} data-bp-draw />
        <text x="30" y="10" textAnchor="middle" className="fill-current font-mono text-[9px]">
          N
        </text>
      </svg>

      {/* title block */}
      <div
        data-bp-fade
        className="absolute bottom-10 right-6 hidden w-[19rem] border border-navy/40 bg-white/70 font-mono text-[0.62rem] uppercase tracking-[0.14em] backdrop-blur-[2px] md:right-14 md:bottom-16 md:block"
      >
        {[
          ["Project", "Contemporary residence"],
          ["Drawing", "Ground floor plan"],
          ["Scale", "1 : 100"],
          ["Sheet", "01 / 06"],
          ["Studio", "Monika Luxe · Thanjavur"],
        ].map(([k, v]) => (
          <div key={k} className="flex border-b border-navy/20 last:border-b-0">
            <span className="w-24 shrink-0 border-r border-navy/20 px-3 py-2 text-navy/50">{k}</span>
            <span className="px-3 py-2">{v}</span>
          </div>
        ))}
      </div>

      <p
        data-bp-fade
        className="absolute left-6 top-28 font-mono text-[0.6rem] uppercase tracking-[0.2em] text-navy/50 md:left-14 md:top-32"
      >
        Illustrative concept · not a client project
      </p>
    </div>
  );
}
