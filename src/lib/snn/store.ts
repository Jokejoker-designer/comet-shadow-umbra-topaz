import { create } from "zustand";
import { allOffSwitches, applyFlagsToBoard, emptyLeds, ledsFromTelemetry, selectedPair, type BtnId } from "./board";
import { inferOutput } from "./codec";
import { makeResponse, type ResponseObject } from "./chat-protocol";
import { encodeTokens, inferAfterTurns } from "./phrase";
import { blankFrame } from "./parse-uart";
import { writeSerial } from "./uart-io";
import { CMD_T_CLEAR, commandFrame, temporalProbeFrame } from "./uart";
import { antiHardcode } from "./scorecard";
import { clone8, MATRIX_A, MATRIX_B, MATRIX_RESET } from "./board-record";
import { SESSION_A_MAP, SESSION_B_MAP, cloneMatrix, cyclicScore, mappingHash } from "./research";
import {
  EVAL_TICKS,
  INITIAL_CROSS,
  LTP_DELTA,
  N_AGENTS,
  TARGET_W,
  TRAIN_TICKS,
  emptyWeights,
  type Experiment,
  type Phase,
  type Screen,
  type Snapshot,
  type UartFrame,
} from "./types";

type FeedSource = "idle" | "sim" | "board";
type SimMode = "live" | "paused";

type LabState = {
  frame: UartFrame;
  log: string[];
  screen: Screen;
  selectedId: string | null;
  inspectorOpen: boolean;
  hoverAgent: number | null;
  showAllSynapses: boolean;
  mode: SimMode;
  speed: 1 | 4 | 16;
  connected: boolean;
  source: FeedSource;
  port: string;
  baud: number;
  serialError: string | null;
  lastRxAt: number | null;
  rxBytes: number;
  rxLines: number;
  lastPulse: { src: number; dst: number; at: number } | null;
  sw: boolean[];
  led: boolean[];
  btnFlash: BtnId | null;
  autoPhase: number;
  snapshots: Snapshot[];
  travelTick: number | null;
  session: { name: "A" | "B"; seed: number; hash: string };
  mapping: number[];
  dumps: { a: number[][] | null; reset: number[][] | null; b: number[][] | null };
  dumpView: "live" | "a" | "reset" | "b" | "diff";
  lastProbe: {
    input: string;
    inCode: number;
    outCode: number;
    basin: "NONE" | "CYCLIC" | "SEMANTIC";
  } | null;
  cyclicHits: number;
  cyclicTrials: number;
  llmTrain: number;
  llmAfter: number;
  afterArmed: boolean;
  holdTurns: string[];
  requestId: number;
  responses: ResponseObject[];
  lastResponse: ResponseObject | null;
  pendingChat: { id: number; input: string; turns: string[]; t0: number } | null;
  chat: Array<{ role: "user" | "bot"; text: string; meta: string }>;
  experiments: Experiment[];
  setScreen: (s: Screen) => void;
  select: (id: string | null) => void;
  setInspector: (open: boolean) => void;
  setHover: (i: number | null) => void;
  toggleAllSynapses: () => void;
  setSpeed: (s: 1 | 4 | 16) => void;
  connectSim: () => void;
  pause: () => void;
  resume: () => void;
  ingest: (frame: UartFrame, pulse?: { src: number; dst: number }) => void;
  attachBoard: (port: string, baud: number) => void;
  detachBoard: () => void;
  setSerialError: (msg: string | null) => void;
  markRx: (n: number) => void;
  noteRaw: (hex: string) => void;
  toggleSw: (i: number) => void;
  pressBtn: (id: BtnId) => void;
  setLeds: (led: boolean[]) => void;
  setAutoPhase: (n: number) => void;
  resetWeights: () => void;
  startEval: () => void;
  seekTick: (tick: number | null) => void;
  sendChat: (text: string) => void;
  armAfterTrain: () => void;
  resetCtx: () => void;
  newSession: (name: "A" | "B") => void;
  loadMapping: (which: "A" | "B") => void;
  dumpNow: (slot: "a" | "reset" | "b") => void;
  setDumpView: (v: LabState["dumpView"]) => void;
};

const LOG_CAP = 280;
const SNAP_CAP = 180;

