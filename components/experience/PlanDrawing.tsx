import { cn } from "@/lib/utils";
import { PLAN } from "./plan";

/**
 * Static floor plan of the concept villa — same data as the 3D blueprint
 * (./plan.ts). Used as the poster before WebGL renders and in the fallback.
 */
export default function PlanDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-21 -16 42 39"
      className={cn("text-[#13294f]", className)}
      role="img"
      aria-label="Floor plan drawing of a contemporary villa"
    >
      <g fill="none" stroke="currentColor">
        {PLAN.solid.map(([x0, z0, x1, z1], i) => (
          <rect key={`s${i}`} x={x0} y={z0} width={x1 - x0} height={z1 - z0} strokeWidth={1} vectorEffect="non-scaling-stroke" />
        ))}
        {PLAN.light.map(([x0, z0, x1, z1], i) => (
          <rect
            key={`l${i}`}
            x={x0}
            y={z0}
            width={x1 - x0}
            height={z1 - z0}
            strokeOpacity={0.4}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {PLAN.columns.map(([x, z]) => (
          <rect key={`${x}-${z}`} x={x - 0.12} y={z - 0.12} width={0.24} height={0.24} fill="currentColor" stroke="none" />
        ))}
        <path
          d="M-11 21 H11 M-11 20.5 V21.5 M11 20.5 V21.5"
          strokeOpacity={0.45}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </g>
      <g className="fill-current font-mono" fontSize={0.7} opacity={0.6}>
        <text x={0} y={22.4} textAnchor="middle">
          22.00
        </text>
        <text x={4.5} y={-3} textAnchor="middle">
          LIVING
        </text>
        <text x={-5.5} y={-1.5} textAnchor="middle">
          KITCHEN · ENTRY
        </text>
        <text x={4.75} y={11} textAnchor="middle">
          POOL
        </text>
        <text x={-6.5} y={17} textAnchor="middle">
          DRIVE
        </text>
      </g>
    </svg>
  );
}
