import { manualSource, selectedPair } from "./board";
import { inferOutput } from "./codec";
import { useLab } from "./store";
import { EVAL_TICKS, INITIAL_CROSS, LTP_DELTA, TARGET_W, TRAIN_TICKS, WEIGHT_LIMIT, type Phase, type UartFrame } from "./types";

function lineOf(f: UartFrame): string {
  return `tick=${f.tick} updates=${f.updates} mismatch=${f.mismatch} weight=${f.weight} hex=${(f.weight & 0xffff).toString(16).toUpperCase().padStart(4, "0")} in=0x${f.input.toString(16).padStart(2, "0")} out=0x${f.output.toString(16).padStart(2, "0")} auto=${f.auto ? 1 : 0} learn=${f.learn ? 1 : 0} freeze=${f.freeze ? 1 : 0}`;
}

function applyLeds(next: UartFrame, auto: boolean) {
  const led = Array.from({ length: 16 }, () => false);
  for (let i = 0; i < 8; i++) led[i] = Boolean((next.output >> i) & 1);
  led[8] = false;
  led[9] = true;
  led[10] = true;
  led[11] = next.learn;
  led[12] = next.freeze;
  led[13] = next.learn;
  led[14] = auto;
  led[15] = true;
  useLab.getState().setLeds(led);
}

export function startSimulator(): () => void {
  let acc = 0;
  let last = performance.now();
  let raf = 0;

  const tick = (now: number) => {
    const st = useLab.getState();
    const dt = now - last;
    last = now;
    const run = st.source === "sim" && st.connected && st.mode !== "paused" && st.sw[11];
    const active =
      run &&
      (st.frame.phase === "eval_before" ||
        st.frame.phase === "train" ||
        st.frame.phase === "eval_after" ||
        st.frame.phase === "hold");
    if (active) {
      const interval = 70 / st.speed;
      acc += dt;
      while (acc >= interval) {
        acc -= interval;
        stepAuto();
      }
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

function stepAuto() {
  const st = useLab.getState();
  const phaseIdx = st.autoPhase & 7;
  const input = 1 << phaseIdx;
  const teacher = 1 << ((phaseIdx + 1) & 7);
  const next: UartFrame = {
    ...st.frame,
    weights: st.frame.weights.map((r) => r.slice()),
    updateCounts: st.frame.updateCounts.map((r) => r.slice()),
    auto: true,
    tick: st.frame.tick + 1,
    input,
    teacher: 0,
  };

  let phase: Phase = st.frame.phase;
  if (next.tick <= EVAL_TICKS) phase = "eval_before";
  else if (next.tick <= EVAL_TICKS + TRAIN_TICKS) phase = "train";
  else if (next.tick <= EVAL_TICKS + TRAIN_TICKS + EVAL_TICKS) phase = "eval_after";
  else phase = "hold";

  const learn = phase === "train" && !st.sw[9];
  const freeze = !learn;
  next.phase = phase;
  next.learn = learn;
  next.freeze = freeze;
  next.teacher = learn ? teacher : 0;

  if (learn) {
    const src = phaseIdx;
    const dst = (phaseIdx + 1) & 7;
    next.updateCounts[dst][src] += 1;
    next.updates += 1;
    next.weights[dst][src] = Math.min(WEIGHT_LIMIT, INITIAL_CROSS + next.updateCounts[dst][src] * LTP_DELTA);
    next.mismatch += 1;
  }

  next.output = phase === "eval_before" ? 0 : inferOutput(next.weights, input);
  const { src, dst } = selectedPair(st.sw);
  next.weight = next.weights[dst][src];
  if (phase === "hold") next.afterAcc = 100;
  if (phase === "eval_before") next.beforeAcc = 0;
  next.line = lineOf(next);
  st.ingest(next, { src: phaseIdx, dst: (phaseIdx + 1) & 7 });
  useLab.getState().setAutoPhase((phaseIdx + 1) & 7);
  applyLeds(next, true);
}

/** SW11 OFF: source=SW7:0, learn=SW8, freeze=SW9, teacher=0 */
export function manualTick() {
  const st = useLab.getState();
  if (st.sw[11]) return;
  const input = manualSource(st.sw);
  const learn = st.sw[8] && !st.sw[9];
  const freeze = st.sw[9];
  const next: UartFrame = {
    ...st.frame,
    weights: st.frame.weights.map((r) => r.slice()),
    updateCounts: st.frame.updateCounts.map((r) => r.slice()),
    auto: false,
    tick: st.frame.tick + 1,
    input,
    teacher: 0,
    learn,
    freeze,
    phase: freeze ? "hold" : learn ? "train" : "eval_after",
  };
  next.output = inferOutput(next.weights, input);
  const { src, dst } = selectedPair(st.sw);
  next.weight = next.weights[dst][src];
  next.line = lineOf(next);
  st.ingest(next, input ? { src: Math.log2(input & -input), dst: 0 } : undefined);
  applyLeds(next, false);
}

export function jumpToLiveBoard() {
  useLab.getState().startEval();
}
