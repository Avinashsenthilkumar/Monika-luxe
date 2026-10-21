import { cn } from "@/lib/utils";

/**
 * Static floor plan of the concept residence (same geometry as the 3D model).
 * Used as the poster before WebGL is ready and in the no-WebGL / reduced-motion
 * fallback. Units are metres (viewBox), strokes don't scale.
 */
const rects: Array<[number, number, number, number, number?]> = [
  [-10, -7, 20, 14],
  [-9, -6, 8, 10],
  [-1, -5, 10, 10],
  [-0.85, -4.85, 9.7, 0.3],
  [-1, 8.5, 11, 4.5],
  [-2.5, 7, 14, 7.2, 0.5],
  [-3.8, 7, 2.4, 9.1, 0.5],
  [2.0, -1.75, 5.1, 1, 0.6],
  [3.45, 0.32, 1.5, 0.85, 0.6],
  [-7, -4.5, 14.5, 11, 0.35],
];
// literal class names so Tailwind can see them
const DELAYS = [
  "[animation-delay:0ms]",
  "[animation-delay:120ms]",
  "[animation-delay:240ms]",
  "[animation-delay:360ms]",
  "[animation-delay:480ms]",
  "[animation-delay:600ms]",
  "[animation-delay:720ms]",
  "[animation-delay:840ms]",
  "[animation-delay:960ms]",
  "[animation-delay:1080ms]",
];

const columns: Array<[number, number]> = [
  [-0.85, 6.7],
  [3, 6.7],
  [8.7, 6.7],
  [8.7, -4.6],
  [-0.85, -4.6],
];

export default function PlanDrawing({ className, animate = false }: { className?: string; animate?: boolean }) {
  return (
    <svg
      viewBox="-17 -11 34 32"
      className={cn("text-[#13294f]", className)}
      role="img"
      aria-label="Floor plan drawing of a contemporary residence"
    >
      <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
        {rects.map(([x, y, w, h, o = 0.9], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={h}
            strokeOpacity={o}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
            pathLength={1}
            className={animate ? cn("draw-norm", DELAYS[i % DELAYS.length]) : undefined}
          />
        ))}
        {columns.map(([x, y]) => (
          <rect
            key={`${x}-${y}`}
            x={x - 0.14}
            y={y - 0.14}
            width={0.28}
            height={0.28}
            fill="currentColor"
            fillOpacity={0.6}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d="M-10 17.5 H10 M-10 17 V18 M10 17 V18" strokeOpacity={0.45} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        <path
          d="M-13 -7 V7 M-13.5 -7 H-12.5 M-13.5 7 H-12.5"
          strokeOpacity={0.45}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <path d="M-0.5 4 A1.4 1.4 0 0 0 -1.9 5.4" strokeOpacity={0.6} strokeWidth={1} vectorEffect="non-scaling-stroke" />
      </g>
      <g className="fill-current font-mono" fontSize={0.62} opacity={0.6}>
        <text x={0} y={19.2} textAnchor="middle">
          20.00
        </text>
        <text x={-14.6} y={0.2} textAnchor="middle" transform="rotate(-90 -14.6 0.2)">
          14.00
        </text>
        <text x={4} y={-2.6} textAnchor="middle">
          LIVING
        </text>
        <text x={-5} y={-1} textAnchor="middle">
          KITCHEN · SERVICE
        </text>
        <text x={4.5} y={11} textAnchor="middle">
          POOL
        </text>
      </g>
    </svg>
  );
}