function applyChatReply(
  set: (p: Partial<LabState>) => void,
  get: () => LabState,
  opts: { id: number; raw: string; turns: string[]; basin: number; ctx: number; t0: number; via: "board" | "replay" },
) {
  const tokens = encodeTokens(opts.raw);
  const flags = {
    teacher: false,
    learn: false,
    freeze: true,
    weightWrites: 0,
    responseValid: true,
    fpgaSource: opts.via === "board",
  };
  const resp = makeResponse({
    requestId: opts.id,
    input: opts.raw,
    basin: opts.basin,
    ctx: opts.ctx,
    flags,
    latencyMs: Math.max(0.4, performance.now() - opts.t0),
  });
  if (opts.via === "replay") {
    resp.reason = "offline replay of silicon law (not LLM) · connect COM8 for live A5 64";
  }
  const user = { role: "user" as const, text: opts.raw, meta: `req #${opts.id} · turn ${opts.turns.length} · ${opts.via}` };
  const bot = {
    role: "bot" as const,
    text: resp.text,
    meta: `basin 0x${resp.fpga_response.toString(16).padStart(2, "0")} · ${resp.gate} · ${opts.via}`,
  };
  set({
    requestId: opts.id,
    holdTurns: opts.turns,
    pendingChat: null,
    lastResponse: resp,
    responses: [...get().responses, resp].slice(-40),
    lastProbe: {
      input: opts.raw,
      inCode: tokens[0],
      outCode: resp.fpga_response,
      basin: resp.fpga_response === 0 ? "NONE" : "SEMANTIC",
    },
    chat: [...get().chat, user, bot],
    llmAfter: 0,
  });
}

function capture(frame: UartFrame): Snapshot {
  return {
    tick: frame.tick,
    phase: frame.phase,
    weights: frame.weights.map((r) => r.slice()),
    updates: frame.updates,
    input: frame.input,
    output: frame.output,
    acc: frame.afterAcc,
  };
}

