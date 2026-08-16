import { DEMO_STEPS, LED_LABEL, SW_HINT, SW_LABEL } from "@/lib/snn/board";

export function BoardGuide() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Board 8-agent</div>
        <ol className="mt-2 list-decimal space-y-1.5 pl-4 text-xs leading-relaxed text-mute">
          {DEMO_STEPS.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </div>
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">SW / LED</div>
        <ul className="mt-2 space-y-1 text-[11px]">
          {SW_LABEL.map((l, i) =>
            l === "—" ? null : (
              <li key={i} className="border-b border-line py-1">
                <span className="font-mono text-ink">SW{i} {l}</span>
                <span className="ml-2 text-mute">{SW_HINT[i]}</span>
              </li>
            ),
          )}
          {LED_LABEL.map((l, i) => (
            <li key={`l${i}`} className="border-b border-line py-1 font-mono text-mute">
              LED{i} {l}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
