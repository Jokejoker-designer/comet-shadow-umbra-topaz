import { TARGET_W, type Phase } from "./types";

export const MILESTONE = "M8-HW-06B";
export const MILESTONE_TITLE = "SIMPLE LEARNED MULTI-TURN";
export const MILESTONE_CLAIM = "SIMPLE_LEARNED_MULTI_TURN_CONVERSATION_BOARD_VALIDATED";
export const NEXT_MILESTONE = "Ladder 01→06B closed · not an LLM";

export const CLAIMS = [
  { id: "cyclic", label: "CYCLIC ROUTE", state: "PASS" as const },
  { id: "assoc", label: "ARBITRARY ASSOCIATION", state: "PASS" as const },
  { id: "dense", label: "64-CELL PARALLEL", state: "PASS" as const },
  { id: "temporal", label: "TEMPORAL MEMORY", state: "PASS" as const },
  { id: "phrase", label: "PHRASE BASIN", state: "PASS" as const },
  { id: "after", label: "TEACHER-FREE AFTER", state: "PASS" as const },
  { id: "chat", label: "SIMPLE MULTI-TURN", state: "PASS" as const },
  { id: "llm", label: "OPEN-DOMAIN LLM", state: "NOT TRAINED" as const },
];

/** Host session echo from M8-HW-02 BOARD PASS — not compiled into RTL. */
export const SESSION_A_MAP = [1, 7, 4, 5, 3, 2, 0, 6];
export const SESSION_B_MAP = [5, 6, 0, 1, 7, 3, 2, 4];
export const CYCLIC_MAP = [1, 2, 3, 4, 5, 6, 7, 0];
export const REMAP_B = SESSION_B_MAP;

export type MilestoneRecord = {
  id: string;
  title: string;
  claim: string;
  status: "PASS" | "NEXT" | "BLOCKED";
  bit: string;
  sha: string;
  date: string;
  numbers: { k: string; v: string }[];
  notClaimed: string;
};

export const MILESTONES: MilestoneRecord[] = [
  {
    id: "M8-HW-01",
    title: "Cyclic learning",
    claim: "8_AGENT_CYCLIC_LEARNING_CONVERGENCE_DEMONSTRATED",
    status: "PASS",
    bit: "basys3_eight_agent.bit",
    sha: "E27B0277…318BA4",
    date: "2026-08-14",
    numbers: [
      { k: "HOLD cyclic", v: "650 / 650" },
      { k: "W[1][0]", v: "1088 = 0440" },
      { k: "Clip rail", v: "07FF never seen" },
    ],
    notClaimed: "remap · dense · conversation",
  },
  {
    id: "M8-HW-02",
    title: "Arbitrary A → reset → B",
    claim: "8_AGENT_ARBITRARY_ASSOCIATIVE_REMAPPING_BOARD_VALIDATED",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw02.bit",
    sha: "74F98993…3CB9F05B",
    date: "2026-08-14",
    numbers: [
      { k: "A before / after / forget", v: "0/32 · 32/32 · 0/32" },
      { k: "B after", v: "32/32" },
      { k: "A map", v: "[1,7,4,5,3,2,0,6] seed 2026081401" },
      { k: "B map", v: "[5,6,0,1,7,3,2,4] seed 2026081403" },
    ],
    notClaimed: "large ensemble · conversation",
  },
  {
    id: "M8-HW-03",
    title: "64-cell same-txn plasticity",
    claim: "64_SYNAPSES_SIMULTANEOUSLY_ACTIVE",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw03.bit",
    sha: "34D63D5D…C246EC45",
    date: "2026-08-14",
    numbers: [
      { k: "changed_cell_count", v: "64" },
      { k: "Host Δ", v: "64 / 64" },
      { k: "matrix SHA", v: "C2A3751D…9066B5A" },
      { k: "WNS", v: "+93.129 ns" },
    ],
    notClaimed: "temporal · conversation",
  },
  {
    id: "M8-HW-03R",
    title: "Randomized dense ensemble",
    claim: "M8_HW_03R_128_OF_128_PASS",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw03.bit",
    sha: "34D63D5D… (no rebuild)",
    date: "2026-08-14",
    numbers: [
      { k: "32/32", v: "seeds 2026081432–63" },
      { k: "128/128", v: "seeds 2026081500–1627" },
      { k: "Each session", v: "changed=64 · SHA match · freeze==after" },
    ],
    notClaimed: "order-sensitive memory",
  },
  {
    id: "M8-HW-04",
    title: "Temporal / context memory",
    claim: "TEMPORAL_SEQUENCE_MEMORY_BOARD_VALIDATED",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw04.bit",
    sha: "DEEFE548…5670D79A",
    date: "2026-08-14",
    numbers: [
      { k: "A,B,C → X", v: "0xA5 · ctx 201" },
      { k: "ACB / BAC / AB", v: "0 · not X" },
      { k: "ABC after RESET", v: "0" },
      { k: "WNS", v: "+95.532 ns" },
    ],
    notClaimed: "phrase generalization · conversation",
  },
  {
    id: "M8-HW-05",
    title: "Phrase basin association",
    claim: "PHRASE_BASIN_ASSOCIATION_BOARD_VALIDATED",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw04.bit",
    sha: "DEEFE548… (same as 04)",
    date: "2026-08-14",
    numbers: [
      { k: "xin chào / hello", v: "0x88 = R1 · chào bạn" },
      { k: "hello after P1 only", v: "0 · no class in code" },
      { k: "tạm biệt", v: "0x77 · not R1" },
      { k: "after RESET / remap", v: "0 / 0xCC = R2" },
    ],
    notClaimed: "Teacher-off chat · conversation",
  },
  {
    id: "M8-HW-06A",
    title: "Teacher-free after-train",
    claim: "TEACHER_FREE_AFTER_TRAIN_SIMPLE_INTERACTION_BOARD_VALIDATED",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw04.bit",
    sha: "DEEFE548… (no rebuild)",
    date: "2026-08-16",
    numbers: [
      { k: "xin chào / hello", v: "0x88 → chào bạn" },
      { k: "tạm biệt", v: "empty" },
      { k: "W SHA frozen", v: "5452F2B6…" },
      { k: "LLM AFTER", v: "0" },
    ],
    notClaimed: "multi-turn · name memory",
  },
  {
    id: "M8-HW-06B",
    title: "Simple multi-turn conversation",
    claim: "SIMPLE_LEARNED_MULTI_TURN_CONVERSATION_BOARD_VALIDATED",
    status: "PASS",
    bit: "basys3_eight_agent_m8hw06b.bit",
    sha: "7CE3238E…25E4B4F6",
    date: "2026-08-16",
    numbers: [
      { k: "Quân + chào + hỏi tên", v: "0x66 → Quân" },
      { k: "Lan + chào + hỏi tên", v: "0xEE → Lan" },
      { k: "chỉ Tôi tên gì? / permute", v: "0 · empty" },
      { k: "WNS / W SHA", v: "+96.343 · 7D3C316A…" },
    ],
    notClaimed: "LLM · open-domain chat",
  },
];

