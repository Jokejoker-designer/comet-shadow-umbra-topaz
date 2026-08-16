import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";
import { Lock, X } from "lucide-react";

export type SynapseEdgeData = {
  weight: number;
  cyclic: boolean;
  pulsing: boolean;
  locked: boolean;
  failed: boolean;
  label?: string;
  dim?: boolean;
};

export function SynapseEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
}: EdgeProps<Edge<SynapseEdgeData>>) {
  const d = (data ?? {}) as SynapseEdgeData;
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const t = Math.min(1, Math.max(0, (d.weight - 64) / 1024));
  const width = d.cyclic || d.weight > 256 ? 1.2 + t * 5.5 : 0.7;
  const stroke = d.failed
    ? "var(--color-fail)"
    : d.cyclic || d.weight > 256
      ? "var(--color-steel)"
      : "var(--color-line-strong)";
  const opacity = d.dim ? 0.08 : d.cyclic || d.weight > 200 ? 0.95 : 0.18;

  return (
    <>
      <BaseEdge
        id={id}
        path={path}
        markerEnd={markerEnd}
        style={{
          stroke,
          strokeWidth: width,
          opacity,
          strokeDasharray: d.failed ? "5 4" : undefined,
        }}
      />
      {d.pulsing && d.cyclic ? (
        <circle
          r={3.2}
          className="spike-bead"
          style={{ offsetPath: `path('${path}')` }}
        />
      ) : null}
      <EdgeLabelRenderer>
        <div
          className="nodrag nopan pointer-events-none absolute origin-center"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <div
            className="flex items-center gap-1 rounded-xs border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] tabular-nums text-mute"
            style={{ opacity: d.cyclic ? 1 : 0.45 }}
          >
            {d.failed ? <X className="size-2.5 text-fail" /> : null}
            {d.locked ? <Lock className="size-2.5" /> : null}
            <span>{d.label ?? `W=${d.weight}`}</span>
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
