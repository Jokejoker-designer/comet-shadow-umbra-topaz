import { useEffect, useState } from "react";
import { CirclePause, CirclePlay, Radio } from "lucide-react";
import { GraphCanvas } from "@/components/graph/graph-canvas";
import { Button } from "@/components/ui/button";
import { AfterTrainChat } from "./after-train-chat";
import { ResultsBoard } from "./results-board";
import { AntiHardcode } from "./anti-hardcode";
import { Basys3Panel } from "./basys3-panel";
import { BoardGuide } from "./board-guide";
import { ClaimBanner } from "./claim-banner";
import { ConnectPanel } from "./connect-panel";
import { Inspector } from "./inspector";
import { SevenSeg } from "./seven-seg";
import { TimelineBar } from "./timeline-bar";
import { UartLog } from "./uart-log";
import { Vault } from "./vault";
import { WeightHeatmap } from "./weight-heatmap";
import { phaseMarks } from "@/lib/snn/research";
import { startSimulator } from "@/lib/snn/simulator";
import { cyclicLine, phaseLabel, useLab } from "@/lib/snn/store";
import type { Screen } from "@/lib/snn/types";
import { cn } from "@/lib/utils";

const NAV: { id: Screen; label: string }[] = [
  { id: "results", label: "Results" },
  { id: "cockpit", label: "Training LIVE" },
  { id: "agents", label: "Agent Graph" },
  { id: "matrix", label: "64-Weight" },
  { id: "chat", label: "After-train" },
  { id: "timeline", label: "Timeline" },
  { id: "proof", label: "Anti-Hardcode" },
  { id: "sessions", label: "Sessions A/B" },
  { id: "board", label: "Basys 3" },
];

const PHASE_IDS = ["RESET", "BEFORE", "TRAIN", "FREEZE", "AFTER", "ERASE", "RETRAIN"] as const;

function ClientGraph() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="grid h-full place-items-center text-sm text-mute">Mounting graph</div>;
  return <GraphCanvas />;
}