export const HW06B_PROBES = [
  { probe: "Tên tôi là Quân → Xin chào → Tôi tên gì?", out: "0x66", expect: "Quân", pass: true },
  { probe: "Tên tôi là Lan → Xin chào → Tôi tên gì?", out: "0xEE", expect: "Lan", pass: true },
  { probe: "RESET ctx · chỉ Tôi tên gì?", out: "0x00", expect: "empty", pass: true },
  { probe: "Xin chào → Tên tôi là Quân → hỏi tên", out: "0x00", expect: "order · empty", pass: true },
];

export const HW05_PROBES = [
  { probe: "Train P1 xin chào → R1", out: "0x88", expect: "P1 hits R1 · ctx 136", pass: true },
  { probe: "hello after TRAIN P1 only", out: "0x00", expect: "no class in code · ctx 68", pass: true },
  { probe: "xin chào + hello joint", out: "0x88", expect: "both → R1 chào bạn", pass: true },
  { probe: "tạm biệt", out: "0x77", expect: "119 · not R1", pass: true },
  { probe: "xin chào after RESET", out: "0x00", expect: "forget", pass: true },
  { probe: "remap P1+P2", out: "0xCC", expect: "204 = R2 rất vui được giúp", pass: true },
];

export type Map8 = number[];

export function mappingHash(map: Map8): string {
  let h = 0;
  for (const x of map) h = ((h << 4) ^ x) & 0xffff;
  return h.toString(16).toUpperCase().padStart(4, "0");
}

export type PhaseMark = "done" | "active" | "pending" | "fail";

export function phaseMarks(phase: Phase, updates: number, freeze: boolean, learn: boolean): Record<string, PhaseMark> {
  const order = ["RESET", "BEFORE", "TRAIN", "FREEZE", "AFTER", "ERASE", "RETRAIN"] as const;
  const idx =
    phase === "idle" || phase === "reset"
      ? 0
      : phase === "eval_before"
        ? 1
        : phase === "train"
          ? 2
          : phase === "score"
            ? 3
            : phase === "eval_after" || phase === "hold"
              ? 4
              : phase === "erase"
                ? 5
                : 0;
  const marks: Record<string, PhaseMark> = {};
  order.forEach((id, i) => {
    if (id === "FREEZE" && (phase === "hold" || phase === "eval_after") && freeze && !learn) {
      marks[id] = "done";
      return;
    }
    if (id === "TRAIN" && updates >= 1024) {
      marks[id] = phase === "train" ? "active" : "done";
      return;
    }
    if (i < idx) marks[id] = "done";
    else if (i === idx) marks[id] = "active";
    else marks[id] = "pending";
  });
  if (phase === "hold") {
    marks.AFTER = "active";
    marks.FREEZE = "done";
  }
  return marks;
}

export function cyclicScore(opts: { phase: Phase; updates: number; w10: number; freeze: boolean }): {
  known: boolean;
  line: string;
  note: string;
} {
  const hold = opts.phase === "hold" || (opts.freeze && opts.updates >= 1024 && opts.w10 >= TARGET_W);
  if (hold) return { known: true, line: "100% · 650/650", note: "M8-HW-01 BOARD PASS cyclic HOLD" };
  if (opts.phase === "eval_before" || (opts.updates === 0 && opts.w10 <= 64)) {
    return { known: true, line: "0% · W < gate", note: "EVAL_BEFORE — chưa học route" };
  }
  if (opts.phase === "train") return { known: true, line: "learning", note: "TRAIN cyclic +1" };
  return { known: false, line: "—", note: "chưa HOLD" };
}

export function cloneMatrix(m: number[][]): number[][] {
  return m.map((r) => r.slice());
}

export function diffMatrix(a: number[][] | null, b: number[][] | null): number[][] {
  const z = Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => 0));
  if (!a || !b) return z;
  for (let d = 0; d < 8; d++) for (let s = 0; s < 8; s++) z[d][s] = b[d][s] - a[d][s];
  return z;
}
