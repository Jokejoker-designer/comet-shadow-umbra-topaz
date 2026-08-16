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
  const showInspector = inspectorOpen && (screen === "cockpit" || screen === "agents");

  useEffect(() => startSimulator(), []);

  return (
    <div className="flex h-dvh min-w-0 flex-col overflow-hidden bg-canvas text-ink">
      <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-line px-3 py-1.5 md:px-4">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-faint">FPGA Learning Graph</div>
          <div className="truncate text-sm font-medium tracking-tight">M8-LM-05 PASS · Basys 3 last gate · COM10</div>
        </div>
        <SevenSeg value={frame.weight} />
        <div className="ml-auto flex flex-wrap items-center gap-2 font-mono text-[11px] tabular-nums text-mute">
          <span>
            {source === "board" ? (rxBytes ? `UART LIVE · ${rxBytes} B` : "UART im lặng · SW tắt") : source === "sim" ? "GIẢ LẬP" : "CHƯA NỐI"}
          </span>
          <span>S{session.name}</span>
          <span className={frame.learn ? "text-warn" : "text-pass"}>{phaseLabel(frame.phase)}</span>
          <span>
            ctx {frame.ctx ?? 0} / out 0x{frame.output.toString(16).padStart(2, "0")}
          </span>
          <span>LLM {llmTrain}/{llmAfter}</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <Button size="sm" variant={source === "board" ? "default" : "outline"} onClick={() => setConnectOpen(true)}>
            <Radio className="size-3.5" />
            UART
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
      </header>

      <div className="flex min-w-0 shrink-0 items-center gap-2 border-b border-line px-3 py-1 md:px-4">
        <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto">
          {NAV.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setScreen(v.id)}
              className={cn("h-8 shrink-0 rounded-sm px-3 text-xs font-medium", screen === v.id ? "bg-elevated text-ink" : "text-mute hover:text-ink")}
            >
              {v.label}
            </button>
          ))}
        </nav>
        <span className="hidden shrink-0 font-mono text-[10px] text-faint xl:inline">{cyc.line}</span>
      </div>

      <ClaimBanner />

      <div className="lab-workspace">
        {screen === "results" ? (
          <ResultsBoard />
        ) : screen === "chat" ? (
          <AfterTrainChat />
        ) : screen === "matrix" ? (
          <div className="flex min-h-0 flex-1 flex-col p-3 md:p-4">
            <WeightHeatmap fill />
          </div>
        ) : screen === "proof" ? (
          <div className="min-h-0 flex-1 overflow-auto p-4">
            <AntiHardcode />
          </div>
        ) : screen === "sessions" ? (
          <div className="min-h-0 flex-1 overflow-auto p-4">
            <Vault />
          </div>
        ) : screen === "board" ? (
          <div className="min-h-0 flex-1 overflow-auto p-4">
            <div className="mx-auto max-w-5xl space-y-6">
              <Basys3Panel large />
              <BoardGuide />
            </div>
          </div>
        ) : screen === "cockpit" ? (
          <div className="lab-cockpit">
            <div className="lab-cockpit-stage">
              <div className="min-h-0 flex-1">
                <ClientGraph />
              </div>
              <div className="shrink-0 border-t border-line px-3 py-1.5">
                <TimelineBar />
              </div>
            </div>
            <aside className="lab-cockpit-rail">
              <ol className="flex flex-wrap gap-1">
                {PHASE_IDS.map((id) => {
                  const m = marks[id];
                  return (
                    <li
                      key={id}
                      className={cn(
                        "rounded-xs px-1.5 py-0.5 font-mono text-[10px]",
                        m === "active" && "bg-elevated text-ink",
                        m === "done" && "text-pass",
                        m === "pending" && "text-mute",
                      )}
                    >
                      {m === "done" ? "✓" : m === "active" ? "●" : "○"} {id}
                    </li>
                  );
                })}
              </ol>
              <Basys3Panel />
              <WeightHeatmap />
              {showInspector ? <Inspector /> : <UartLog compact />}
            </aside>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1">
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">
              <div className="min-h-0 flex-1">
                <ClientGraph />
              </div>
              {screen === "timeline" ? (
                <div className="shrink-0 border-t border-line px-3 py-1.5">
                  <TimelineBar />
                </div>
              ) : null}
            </div>
            {showInspector ? (
              <div className="hidden w-72 shrink-0 overflow-y-auto lg:block">
                <Inspector />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {connectOpen ? <ConnectPanel onClose={() => setConnectOpen(false)} /> : null}
    </div>
  );
}
