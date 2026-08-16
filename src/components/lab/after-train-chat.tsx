import { useState } from "react";
import { asciiLcd, type ResponseObject } from "@/lib/snn/chat-protocol";
import { HW06B } from "@/lib/snn/phrase";
import { useLab } from "@/lib/snn/store";
import { cn } from "@/lib/utils";

export function AfterTrainChat() {
  const send = useLab((s) => s.sendChat);
  const arm = useLab((s) => s.armAfterTrain);
  const resetCtx = useLab((s) => s.resetCtx);
  const afterArmed = useLab((s) => s.afterArmed);
  const holdTurns = useLab((s) => s.holdTurns);
  const responses = useLab((s) => s.responses);
  const last = useLab((s) => s.lastResponse);
  const llmAfter = useLab((s) => s.llmAfter);
  const frame = useLab((s) => s.frame);
  const [text, setText] = useState("");
  const open = afterArmed && frame.freeze && !frame.learn;

  return (
    <div className="grid h-full min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <div className="flex min-h-0 flex-col">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-3 py-2">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">After-train (06B)</div>
            <div className="text-sm font-medium tracking-tight">M8-HW-06B · AFTER · hold_ctx</div>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span className={cn(open ? "text-pass" : "text-fail")}>{open ? "● AFTER" : "○ GATE CLOSED"}</span>
            <span className="text-mute">LLM {llmAfter}</span>
            {!open ? (
              <button type="button" onClick={arm} className="h-8 rounded-sm bg-steel px-3 text-[11px] font-medium text-steel-fg">
                ARM AFTER
              </button>
            ) : (
              <button type="button" onClick={resetCtx} className="h-8 rounded-sm border border-line px-3 text-[11px]">
                RESET CTX A5 5F 08
              </button>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          {!open ? (
            <p className="text-sm text-mute">
              06B BOARD PASS. ARM rồi gửi lần lượt: «{HW06B.turn1A}» → «{HW06B.turn2}» → «{HW06B.turn3}». FPGA giữ ctx. Text = local decoder.
            </p>
          ) : (
            <p className="font-mono text-[11px] text-mute">
              hold_ctx turns {holdTurns.length} · {holdTurns.join(" / ") || "empty"}
            </p>
          )}
          {responses.map((r) => (
            <div key={r.request_id} className="space-y-2">
              <div className="ml-auto max-w-[85%] rounded-sm bg-elevated px-3 py-2 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-faint">Bạn</div>
                {r.input}
              </div>
              <div className="max-w-[85%] rounded-sm border border-line bg-surface px-3 py-2 text-sm">
                <div className="text-[10px] uppercase tracking-wider text-faint">FPGA out · local decoder</div>
                <div>{r.text}</div>
                <div className="mt-1 font-mono text-[10px] text-faint">
                  basin 0x{r.fpga_response.toString(16).padStart(2, "0")} · ctx {r.temporal_context} · {r.latency_ms.toFixed(1)} ms · #{r.request_id}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form
          className="flex gap-2 border-t border-line p-2"
          onSubmit={(e) => {
            e.preventDefault();
            send(text);
            setText("");
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={HW06B.turn1A}
            className="h-10 min-w-0 flex-1 rounded-sm border border-line bg-canvas px-3 text-sm outline-none"
          />
          <button type="submit" className="h-10 shrink-0 rounded-sm bg-steel px-4 text-sm font-medium text-steel-fg">
            SEND
          </button>
        </form>
      </div>

      <aside className="flex min-h-0 flex-col gap-3 overflow-auto border-t border-line p-3 lg:border-t-0 lg:border-l">
        <LcdFace last={last} turns={holdTurns} />
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Response delivery</div>
          <div className="mt-2 space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-mute">APP</span>
              <span className={last?.app === "DELIVERED" ? "text-pass" : "text-faint"}>{last?.app ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mute">LCD</span>
              <span className={last?.lcd === "DISPLAYED" ? "text-pass" : "text-faint"}>{last?.lcd ?? "—"}</span>
            </div>
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Provenance</div>
          <dl className="mt-2 space-y-1 font-mono text-[11px]">
            <Row k="Input source" v="User" />
            <Row k="Encoder" v="Local" />
            <Row k="Inference" v="FPGA" />
            <Row k="Teacher" v="DISCONNECTED" />
            <Row k="External LLM" v="0" />
            <Row k="Weight writes" v="0" />
            <Row k="Learn / Freeze" v="OFF / ON" />
            <Row k="hold_ctx" v={String(holdTurns.length)} />
          </dl>
        </div>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-2 border-b border-line py-1">
      <dt className="text-mute">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}

function LcdFace({ last, turns }: { last: ResponseObject | null; turns: string[] }) {
  return (
    <div className="border border-line bg-canvas p-2 font-mono text-[11px]">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-faint">SPI LCD · same object</div>
      <div className="text-pass">AFTER · TEACHER OFF</div>
      <div className="mt-2 text-mute">YOU:</div>
      <div>{last ? asciiLcd(last.input) : "—"}</div>
      <div className="mt-2 text-mute">OUT:</div>
      <div>{last ? asciiLcd(last.text) : "—"}</div>
      <div className="mt-2 text-faint">
        FPGA [0x{(last?.fpga_response ?? 0).toString(16).padStart(2, "0")}] turns {turns.length}
      </div>
      <div className="text-faint">T:OFF L:OFF F:ON</div>
    </div>
  );
}
