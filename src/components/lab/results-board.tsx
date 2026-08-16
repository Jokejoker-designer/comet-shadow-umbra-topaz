import { BITS, BOARD, KIT_ID, MATRIX_A, MATRIX_B, MATRIX_RESET } from "@/lib/snn/board-record";
import { HW05_PROBES, HW06B_PROBES, MILESTONES, MILESTONE, MILESTONE_CLAIM, NEXT_MILESTONE } from "@/lib/snn/research";
import { useLab } from "@/lib/snn/store";
import { cn } from "@/lib/utils";

function MiniMatrix({ title, m }: { title: string; m: number[][] }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] text-faint">{title}</div>
      <table className="border-collapse font-mono text-[10px] tabular-nums">
        <tbody>
          {m.map((row, d) => (
            <tr key={d}>
              {row.map((w, s) => (
                <td
                  key={s}
                  className={cn("px-1 py-0.5", w >= 320 ? "text-pass" : w === 0 ? "text-faint" : "text-mute")}
                >
                  {w}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ResultsBoard() {
  const setScreen = useLab((s) => s.setScreen);
  const setDumpView = useLab((s) => s.setDumpView);

  return (
    <div className="h-full overflow-auto p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Kit · {KIT_ID}</div>
          <h1 className="text-lg font-medium tracking-tight">{MILESTONE} PASS</h1>
          <p className="font-mono text-[11px] text-pass">{MILESTONE_CLAIM}</p>
          <p className="text-xs text-mute">
            {BOARD.part} · {BOARD.device} · {BOARD.uart} · Vivado {BOARD.vivado}
          </p>
          <p className="text-xs text-mute">{NEXT_MILESTONE}. Not an LLM / open-domain chat.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setDumpView("a");
              setScreen("matrix");
            }}
            className="h-9 rounded-sm border border-line px-3 text-xs font-medium"
          >
            64-W A/B
          </button>
          <button type="button" onClick={() => setScreen("cockpit")} className="h-9 rounded-sm border border-line px-3 text-xs font-medium">
            Training LIVE
          </button>
        </div>
      </div>

      <div className="mb-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        {(
          [
            ["HW-01 cyclic", BITS.cyclic],
            ["HW-02 remap", BITS.hw02],
            ["HW-03 dense", BITS.hw03],
            ["HW-04/05/06A", BITS.hw04],
            ["HW-06B multi-turn", BITS.hw06b],
          ] as const
        ).map(([label, b]) => (
          <div key={b.file} className="border border-line bg-surface px-2 py-2">
            <div className="text-[10px] uppercase tracking-wider text-faint">{label}</div>
            <div className="truncate font-mono text-[11px]">{b.file}</div>
            <div className="break-all font-mono text-[10px] text-mute">{b.sha}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {MILESTONES.map((m) => (
          <article key={m.id} className="border border-line bg-surface p-3">
            <div className="flex items-baseline justify-between gap-2">
              <div className="font-mono text-[11px] text-mute">{m.id}</div>
              <div
                className={cn(
                  "font-mono text-[11px]",
                  m.status === "PASS" && "text-pass",
                  m.status === "NEXT" && "text-warn",
                )}
              >
                {m.status}
              </div>
            </div>
            <h2 className="mt-1 text-sm font-medium tracking-tight">{m.title}</h2>
            <p className="mt-1 break-all font-mono text-[10px] text-faint">{m.claim}</p>
            <dl className="mt-3 space-y-1">
              {m.numbers.map((n) => (
                <div key={n.k} className="flex justify-between gap-3 border-b border-line py-1 font-mono text-[11px]">
                  <dt className="text-mute">{n.k}</dt>
                  <dd className="text-right tabular-nums">{n.v}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-1 text-[11px] text-mute">Not claimed: {m.notClaimed}</p>
          </article>
        ))}
      </div>

      <section className="mt-4 border border-line bg-surface p-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
          M8-HW-02 run_003 · board dumps (targets 320)
        </div>
        <div className="mt-3 grid gap-4 overflow-x-auto lg:grid-cols-3">
          <MiniMatrix title="A HOLD seed 2026081401" m={MATRIX_A} />
          <MiniMatrix title="RESET 0 / 64" m={MATRIX_RESET} />
          <MiniMatrix title="B HOLD seed 2026081403" m={MATRIX_B} />
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">
          {[
            ["A HOLD", "/evidence/weights_A_hold.png"],
            ["RESET", "/evidence/weights_reset.png"],
            ["B HOLD", "/evidence/weights_B_hold.png"],
            ["A ↔ B Δ", "/evidence/weights_A_vs_B_delta.png"],
          ].map(([label, src]) => (
            <figure key={src} className="border border-line bg-canvas p-1">
              <img src={src} alt={label} className="h-28 w-full object-contain" />
              <figcaption className="px-1 py-1 font-mono text-[10px] text-faint">{label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-4 border border-line bg-surface p-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
          M8-HW-05 probe · run_001 · same m8hw04.bit · COM8
        </div>
        <p className="mt-1 text-xs text-mute">
          Host encoder salt=0. FPGA không thấy chuỗi. Teacher chỉ trong TRAIN. 06A/06B AFTER đã đóng.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-line text-faint">
                <th className="py-2 pr-3 font-medium">Probe</th>
                <th className="py-2 pr-3 font-medium">FPGA out</th>
                <th className="py-2 pr-3 font-medium">Expect</th>
                <th className="py-2 font-medium">Gate</th>
              </tr>
            </thead>
            <tbody>
              {HW05_PROBES.map((p) => (
                <tr key={p.probe} className="border-b border-line">
                  <td className="py-2 pr-3">{p.probe}</td>
                  <td className="py-2 pr-3 tabular-nums">{p.out}</td>
                  <td className="py-2 pr-3 text-mute">{p.expect}</td>
                  <td className="py-2 text-pass">PASS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-4 border border-line bg-surface p-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
          M8-HW-06B probe · run_003 · m8hw06b.bit · COM8 · AFTER
        </div>
        <p className="mt-1 text-xs text-mute">
          hold_ctx trên FPGA. Host chỉ encode. rtl/ không có tên. Không phải LLM.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full border-collapse text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-line text-faint">
                <th className="py-2 pr-3 font-medium">Turns</th>
                <th className="py-2 pr-3 font-medium">FPGA out</th>
                <th className="py-2 pr-3 font-medium">Decode</th>
                <th className="py-2 font-medium">Gate</th>
              </tr>
            </thead>
            <tbody>
              {HW06B_PROBES.map((p) => (
                <tr key={p.probe} className="border-b border-line">
                  <td className="py-2 pr-3">{p.probe}</td>
                  <td className="py-2 pr-3 tabular-nums">{p.out}</td>
                  <td className="py-2 pr-3 text-mute">{p.expect}</td>
                  <td className="py-2 text-pass">PASS</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
