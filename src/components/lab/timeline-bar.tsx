import { useLab } from "@/lib/snn/store";

export function TimelineBar() {
  const snapshots = useLab((s) => s.snapshots);
  const tick = useLab((s) => s.frame.tick);
  const travel = useLab((s) => s.travelTick);
  const seek = useLab((s) => s.seekTick);
  const max = Math.max(tick, snapshots[snapshots.length - 1]?.tick ?? 0, 1);
  const value = travel ?? tick;

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 font-mono text-[10px] text-faint">TICK</span>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => seek(Number(e.target.value))}
        className="h-1 flex-1 accent-steel"
      />
      <button type="button" className="font-mono text-[10px] text-mute" onClick={() => seek(null)}>
        LIVE {tick}
      </button>
    </div>
  );
}
