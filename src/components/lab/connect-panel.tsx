import { useState } from "react";
import { Cable, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectWebSerial, disconnectWebSerial, hasWebSerial, ingestPastedLog } from "@/lib/snn/serial";
import { useLab } from "@/lib/snn/store";

export function ConnectPanel({ onClose }: { onClose: () => void }) {
  const source = useLab((s) => s.source);
  const connected = useLab((s) => s.connected);
  const err = useLab((s) => s.serialError);
  const rxBytes = useLab((s) => s.rxBytes);
  const connectSim = useLab((s) => s.connectSim);
  const startEval = useLab((s) => s.startEval);
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const serialOk = typeof window !== "undefined" && hasWebSerial();

  async function onSerial() {
    setBusy(true);
    setNote(null);
    useLab.getState().setSerialError(null);
    try {
      await connectWebSerial(115200);
      setNote("COM8 mở. SW11 ON + BTNU. Frame A5 5A live, A5 5C RESULT.");
    } catch (e) {
      useLab.getState().setSerialError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-canvas/70 p-3 sm:items-center">
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-lg border border-line bg-surface p-5 shadow-panel">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Basys 3 · 8-agent</p>
            <h2 className="mt-0.5 text-lg font-medium tracking-tight">Kết nối UART</h2>
          </div>
          <Button variant="ghost" size="icon" className="size-8" onClick={onClose} aria-label="Đóng">
            <X className="size-4" />
          </Button>
        </div>
        <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm text-mute">
          <li>SW13 ON (dest=1), SW8:6 OFF (src=0), SW9 OFF, SW11 ON.</li>
          <li>BTNU một lần — reset W=0040, EVAL_BEFORE → TRAIN 1024 → HOLD 0440.</li>
          <li>Không gạt lại SW11 để train (07FF). Muốn lại: BTNU.</li>
        </ol>
        {err ? <p className="mt-3 text-sm text-fail">{err}</p> : null}
        {note ? <p className="mt-3 text-sm text-pass">{note}</p> : null}
        {source === "board" && connected && rxBytes === 0 ? (
          <p className="mt-3 text-sm text-warn">Im lặng — SW11+BTNU hoặc BTNR.</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {source === "board" && connected ? (
            <Button onClick={() => void disconnectWebSerial()}>Ngắt COM8</Button>
          ) : (
            <Button onClick={() => void onSerial()} disabled={!serialOk || busy}>
              <Cable className="size-3.5" />
              {busy ? "Đang mở…" : serialOk ? "Chọn COM8" : "Web Serial không khả dụng"}
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => {
              const sw = useLab.getState().sw.slice();
              sw[11] = true;
              sw[13] = true;
              sw[8] = false;
              sw[7] = false;
              sw[6] = false;
              sw[9] = false;
              useLab.setState({ sw });
              connectSim();
              startEval();
              onClose();
            }}
          >
            Mô phỏng pipeline
          </Button>
        </div>
        <div className="mt-5 border-t border-line pt-4">
          <textarea
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            rows={3}
            placeholder="dán log uart_monitor.py"
            className="w-full rounded-sm border border-line bg-canvas px-2 py-2 font-mono text-[11px]"
          />
          <Button size="sm" variant="outline" className="mt-2" onClick={() => setNote(`Nạp ${ingestPastedLog(paste)} dòng`)}>
            <Upload className="size-3.5" />
            Nạp log
          </Button>
        </div>
      </div>
    </div>
  );
}
