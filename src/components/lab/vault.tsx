import { SESSION_A_MAP, SESSION_B_MAP } from "@/lib/snn/research";
import { useLab } from "@/lib/snn/store";

export function Vault() {
  const session = useLab((s) => s.session);
  const mapping = useLab((s) => s.mapping);
  const loadMapping = useLab((s) => s.loadMapping);
  const dumpNow = useLab((s) => s.dumpNow);
  const resetWeights = useLab((s) => s.resetWeights);
  const startEval = useLab((s) => s.startEval);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">M8-HW-02 BOARD PASS · same bitstream</div>
        <p className="mt-1 text-xs text-mute">
          Host session echo. A 0/32 → 32/32 → forget 0/32 → B 32/32. Permutations không trong RTL.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <MapCard
          title="SESSION A"
          seed={2026081401}
          map={SESSION_A_MAP}
          result="before 0/32 · after 32/32 · forget 0/32"
          active={session.name === "A"}
          onLoad={() => loadMapping("A")}
        />
        <MapCard
          title="SESSION B"
          seed={2026081403}
          map={SESSION_B_MAP}
          result="before 0/32 · after 32/32"
          active={session.name === "B"}
          onLoad={() => loadMapping("B")}
        />
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Research controls</div>
        <div className="mt-2 flex flex-wrap gap-1">
          <button type="button" className="h-8 rounded-sm border border-line px-3 font-mono text-[11px]" onClick={resetWeights}>
            RESET W
          </button>
          <button type="button" className="h-8 rounded-sm border border-line px-3 font-mono text-[11px]" onClick={startEval}>
            EVAL BEFORE
          </button>
          <button type="button" className="h-8 rounded-sm border border-line px-3 font-mono text-[11px]" onClick={() => dumpNow("a")}>
            DUMP A
          </button>
          <button type="button" className="h-8 rounded-sm border border-line px-3 font-mono text-[11px]" onClick={() => dumpNow("reset")}>
            DUMP RST
          </button>
          <button type="button" className="h-8 rounded-sm border border-line px-3 font-mono text-[11px]" onClick={() => dumpNow("b")}>
            DUMP B
          </button>
        </div>
      </div>
      <p className="font-mono text-[11px] text-mute">
        Active {session.name} · seed {session.seed} · hash {session.hash} · map {mapping.join("→")}
      </p>
    </div>
  );
}

function MapCard({
  title,
  seed,
  map,
  result,
  active,
  onLoad,
}: {
  title: string;
  seed: number;
  map: number[];
  result: string;
  active: boolean;
  onLoad: () => void;
}) {
  return (
    <div className={`rounded-md border p-3 ${active ? "border-steel" : "border-line"}`}>
      <div className="flex items-center justify-between">
        <div className="font-mono text-xs">{title}</div>
        <button type="button" onClick={onLoad} className="h-7 rounded-xs border border-line px-2 font-mono text-[10px]">
          LOAD
        </button>
      </div>
      <div className="mt-1 text-[11px] text-mute">seed {seed}</div>
      <div className="mt-1 font-mono text-[11px] text-pass">{result}</div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 font-mono text-[11px] text-mute">
        {map.map((d, s) => (
          <li key={s}>
            {s} → {d}
          </li>
        ))}
      </ul>
    </div>
  );
}
