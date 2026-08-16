export type GateStatus = "pass" | "fail" | "warn" | "pending" | "locked";

export type Phase =
  | "idle"
  | "reset"
  | "eval_before"
  | "train"
  | "eval_after"
  | "score"
  | "hold"
  | "erase";

export type Screen =
  | "results"
  | "cockpit"
  | "agents"
  | "matrix"
  | "chat"
  | "timeline"
  | "proof"
  | "sessions"
  | "board";

export type UartFrame = {
  kind: "live" | "result" | "temp";
  ctx: number;
  tick: number;
  updates: number;
  mismatch: number;
  weight: number;
  weights: number[][];
  updateCounts: number[][];
  input: number;
  output: number;
  teacher: number;
  dominant: number;
  auto: boolean;
  freeze: boolean;
  learn: boolean;
  flags: number;
  phase: Phase;
  line: string;
  beforeAcc: number;
  afterAcc: number;
  beforeMis: number;
  afterMis: number;
  routePass: number;
  finalPass: boolean;
  freezePass: boolean;
};

export type EvidenceItem = {
  id: string;
  label: string;
  status: GateStatus;
  detail: string;
};

export type Experiment = {
  id: string;
  name: string;
  startedAt: string;
  seed: number;
  mappingHash: string;
  bitstream: string;
  board: string;
  port: string;
  baud: number;
  verdict: "PASS" | "FAIL" | "PARTIAL";
  notes: string;
  snapshot: UartFrame;
  evidence: EvidenceItem[];
  accBefore: number;
  accAfter: number;
};

export type Snapshot = {
  tick: number;
  phase: Phase;
  weights: number[][];
  updates: number;
  input: number;
  output: number;
  acc: number;
};

export const N_AGENTS = 8;
export const INITIAL_CROSS = 64;
export const LTP_DELTA = 8;
export const WEIGHT_LIMIT = 2047;
export const ROUTE_GATE = 256;
export const TRAIN_TICKS = 1024;
export const EVAL_TICKS = 32;
export const TARGET_W = 64 + 8 * 128; // 1088 = 0x0440

export function emptyWeights(): number[][] {
  return Array.from({ length: N_AGENTS }, (_, d) =>
    Array.from({ length: N_AGENTS }, (_, s) => (d === s ? 0 : INITIAL_CROSS)),
  );
}

export function emptyCounts(): number[][] {
  return Array.from({ length: N_AGENTS }, () => Array.from({ length: N_AGENTS }, () => 0));
}

export function phaseFromSup(n: number): Phase {
  switch (n) {
    case 1:
      return "eval_before";
    case 2:
      return "train";
    case 3:
      return "eval_after";
    case 4:
      return "score";
    case 5:
      return "hold";
    default:
      return "idle";
  }
}
