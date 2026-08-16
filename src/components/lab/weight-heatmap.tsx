import { selectedPair } from "@/lib/snn/board";
import { diffMatrix } from "@/lib/snn/research";
import { useLab, viewedFrame } from "@/lib/snn/store";
import { INITIAL_CROSS, TARGET_W } from "@/lib/snn/types";
import { cn } from "@/lib/utils";

const VIEWS = [
  { id: "live", label: "LIVE" },
  { id: "a", label: "A HOLD" },
  { id: "reset", label: "RESET" },
  { id: "b", label: "B HOLD" },
  { id: "diff", label: "A ↔ B" },
] as const;

export function WeightHeatmap({ fill = false }: { fill?: boolean }) {
  const sw = useLab((s) => s.sw);
  const select = useLab((s) => s.select);
  const dumps = useLab((s) => s.dumps);
  const dumpView = useLab((s) => s.dumpView);
  const setDumpView = useLab((s) => s.setDumpView);
  const dumpNow = useLab((s) => s.dumpNow);
  const frame = viewedFrame();
  const { src: ss, dst: dd } = selectedPair(sw);

  const matrix =
    dumpView === "a"
      ? dumps.a
      : dumpView === "reset"
        ? dumps.reset
        : dumpView === "b"
          ? dumps.b
          : dumpView === "diff"
            ? diffMatrix(dumps.a, dumps.b)
            : frame.weights;

  return (
    <div className={cn(fill && "flex h-full min-h-0 flex-1 flex-col")}>
      <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">64-weight · dest \ src</div>
        <div className="flex flex-wrap gap-1">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setDumpView(v.id)}
              className={cn("h-7 rounded-xs px-2 font-mono text-[10px]", dumpView === v.id ? "bg-elevated text-ink" : "text-mute")}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1">
          <button type="button" className="h-7 rounded-xs border border-line px-2 font-mono text-[10px]" onClick={() => dumpNow("a")}>
            DUMP A
          </button>
          <button type="button" className="h-7 rounded-xs border border-line px-2 font-mono text-[10px]" onClick={() => dumpNow("reset")}>
            DUMP RST
          </button>
          <button type="button" className="h-7 rounded-xs border border-line px-2 font-mono text-[10px]" onClick={() => dumpNow("b")}>
            DUMP B
          </button>
        </div>
      </div>
      {!matrix ? (
        <p className="text-xs text-mute">Chưa dump slot này. HOLD xong bấm DUMP A / RESET / B.</p>
      ) : (
        <div className={fill ? "lab-matrix" : "lab-matrix-compact"}>
          <div className="flex items-center justify-center font-mono text-[10px] text-faint">D\S</div>
          {Array.from({ length: 8 }, (_, s) => (
            <div key={`h${s}`} className="flex items-center justify-center font-mono text-[10px] text-faint">
              {s}
            </div>
          ))}
          {matrix.map((row, d) => (
            <MatrixRow
              key={d}
              d={d}
              row={row}
              fill={fill}
              dumpView={dumpView}
              selectedSrc={ss}
              selectedDst={dd}
              onSelect={select}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MatrixRow({
  d,
  row,
  fill,
  dumpView,
  selectedSrc,
  selectedDst,
  onSelect,
}: {
  d: number;
  row: number[];
  fill: boolean;
  dumpView: string;
  selectedSrc: number;
  selectedDst: number;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="flex items-center justify-center font-mono text-[10px] text-faint">{d}</div>
      {row.map((w, s) => {
        const t = Math.min(1, Math.max(0, (Math.abs(w) - (dumpView === "diff" ? 0 : INITIAL_CROSS)) / (TARGET_W - INITIAL_CROSS)));
        const sel = dumpView === "live" && d === selectedDst && s === selectedSrc;
        const diag = s === d && dumpView !== "diff";
        return (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(`syn-${d}-${s}`)}
            className={cn(
              "flex min-h-0 min-w-0 items-center justify-center rounded-xs font-mono tabular-nums",
              fill ? "text-sm" : "h-7 text-[10px]",
              sel && "outline outline-1 outline-steel",
            )}
            style={{
              background: diag ? "transparent" : `color-mix(in oklab, var(--color-pass) ${Math.round(t * 70)}%, var(--color-elevated))`,
              color: Math.abs(w) > INITIAL_CROSS ? "var(--color-ink)" : "var(--color-mute)",
            }}
          >
            {diag ? "—" : dumpView === "diff" && w > 0 ? `+${w}` : w}
          </button>
        );
      })}
    </>
  );
}