export const useLab = create<LabState>((set, get) => ({
  frame: blankFrame(),
  log: ["LM-05 PASS · Basys last gate. UART COM10 (LM) / COM8 (06B) hoặc mô phỏng."],
  screen: "results",
  selectedId: "syn-1-0",
  inspectorOpen: false,
  hoverAgent: null,
  showAllSynapses: false,
  mode: "paused",
  speed: 4,
  connected: false,
  source: "idle",
  port: "—",
  baud: 115200,
  serialError: null,
  lastRxAt: null,
  rxBytes: 0,
  rxLines: 0,
  lastPulse: null,
  sw: allOffSwitches(),
  led: emptyLeds(),
  btnFlash: null,
  autoPhase: 0,
  snapshots: [],
  travelTick: null,
  session: { name: "A", seed: 2026081401, hash: mappingHash(SESSION_A_MAP) },
  mapping: SESSION_A_MAP.slice(),
  dumps: { a: clone8(MATRIX_A), reset: clone8(MATRIX_RESET), b: clone8(MATRIX_B) },
  dumpView: "a",
  lastProbe: null,
  cyclicHits: 0,
  cyclicTrials: 0,
  llmTrain: 0,
  llmAfter: 0,
  afterArmed: false,
  holdTurns: [],
  requestId: 141,
  responses: [],
  lastResponse: null,
  pendingChat: null,
  chat: [],
  experiments: [],

  setScreen: (screen) => set({ screen }),
  select: (id) => set({ selectedId: id, inspectorOpen: id !== null }),
  setInspector: (inspectorOpen) => set({ inspectorOpen }),
  setHover: (hoverAgent) => set({ hoverAgent }),
  toggleAllSynapses: () => set({ showAllSynapses: !get().showAllSynapses }),
  setSpeed: (speed) => set({ speed }),
  connectSim: () =>
    set({
      source: "sim",
      connected: true,
      mode: "live",
    }),
  pause: () => set({ mode: "paused" }),
  resume: () => set({ mode: "live", connected: true, source: get().source === "board" ? "board" : "sim" }),

  ingest: (frame, pulse) => {
    const source = get().source;
    let nextSw = get().sw;
    let nextLed = get().led;
    if (source === "board") {
      nextSw = applyFlagsToBoard(nextSw, frame.auto);
      nextLed = ledsFromTelemetry(frame.output, {
        busy: Boolean((frame.flags >> 1) & 1),
        uart: true,
        done: Boolean((frame.flags >> 2) & 1),
        update: Boolean((frame.flags >> 3) & 1),
        freeze: frame.freeze,
        learn: frame.learn,
        auto: frame.auto,
        lock: true,
      });
    }
    const weights = frame.weights.map((r) => r.slice());
    const counts = frame.updateCounts.map((r) => r.slice());
    const pending = get().pendingChat;
    if (frame.kind === "temp" && pending) {
      applyChatReply(set, get, {
        id: pending.id,
        raw: pending.input,
        turns: pending.turns,
        basin: frame.output,
        ctx: frame.ctx ?? 0,
        t0: pending.t0,
        via: "board",
      });
    }
    const { src, dst } = selectedPair(nextSw);
    if (frame.kind === "live") {
      weights[dst][src] = frame.weight;
      if (frame.weight >= INITIAL_CROSS) {
        counts[dst][src] = Math.max(counts[dst][src], Math.round((frame.weight - INITIAL_CROSS) / LTP_DELTA));
      }
    }
    const patched: UartFrame = { ...frame, weights, updateCounts: counts };
    let cyclicHits = get().cyclicHits;
    let cyclicTrials = get().cyclicTrials;
    if (patched.phase === "hold" && patched.input) {
      cyclicTrials += 1;
      const want = ((patched.input << 1) | (patched.input >> 7)) & 0xff;
      if (patched.output === want) cyclicHits += 1;
    }
    const dumps = { ...get().dumps };
    if (patched.phase === "hold" && patched.updates >= 1024 && !dumps.a) {
      dumps.a = cloneMatrix(weights);
    }
    if (patched.phase === "reset" && !dumps.reset) dumps.reset = cloneMatrix(weights);
    const snaps = get().snapshots;
    const shouldSnap = snaps.length === 0 || patched.tick - snaps[snaps.length - 1].tick >= 8;
    set({
      frame: patched,
      sw: nextSw,
      led: nextLed,
      log: [patched.line, ...get().log].slice(0, LOG_CAP),
      lastPulse: pulse ? { ...pulse, at: Date.now() } : get().lastPulse,
      lastRxAt: source === "board" ? Date.now() : get().lastRxAt,
      rxLines: source === "board" ? get().rxLines + 1 : get().rxLines,
      snapshots: shouldSnap ? [...snaps, capture(patched)].slice(-SNAP_CAP) : snaps,
      travelTick: null,
      cyclicHits,
      cyclicTrials,
      dumps,
    });
  },

  attachBoard: (port, baud) =>
    set({
      source: "board",
      connected: true,
      mode: "live",
      port,
      baud,
      serialError: null,
      frame: blankFrame(),
      log: [`COM8 mở @ ${baud}. Mọi SW = OFF.`, "SW11 ON rồi BTNU. UART sau mỗi transaction / A5 5C."],
      lastRxAt: null,
      rxBytes: 0,
      rxLines: 0,
      lastPulse: null,
      sw: allOffSwitches(),
      led: emptyLeds(),
      snapshots: [],
    }),
  detachBoard: () => set({ source: "idle", connected: false, mode: "paused", port: "—" }),
  setSerialError: (serialError) => set({ serialError, connected: serialError ? false : get().connected }),
  markRx: (n) => set({ lastRxAt: Date.now(), rxBytes: get().rxBytes + n }),
  noteRaw: (hex) => set({ log: [`RX ${hex}`, ...get().log].slice(0, LOG_CAP) }),

  toggleSw: (index) => {
    if (index < 0 || index > 15) return;
    if (get().source === "board" && get().rxBytes > 0 && index === 11) return;
    const sw = get().sw.slice();
    sw[index] = !sw[index];
    const { src, dst } = selectedPair(sw);
    set({
      sw,
      frame: { ...get().frame, weight: get().frame.weights[dst][src] },
      selectedId: `syn-${dst}-${src}`,
    });
  },
  pressBtn: (id) => {
    set({ btnFlash: id });
    window.setTimeout(() => {
      if (useLab.getState().btnFlash === id) useLab.setState({ btnFlash: null });
    }, 180);
    if (get().source === "board") {
      set({ log: [`${id} — bấm trên board (UART TX-only)`, ...get().log].slice(0, LOG_CAP) });
      return;
    }
    if (id === "U" || id === "L") get().startEval();
    if (id === "D") {
      set({ frame: { ...get().frame, input: 0, output: 0, line: "BTND clear_state" }, lastPulse: null });
    }
    if (id === "C") {
      set({ log: ["BTNC — 1 txn nếu SW11 OFF", ...get().log].slice(0, LOG_CAP) });
    }
  },
  setLeds: (led) => set({ led }),
  setAutoPhase: (autoPhase) => set({ autoPhase }),

  resetWeights: () => {
    const weights = emptyWeights();
    const { src, dst } = selectedPair(get().sw);
    const frame: UartFrame = {
      ...blankFrame(),
      weights,
      weight: weights[dst][src],
      phase: "reset",
      line: "RESET W[8×8] — chéo 64, chéo chính 0",
    };
    set({ frame, snapshots: [capture(frame)], lastPulse: null, autoPhase: 0, chat: [] });
  },

  startEval: () => {
    const weights = emptyWeights();
    const sw = get().sw.slice();
    const { src, dst } = selectedPair(sw);
    const frame: UartFrame = {
      ...blankFrame(),
      weights,
      weight: weights[dst][src],
      auto: sw[11],
      freeze: true,
      learn: false,
      phase: "eval_before",
      tick: 1,
      line: "BTNU — reset W, EVAL_BEFORE (không đổi paddle)",
    };
    set({
      frame,
      source: get().source === "board" ? "board" : "sim",
      connected: true,
      mode: "live",
      snapshots: [capture(frame)],
      autoPhase: 0,
      lastPulse: null,
    });
  },

  seekTick: (tick) => set({ travelTick: tick }),

  sendChat: (text) => {
    const raw = text.trim();
    if (!raw) return;
    const t0 = performance.now();
    let s = get();
    const id = s.requestId + 1;
    if (!s.afterArmed) {
      get().armAfterTrain();
      s = { ...get(), holdTurns: [] };
    }
    const turns = [...s.holdTurns, raw];
    const tokens = encodeTokens(raw);
    const commit = (basin: number, ctx: number, via: "board" | "replay") =>
      applyChatReply(set, get, { id, raw, turns, basin, ctx, t0, via });

    if (s.source === "board") {
      set({ pendingChat: { id, input: raw, turns, t0 } });
      void writeSerial(temporalProbeFrame(tokens, turns.length > 1)).then((ok) => {
        if (!ok) {
          const inferred = inferAfterTurns(turns);
          commit(inferred.basin, inferred.ctx, "replay");
          return;
        }
        window.setTimeout(() => {
          const still = get().pendingChat;
          if (still && still.id === id) {
            const inferred = inferAfterTurns(turns);
            commit(inferred.basin, inferred.ctx, "replay");
          }
        }, 800);
      });
      return;
    }
    const inferred = inferAfterTurns(turns);
    commit(inferred.basin, inferred.ctx, "replay");
  },

  armAfterTrain: () => {
    const frame = {
      ...get().frame,
      learn: false,
      freeze: true,
      teacher: 0,
      phase: "hold" as const,
      updates: Math.max(get().frame.updates, 1024),
      line: "AFTER-TRAIN · HW-06B hold_ctx · teacher=0 learn=0 freeze=1 writes=0",
    };
    set({ frame, afterArmed: true, mode: "paused", holdTurns: [], pendingChat: null });
  },

  resetCtx: () => {
    if (get().source === "board") void writeSerial(commandFrame(CMD_T_CLEAR));
    set({
      holdTurns: [],
      lastResponse: null,
      pendingChat: null,
    });
  },

  newSession: (name) => {
    const map = name === "A" ? SESSION_A_MAP : SESSION_B_MAP;
    const seed = name === "A" ? 2026081401 : 2026081403;
    get().resetWeights();
    set({
      session: { name, seed, hash: mappingHash(map) },
      mapping: map.slice(),
      llmTrain: 0,
      chat: [],
      lastProbe: null,
    });
  },
  loadMapping: (which) => get().newSession(which),
  dumpNow: (slot) => set({ dumps: { ...get().dumps, [slot]: cloneMatrix(get().frame.weights) } }),
  setDumpView: (dumpView) => set({ dumpView }),
}));