export function AppShell() {
  const screen = useLab((s) => s.screen);
  const setScreen = useLab((s) => s.setScreen);
  const frame = useLab((s) => s.frame);
  const mode = useLab((s) => s.mode);
  const speed = useLab((s) => s.speed);
  const setSpeed = useLab((s) => s.setSpeed);
  const pause = useLab((s) => s.pause);
  const resume = useLab((s) => s.resume);
  const startEval = useLab((s) => s.startEval);
  const resetWeights = useLab((s) => s.resetWeights);
  const source = useLab((s) => s.source);
  const rxBytes = useLab((s) => s.rxBytes);
  const session = useLab((s) => s.session);
  const llmTrain = useLab((s) => s.llmTrain);
  const llmAfter = useLab((s) => s.llmAfter);
  const inspectorOpen = useLab((s) => s.inspectorOpen);
  const hits = useLab((s) => s.cyclicHits);
  const trials = useLab((s) => s.cyclicTrials);
  const [connectOpen, setConnectOpen] = useState(false);
  const cyc = cyclicLine(frame, hits, trials);
  const marks = phaseMarks(frame.phase, frame.updates, frame.freeze, frame.learn);

  useEffect(() => startSimulator(), []);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-x-hidden bg-canvas text-ink">
      <header className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line px-3 py-2 md:px-4">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">FPGA Learning Graph</div>
          <div className="truncate text-sm font-medium tracking-tight">M8-HW-06B PASS · Basys3 · COM8</div>
        </div>
        <SevenSeg value={frame.weight} />
        <div className="ml-auto flex flex-wrap items-center gap-2 font-mono text-[11px] tabular-nums text-mute">
          <span>
            {source === "board" ? (rxBytes ? `COM8 LIVE · ${rxBytes} B` : "COM8 im lặng · SW11+BTNU") : source === "sim" ? "GIẢ LẬP" : "CHƯA NỐI"}
          </span>
          <span>S{session.name}</span>
          <span className={frame.learn ? "text-warn" : "text-pass"}>{phaseLabel(frame.phase)}</span>
        </div>
      </header>

      <ClaimBanner />

      <div className="flex min-w-0 shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-2 md:px-4">
        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {NAV.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setScreen(v.id)}
              className={cn("h-9 shrink-0 rounded-sm px-3 text-xs font-medium", screen === v.id ? "bg-elevated text-ink" : "text-mute hover:text-ink")}
            >
              {v.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant={source === "board" ? "default" : "outline"} onClick={() => setConnectOpen(true)}>
            <Radio className="size-3.5" />
            COM8
          </Button>
          <Button size="sm" variant="outline" onClick={resetWeights}>
            RESET
          </Button>
          <Button size="sm" variant="outline" onClick={startEval}>
            EVAL
          </Button>
          {mode === "paused" ? (
            <Button size="sm" variant="outline" onClick={resume}>
              <CirclePlay className="size-3.5" />
            </Button>
          ) : (
            <Button size="sm" variant="outline" onClick={pause}>
              <CirclePause className="size-3.5" />
            </Button>
          )}
          {([1, 4, 16] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={cn("h-8 rounded-sm px-2 font-mono text-[11px]", speed === s ? "bg-steel text-steel-fg" : "text-mute")}
            >
              {s}×
            </button>
          ))}
        </div>
      </div>

      <div className="grid shrink-0 grid-cols-2 gap-px border-b border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        {[
          ["Phase", phaseLabel(frame.phase)],
          ["Tick / upd", `${frame.tick} / ${frame.updates}`],
          ["Cyclic route", cyc.line],
          ["Phrase basin", "0x88 R1 · HW-05"],
          ["06B multi-turn", "PASS · not LLM"],
          ["Learn / freeze", `${frame.learn ? "ON" : "off"} / ${frame.freeze ? "ON" : "off"}`],
          ["LLM T / A", `${llmTrain} / ${llmAfter}`],
        ].map(([k, v]) => (
          <div key={k} className="bg-canvas px-3 py-2">
            <div className="text-[10px] uppercase tracking-wider text-faint">{k}</div>
            <div className="font-mono text-sm tabular-nums">{v}</div>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className={cn("hidden w-48 shrink-0 flex-col border-r border-line bg-panel md:flex", screen === "results" && "md:hidden")}>
          <div className="border-b border-line px-3 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
            Train phase
          </div>
          <ol className="flex-1 space-y-0.5 p-2">
            {PHASE_IDS.map((id) => {
              const m = marks[id];
              const mark = m === "done" ? "✓" : m === "active" ? "●" : m === "fail" ? "×" : "○";
              return (
                <li
                  key={id}
                  className={cn(
                    "rounded-sm px-2 py-1.5 font-mono text-xs",
                    m === "active" && "bg-elevated text-ink",
                    m === "done" && "text-pass",
                    m === "pending" && "text-mute",
                  )}
                >
                  {mark} {id}
                  {m === "done" ? <span className="ml-1 text-[10px] text-faint">done</span> : null}
                  {m === "active" ? <span className="ml-1 text-[10px] text-faint">now</span> : null}
                </li>
              );
            })}
          </ol>
          <div className="border-t border-line p-3 font-mono text-[11px] text-mute">
            in 0x{frame.input.toString(16).padStart(2, "0")}
            <br />
            out 0x{frame.output.toString(16).padStart(2, "0")}
            <br />
            tch {frame.learn ? `0x${frame.teacher.toString(16).padStart(2, "0")}` : "DISABLED"}
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {screen === "results" ? (
            <ResultsBoard />
          ) : screen === "chat" ? (
            <AfterTrainChat />
          ) : screen === "matrix" ? (
            <div className="overflow-auto p-4">
              <WeightHeatmap />
            </div>
          ) : screen === "proof" ? (
            <div className="overflow-auto p-4">
              <AntiHardcode />
            </div>
          ) : screen === "sessions" ? (
            <div className="overflow-auto p-4">
              <Vault />
            </div>
          ) : screen === "board" ? (
            <div className="overflow-auto p-4">
              <BoardGuide />
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1">
                <ClientGraph />
              </div>
              {screen === "cockpit" || screen === "timeline" ? (
                <div className="shrink-0 border-t border-line px-3 py-2">
                  <TimelineBar />
                </div>
              ) : null}
              {screen === "cockpit" ? (
                <div className="max-h-48 shrink-0 overflow-auto border-t border-line p-3">
                  <WeightHeatmap />
                </div>
              ) : null}
            </>
          )}
        </main>

        {screen !== "results" && screen !== "chat" ? (
          inspectorOpen ? (
            <div className="hidden w-[20rem] shrink-0 lg:block">
              <Inspector />
            </div>
          ) : (
            <div className="hidden w-[20rem] shrink-0 border-l border-line bg-panel lg:block">
              <Inspector />
            </div>
          )
        ) : null}
      </div>

      {screen !== "results" ? (
        <div className="shrink-0 overflow-x-auto border-t border-line bg-panel px-3 py-2 md:px-4">
          <Basys3Panel />
        </div>
      ) : null}
      {screen !== "results" ? (
        <div className="hidden border-t border-line px-3 py-1 md:block">
          <UartLog />
        </div>
      ) : null}

      {connectOpen ? <ConnectPanel onClose={() => setConnectOpen(false)} /> : null}
    </div>
  );
}
