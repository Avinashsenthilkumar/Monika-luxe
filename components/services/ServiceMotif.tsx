import type { MotifVariant } from "@/lib/content";
import { cn } from "@/lib/utils";
import InView from "@/components/ui/InView";

/**
 * Architectural line illustrations for services that do not yet have genuine
 * project photography. They are drawings, never presented as completed work.
 */
// literal class names so Tailwind can generate them
const GARDEN_DELAYS = [
  "[animation-delay:400ms]",
  "[animation-delay:480ms]",
  "[animation-delay:560ms]",
  "[animation-delay:640ms]",
  "[animation-delay:720ms]",
  "[animation-delay:800ms]",
];
const TEXTURE_DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:120ms]",
  "[animation-delay:240ms]",
  "[animation-delay:360ms]",
  "[animation-delay:480ms]",
  "[animation-delay:600ms]",
];

export default function ServiceMotif({
  variant,
  className,
  tone = "dark",
}: {
  variant: MotifVariant;
  className?: string;
  tone?: "dark" | "light";
}) {
  const stroke = tone === "dark" ? "#c9a24d" : "#0c1d3a";
  const soft = tone === "dark" ? "#7d8aa3" : "#7d8aa3";
  const d = "draw-norm";
  return (
    <InView
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        tone === "dark" ? "bg-navy" : "blueprint-grid bg-mist",
        className,
      )}
    >
      <svg viewBox="0 0 600 450" className="h-[78%] w-[86%]" fill="none" aria-hidden>
        <g stroke={stroke} strokeWidth="1.2">
          {variant === "elevation" && (
            <>
              <path pathLength={1} className={d} d="M20 400 H580" />
              <rect pathLength={1} className={`${d} [animation-delay:150ms]`} x="80" y="384" width="440" height="16" />
              <rect pathLength={1} className={`${d} [animation-delay:300ms]`} x="100" y="250" width="170" height="134" />
              <rect pathLength={1} className={`${d} [animation-delay:400ms]`} x="270" y="250" width="230" height="134" />
              <rect pathLength={1} className={`${d} [animation-delay:550ms]`} x="120" y="240" width="380" height="10" />
              <rect pathLength={1} className={`${d} [animation-delay:700ms]`} x="140" y="128" width="330" height="112" />
              <rect pathLength={1} className={`${d} [animation-delay:850ms]`} x="110" y="116" width="400" height="12" />
              <path
                pathLength={1}
                className={`${d} [animation-delay:1000ms]`}
                d="M330 250 V384 M420 250 V384 M200 156 H420 V212 H200 Z"
              />
              <path
                pathLength={1}
                className={`${d} [animation-delay:1100ms]`}
                d="M60 60 H540 M60 54 V66 M540 54 V66"
                stroke={soft}
              />
            </>
          )}
          {variant === "plan" && (
            <>
              <rect pathLength={1} className={d} x="60" y="50" width="480" height="350" />
              <path
                pathLength={1}
                className={`${d} [animation-delay:200ms]`}
                d="M260 50 V230 M260 290 V400 M60 220 H180 M220 220 H260 M380 400 V300 H540"
              />
              <rect pathLength={1} className={`${d} [animation-delay:400ms]`} x="300" y="90" width="180" height="70" />
              <rect pathLength={1} className={`${d} [animation-delay:500ms]`} x="340" y="190" width="100" height="56" />
              <path pathLength={1} className={`${d} [animation-delay:600ms]`} d="M80 70 H240 V110 H80 Z M80 110 H120 V200 H80" />
              <rect pathLength={1} className={`${d} [animation-delay:700ms]`} x="90" y="260" width="130" height="110" />
              <path pathLength={1} className={`${d} [animation-delay:800ms]`} d="M180 220 A40 40 0 0 1 220 260" stroke={soft} />
              <path
                pathLength={1}
                className={`${d} [animation-delay:900ms]`}
                d="M30 50 V400 M24 50 H36 M24 400 H36 M60 425 H540 M60 419 V431 M540 419 V431"
                stroke={soft}
              />
            </>
          )}
          {variant === "section" && (
            <>
              <path pathLength={1} className={d} d="M40 390 H560 M40 410 H560" />
              <path
                pathLength={1}
                className={`${d} [animation-delay:200ms]`}
                d="M120 390 V80 M150 390 V80 M120 80 H480 M120 100 H480 M450 100 V390 M480 80 V390"
              />
              <path pathLength={1} className={`${d} [animation-delay:450ms]`} d="M150 300 H450 M150 200 H450" stroke={soft} />
              <path
                pathLength={1}
                className={`${d} [animation-delay:650ms]`}
                d="M200 390 V320 H260 V390 M330 240 H410 V300 H330 Z"
              />
              <path
                pathLength={1}
                className={`${d} [animation-delay:800ms]`}
                d="M170 120 L190 140 M210 120 L230 140 M250 120 L270 140 M290 120 L310 140 M330 120 L350 140 M370 120 L390 140 M410 120 L430 140"
                stroke={soft}
              />
            </>
          )}
          {variant === "garden" && (
            <>
              <rect pathLength={1} className={d} x="70" y="60" width="460" height="330" />
              <rect pathLength={1} className={`${d} [animation-delay:200ms]`} x="90" y="80" width="420" height="40" />
              <rect pathLength={1} className={`${d} [animation-delay:300ms]`} x="90" y="330" width="420" height="40" />
              {[130, 200, 270, 340, 410, 470].map((x, i) => (
                <circle key={x} pathLength={1} className={`${d} ${GARDEN_DELAYS[i]}`} cx={x} cy="100" r="14" />
              ))}
              <rect pathLength={1} className={`${d} [animation-delay:900ms]`} x="230" y="180" width="140" height="90" />
              <path
                pathLength={1}
                className={`${d} [animation-delay:1000ms]`}
                d="M250 200 H350 M250 225 H350 M250 250 H350"
                stroke={soft}
              />
              <circle pathLength={1} className={`${d} [animation-delay:1100ms]`} cx="140" cy="230" r="40" stroke={soft} />
              <circle pathLength={1} className={`${d} [animation-delay:1150ms]`} cx="460" cy="230" r="40" stroke={soft} />
            </>
          )}
        </g>
        {variant === "texture" && (
          <g>
            {[
              ["#d9cfbf", "Limewash"],
              ["#b9ad99", "Mineral plaster"],
              ["#7d8aa3", "Textured coat"],
              ["#ece6dc", "Satin emulsion"],
              ["#5b5046", "Accent wall"],
              ["#e2c88f", "Stone finish"],
            ].map(([c, label], i) => {
              const x = 60 + (i % 3) * 170;
              const y = 60 + Math.floor(i / 3) * 180;
              return (
                <g key={label} className={`animate-fade ${TEXTURE_DELAYS[i]}`}>
                  <rect x={x} y={y} width="140" height="130" fill={c} />
                  <rect x={x} y={y} width="140" height="130" fill="url(#grain)" opacity="0.5" />
                  <text x={x} y={y + 152} className="font-mono" fontSize="10" letterSpacing="2" fill={soft}>
                    {label.toUpperCase()}
                  </text>
                </g>
              );
            })}
            <defs>
              <pattern id="grain" width="6" height="6" patternUnits="userSpaceOnUse">
                <path d="M0 6 L6 0" stroke="#000" strokeOpacity="0.08" />
              </pattern>
            </defs>
          </g>
        )}
      </svg>
      <span className="eyebrow absolute bottom-4 left-4 text-slate">Drawing · illustrative</span>
    </InView>
  );
}
