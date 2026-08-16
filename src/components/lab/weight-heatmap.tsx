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

export function WeightHeatmap() {
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
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">64-weight matrix</div>
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
        <div className="overflow-x-auto">
          <table className="border-collapse font-mono text-[10px] tabular-nums">
            <thead>
              <tr>
                <th className="px-1 py-1 text-faint">D\\S</th>
                {Array.from({ length: 8 }, (_, s) => (
                  <th key={s} className="px-1 py-1 text-faint">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, d) => (
                <tr key={d}>
                  <td className="px-1 py-1 text-faint">{d}</td>
                  {row.map((w, s) => {
                    const t = Math.min(1, Math.max(0, (Math.abs(w) - (dumpView === "diff" ? 0 : INITIAL_CROSS)) / (TARGET_W - INITIAL_CROSS)));
                    const sel = dumpView === "live" && d === dd && s === ss;
                    return (
                      <td key={s} className="p-0.5">
                        <button
                          type="button"
                          onClick={() => select(`syn-${d}-${s}`)}
                          className={cn("block min-w-9 rounded-xs px-1 py-1 text-center", sel && "outline outline-1 outline-steel")}
                          style={{
                            background:
                              s === d && dumpView !== "diff"
                                ? "transparent"
                                : `color-mix(in oklab, var(--color-pass) ${Math.round(t * 70)}%, var(--color-elevated))`,
                            color: Math.abs(w) > INITIAL_CROSS ? "var(--color-ink)" : "var(--color-mute)",
                          }}
                        >
                          {s === d && dumpView !== "diff" ? "—" : dumpView === "diff" && w > 0 ? `+${w}` : w}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
