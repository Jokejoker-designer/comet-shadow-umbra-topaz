/** Exact map from rtl/board/basys3_eight_agent_top.sv */

export type BtnId = "U" | "D" | "L" | "C" | "R";

/** Paddle labels — SW8 is inspect src[2], NOT learn (learn is LED13). */
export const SW_LABEL = [
  "MAN0",
  "MAN1",
  "MAN2",
  "MAN3",
  "MAN4",
  "MAN5",
  "SRC0",
  "SRC1",
  "SRC2",
  "FRZ",
  "REMAP",
  "AUTO",
  "DENSE",
  "DST0",
  "TEMP",
  "DST2",
];

export const SW_HINT = [
  "SW11 OFF: source spike bit 0",
  "SW11 OFF: source spike bit 1",
  "SW11 OFF: source spike bit 2",
  "SW11 OFF: source spike bit 3",
  "SW11 OFF: source spike bit 4",
  "SW11 OFF: source spike bit 5",
  "Inspect src bit 0 · SW11 OFF: source bit 6",
  "Inspect src bit 1 · SW11 OFF: source bit 7",
  "Inspect src bit 2 (cfg_src[2]). SW11 OFF: manual LEARN. AUTO: không phải learn.",
  "Freeze override (AUTO). UART freeze bit ≠ paddle này.",
  "OFF cho dense/temporal (cyclic vs remap).",
  "AUTO / cyclic enable. 06B temporal arm bằng A5 62 (SW11 không bắt buộc).",
  "Dense mode (hoặc A5 60).",
  "Inspect dest bit 0 — dest = SW15:13. 03/04/05/06 OFF.",
  "Temporal mode (hoặc A5 62).",
  "Inspect dest bit 2",
];

export const LED_LABEL = [
  "OUT0",
  "OUT1",
  "OUT2",
  "OUT3",
  "OUT4",
  "OUT5",
  "OUT6",
  "OUT7",
  "BUSY",
  "UART",
  "DONE",
  "ΔW",
  "FRZ",
  "LRN",
  "AUTO",
  "LOCK",
];

export const BTN_META: Record<BtnId, { name: string; does: string }> = {
  U: { name: "BTNU", does: "reset_weights + restart EVAL (không gạt SW)" },
  D: { name: "BTND", does: "clear_state" },
  L: { name: "BTNL", does: "MMCM / global reset" },
  C: { name: "BTNC", does: "1 transaction khi SW11 OFF" },
  R: { name: "BTNR", does: "1 packet UART thêm" },
};

export function allOffSwitches(): boolean[] {
  return Array.from({ length: 16 }, () => false);
}

export function emptyLeds(): boolean[] {
  return Array.from({ length: 16 }, () => false);
}

/** cfg_src = SW8:6, cfg_dst = SW15:13 */
export function selectedPair(sw: boolean[]): { src: number; dst: number } {
  const src = (sw[6] ? 1 : 0) + (sw[7] ? 2 : 0) + (sw[8] ? 4 : 0);
  const dst = (sw[13] ? 1 : 0) + (sw[14] ? 2 : 0) + (sw[15] ? 4 : 0);
  return { src, dst };
}

export function manualSource(sw: boolean[]): number {
  let v = 0;
  for (let i = 0; i < 8; i++) if (sw[i]) v |= 1 << i;
  return v;
}

/**
 * UART flags = {lock, sw[11], effective_learn, effective_freeze, update, done, busy, 1}
 * Chỉ sw[11] là paddle thật. learn/freeze là LED13/LED12 — KHÔNG gạt SW8/SW9.
 */
export function applyFlagsToBoard(sw: boolean[], auto: boolean): boolean[] {
  const next = sw.slice();
  next[11] = auto;
  return next;
}

export function ledsFromTelemetry(
  output: number,
  flags: {
    busy: boolean;
    uart: boolean;
    done: boolean;
    update: boolean;
    freeze: boolean;
    learn: boolean;
    auto: boolean;
    lock: boolean;
  },
): boolean[] {
  const led = Array.from({ length: 16 }, () => false);
  for (let i = 0; i < 8; i++) led[i] = Boolean((output >> i) & 1);
  led[8] = flags.busy;
  led[9] = flags.uart;
  led[10] = flags.done;
  led[11] = flags.update;
  led[12] = flags.freeze;
  led[13] = flags.learn;
  led[14] = flags.auto;
  led[15] = flags.lock;
  return led;
}

export const DEMO_STEPS = [
  "LED15 = LOCK. LED8 = BUSY (nháy mỗi txn) — không phải SW8.",
  "SW8:6 = inspect src. src=0 ⇒ SW8 SW7 SW6 đều OFF. SW8 không phải LEARN.",
  "SW15:13 = inspect dest. W[1][0] ⇒ chỉ SW13 ON.",
  "SW11 ON + BTNU. LEARN = LED13, FREEZE = LED12 (supervisor), SW9 chỉ là override.",
  "HOLD cyclic: LED12 sáng, LED7:0 01…80, 7-seg 0440.",
  "06B: nạp m8hw06b.bit, SW10 OFF, Connect COM8, ARM AFTER, gửi 3 lượt Quân/chào/hỏi tên.",
  "LM-05: nạp basys3_lm05.bit (không đè bit 06B). Mọi SW tắt. UART COM10. 7-seg 05xx.",
];
