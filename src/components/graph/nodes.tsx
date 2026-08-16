import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GateStatus } from "@/lib/snn/types";

export type StatusKind = "fpga" | "agent" | "synapse" | "learn" | "evidence" | "arch" | "time";

export type GraphNodeData = {
  kind: StatusKind;
  title: string;
  subtitle?: string;
  value?: string;
  status?: GateStatus;
  pulsing?: boolean;
  locked?: boolean;
  warn?: boolean;
  agentIndex?: number;
  src?: number;
  dst?: number;
};

const statusDot: Record<GateStatus, string> = {
  pass: "bg-pass",
  fail: "bg-fail",
  warn: "bg-warn",
  pending: "bg-faint",
  locked: "bg-mute",
};

function Shell({
  children,
  selected,
  pulsing,
  kind,
  wide,
}: {
  children: React.ReactNode;
  selected?: boolean;
  pulsing?: boolean;
  kind: StatusKind;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative border bg-surface text-ink shadow-panel",
        wide ? "w-52" : "w-40",
        kind === "agent" ? "rounded-lg px-3 py-2.5" : "rounded-md px-2.5 py-2",
        selected ? "border-steel" : "border-line",
        pulsing && kind === "agent" && "agent-pulse",
      )}
    >
      <Handle type="target" position={Position.Top} />
      {children}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

export function LabNode({ data, selected }: NodeProps<Node<GraphNodeData>>) {
  const d = data as GraphNodeData;
  if (d.kind === "agent") {
    return (
      <Shell selected={selected} pulsing={d.pulsing} kind="agent">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-mute">
            Agent
          </span>
          {d.status ? <span className={cn("size-1.5 rounded-full", statusDot[d.status])} /> : null}
        </div>
        <div className="mt-1 font-medium tracking-tight">{d.title}</div>
        <div className="mt-1 flex items-baseline justify-between gap-2 font-mono text-[11px] tabular-nums text-mute">
          <span>{d.subtitle}</span>
          <span className="text-ink">{d.value}</span>
        </div>
      </Shell>
    );
  }

  if (d.kind === "synapse") {
    return (
      <Shell selected={selected} kind="synapse" wide>
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-mute">{d.title}</span>
          {d.locked ? <Lock className="size-3 text-mute" /> : null}
        </div>
        <div className="mt-1 flex items-end justify-between gap-2">
          <span className="font-mono text-lg font-medium tabular-nums tracking-tight">
            {d.value}
          </span>
          <span
            className={cn(
              "text-[11px] font-medium",
              d.status === "pass" ? "text-pass" : d.status === "fail" ? "text-fail" : "text-mute",
            )}
          >
            {d.subtitle}
          </span>
        </div>
      </Shell>
    );
  }

  return (
    <Shell selected={selected} kind={d.kind} wide={d.kind === "evidence" || d.kind === "learn"}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
            {d.kind === "fpga"
              ? "FPGA"
              : d.kind === "learn"
                ? "Learning"
                : d.kind === "evidence"
                  ? "Evidence"
                  : d.kind === "time"
                    ? "Tick"
                    : "Stage"}
          </div>
          <div className="mt-0.5 text-sm font-medium tracking-tight">{d.title}</div>
        </div>
        {d.status ? (
          <span className={cn("mt-1 size-2 shrink-0 rounded-full", statusDot[d.status])} />
        ) : null}
      </div>
      {d.subtitle || d.value ? (
        <div className="mt-1.5 font-mono text-[11px] tabular-nums text-mute">
          {d.value ? <span className="text-ink">{d.value} </span> : null}
          {d.subtitle}
        </div>
      ) : null}
      {d.warn ? <div className="mt-1.5 text-[11px] text-warn">Behavioral blocker</div> : null}
    </Shell>
  );
}