export function phaseLabel(phase: Phase): string {
  return phase.replace("_", " ").toUpperCase();
}

export function viewedFrame(): UartFrame {
  const s = useLab.getState();
  if (s.travelTick == null) return s.frame;
  const snap = [...s.snapshots].reverse().find((x) => x.tick <= s.travelTick!);
  if (!snap) return s.frame;
  return {
    ...s.frame,
    tick: snap.tick,
    phase: snap.phase,
    weights: snap.weights,
    updates: snap.updates,
    input: snap.input,
    output: snap.output,
    afterAcc: snap.acc,
    weight: snap.weights[1][0],
  };
}

export function accuracyNow(frame: UartFrame): number {
  if (frame.afterAcc) return frame.afterAcc;
  let ok = 0;
  for (let s = 0; s < N_AGENTS; s++) {
    const stim = 1 << s;
    const want = 1 << ((s + 1) & 7);
    if (inferOutput(frame.weights, stim) === want) ok += 1;
  }
  return Math.round((ok / 8) * 100);
}

export function cyclicLine(frame: UartFrame, hits: number, trials: number): { line: string; note: string } {
  if (trials > 0 && frame.phase === "hold") {
    return { line: `${Math.round((hits / trials) * 100)}% · ${hits}/${trials}`, note: "đếm HOLD live" };
  }
  return cyclicScore({
    phase: frame.phase,
    updates: frame.updates,
    w10: frame.weights[1][0] || frame.weight,
    freeze: frame.freeze,
  });
}

export { antiHardcode, EVAL_TICKS, TARGET_W, TRAIN_TICKS };
