import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectedPair } from "@/lib/snn/board";
import { useLab, viewedFrame } from "@/lib/snn/store";
import { INITIAL_CROSS, LTP_DELTA } from "@/lib/snn/types";

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2">
      <span className="text-xs text-mute">{k}</span>
      <span className="text-right font-mono text-xs tabular-nums text-ink">{v}</span>
    </div>
  );
}

export function Inspector() {
  const selectedId = useLab((s) => s.selectedId);
  const setInspector = useLab((s) => s.setInspector);
  const sw = useLab((s) => s.sw);
  const frame = viewedFrame();
  const syn = (selectedId ?? "").match(/^syn-(\d+)-(\d+)$/);
  const uiDst = syn ? Number(syn[1]) : null;
  const uiSrc = syn ? Number(syn[2]) : null;
  const { src: hwSrc, dst: hwDst } = selectedPair(sw);
  const hwW = frame.weights[hwDst]?.[hwSrc] ?? frame.weight;
  const uiW = uiDst != null && uiSrc != null ? (frame.weights[uiDst]?.[uiSrc] ?? 0) : null;
  const n = uiDst != null && uiSrc != null ? (frame.updateCounts[uiDst]?.[uiSrc] ?? 0) : 0;

  return (
    <aside className="flex h-full flex-col border-l border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Inspector</div>
        <Button variant="ghost" size="icon" className="size-8" onClick={() => setInspector(false)} aria-label="Đóng">
          <X className="size-4" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">UI selected synapse</div>
        {uiDst != null && uiSrc != null ? (
          <>
            <h2 className="mt-1 font-mono text-sm">
              W[{uiDst}][{uiSrc}] = {uiW}
            </h2>
            <p className="text-xs text-mute">
              Graph click · {uiSrc} → {uiDst} · {((uiSrc + 1) & 7) === uiDst ? "cyclic" : "off-route"}
            </p>
            <div className="mt-2">
              <Row k="Initial" v={uiSrc === uiDst ? "0" : String(INITIAL_CROSS)} />
              <Row k="Updates (host)" v={String(n)} />
              <Row k="Δ / LTP" v={`+${LTP_DELTA}`} />
            </div>
          </>
        ) : (
          <p className="mt-1 text-xs text-mute">Click một cạnh trên graph.</p>
        )}

        <div className="mt-6 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Board hardware inspect</div>
        <h2 className="mt-1 font-mono text-sm">
          W[{hwDst}][{hwSrc}] = {hwW}
        </h2>
        <p className="text-xs text-mute">
          SW15:13 dest={hwDst} · SW8:6 src={hwSrc} · hex {(hwW & 0xffff).toString(16).toUpperCase().padStart(4, "0")}
        </p>
        <div className="mt-2">
          <Row k="7-seg / UART weight" v={String(frame.weight)} />
          <Row k="Learn (LED13)" v={frame.learn ? "ON" : "OFF"} />
          <Row k="Freeze (LED12)" v={frame.freeze ? "ON" : "OFF"} />
          <Row k="Teacher" v={frame.learn ? "ON" : "DISCONNECTED"} />
        </div>
      </div>
    </aside>
  );
}
