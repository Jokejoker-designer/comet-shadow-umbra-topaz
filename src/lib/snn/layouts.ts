import type { Edge, Node } from "@xyflow/react";
import type { GraphNodeData } from "@/components/graph/nodes";
import type { SynapseEdgeData } from "@/components/graph/synapse-edge";
import { INITIAL_CROSS, ROUTE_GATE, TARGET_W, type UartFrame } from "./types";

type N = Node<GraphNodeData>;
type E = Edge<SynapseEdgeData>;

function n(id: string, x: number, y: number, data: GraphNodeData): N {
  return { id, position: { x, y }, data, type: "lab" };
}

function e(id: string, source: string, target: string, data: SynapseEdgeData): E {
  return {
    id,
    source,
    target,
    type: "synapse",
    data,
    markerEnd: { type: "arrowclosed", color: "var(--color-steel)", width: 14, height: 14 },
  };
}

export function buildAgentGraph(
  frame: UartFrame,
  showAll: boolean,
  lastPulse: { src: number; dst: number; at: number } | null,
  hover: number | null,
): { nodes: N[]; edges: E[] } {
  const cx = 360;
  const cy = 280;
  const r = 220;
  const nodes: N[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (-90 + i * 45) * (Math.PI / 180);
    const on = Boolean((frame.input >> i) & 1) || Boolean((frame.output >> i) & 1);
    nodes.push(
      n(`a${i}`, cx + r * Math.cos(a) - 70, cy + r * Math.sin(a) - 36, {
        kind: "agent",
        title: `A${i}`,
        subtitle: "UNASSIGNED",
        value: on ? "active" : "idle",
        pulsing: on,
        agentIndex: i,
        status: on ? "pass" : "pending",
      }),
    );
  }

  const edges: E[] = [];
  for (let dst = 0; dst < 8; dst++) {
    for (let src = 0; src < 8; src++) {
      if (src === dst) continue;
      const w = frame.weights[dst][src];
      const cyclic = dst === ((src + 1) & 7);
      const strong = w >= TARGET_W * 0.6;
      const mid = w > INITIAL_CROSS;
      const pulsing = Boolean(lastPulse && lastPulse.src === src && lastPulse.dst === dst && Date.now() - lastPulse.at < 800);
      const faded = hover != null && hover !== src && hover !== dst;
      if (!showAll && !cyclic && !mid && !pulsing) continue;
      edges.push(
        e(`s${dst}-${src}`, `a${src}`, `a${dst}`, {
          weight: w,
          cyclic,
          pulsing,
          locked: frame.freeze,
          failed: false,
          label: strong || cyclic ? `${w}` : "",
          dim: faded || (!strong && !cyclic && !showAll),
        }),
      );
    }
  }
  return { nodes, edges };
}

export function buildEvidenceGraph(frame: UartFrame): { nodes: N[]; edges: E[] } {
  const phases = ["RESET", "BEFORE", "TRAIN", "FREEZE", "AFTER", "ERASE", "RETRAIN"] as const;
  const cur = frame.phase;
  const idx =
    cur === "reset"
      ? 0
      : cur === "eval_before"
        ? 1
        : cur === "train"
          ? 2
          : cur === "hold" || cur === "score"
            ? 4
            : cur === "eval_after"
              ? 4
              : cur === "erase"
                ? 5
                : 1;
  const nodes = phases.map((p, i) =>
    n(`p${i}`, 40, 24 + i * 72, {
      kind: "evidence",
      title: p,
      subtitle: i === idx ? "current" : i < idx ? "done" : "queued",
      status: i < idx ? "pass" : i === idx ? "warn" : "pending",
    }),
  );
  const edges = phases.slice(1).map((_, i) =>
    e(`pe${i}`, `p${i}`, `p${i + 1}`, {
      weight: i < idx ? TARGET_W : INITIAL_CROSS,
      cyclic: false,
      pulsing: i === idx - 1,
      locked: false,
      failed: false,
      label: "",
    }),
  );
  return { nodes, edges };
}

export function buildGraph(
  view: string,
  frame: UartFrame,
  _attention: unknown,
  showAll: boolean,
  lastPulse: { src: number; dst: number; at: number } | null,
  hover: number | null = null,
) {
  if (view === "proof" || view === "verification") return buildEvidenceGraph(frame);
  return buildAgentGraph(frame, showAll, lastPulse, hover);
}

export { ROUTE_GATE };
