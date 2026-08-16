import { emptyCounts, emptyWeights, phaseFromSup, type Phase, type UartFrame } from "./types";
import { FRAME_LEN, KIND_LIVE, KIND_RESULT, KIND_TEMP_EVENT, SOF, UART_KINDS, parseTempEvent } from "./uart";

export { FRAME_LEN };
export const SYNC0 = SOF;
export const LIVE1 = KIND_LIVE;
export const RESULT1 = KIND_RESULT;

function signed16(lo: number, hi: number): number {
  const v = lo | (hi << 8);
  return v & 0x8000 ? v - 0x10000 : v;
}

export function checksumOk(bytes: Uint8Array): boolean {
  if (bytes.length < FRAME_LEN) return false;
  let x = 0;
  for (let i = 0; i < 14; i++) x ^= bytes[i];
  return x === bytes[14];
}

export function blankFrame(): UartFrame {
  return {
    kind: "live",
    ctx: 0,
    tick: 0,
    updates: 0,
    mismatch: 0,
    weight: 0,
    weights: emptyWeights(),
    updateCounts: emptyCounts(),
    input: 0,
    output: 0,
    teacher: 0,
    dominant: 0,
    auto: false,
    freeze: false,
    learn: false,
    flags: 0x01,
    phase: "idle",
    line: "RESET — chờ COM8 hoặc BTNU",
    beforeAcc: 0,
    afterAcc: 0,
    beforeMis: 0,
    afterMis: 0,
    routePass: 0,
    finalPass: false,
    freezePass: false,
  };
}

function phaseOf(tick: number, learn: boolean, freeze: boolean, updates: number): Phase {
  if (tick <= 0) return "idle";
  if (tick <= 32 && !learn) return "eval_before";
  if (learn) return "train";
  if (freeze && updates >= 1024 && tick >= 1057) return "hold";
  if (freeze && updates >= 1024) return "eval_after";
  if (freeze) return "eval_before";
  return "train";
}

export function decodeLive(bytes: Uint8Array, prev: UartFrame): UartFrame | null {
  if (bytes[0] !== SYNC0 || bytes[1] !== LIVE1 || !checksumOk(bytes)) return null;
  const tick = bytes[2] | (bytes[3] << 8);
  const updates = bytes[4] | (bytes[5] << 8);
  const mismatch = bytes[6] | (bytes[7] << 8);
  const weight = signed16(bytes[8], bytes[9]);
  const input = bytes[10];
  const output = bytes[11];
  const flags = bytes[13];
  const auto = Boolean((flags >> 6) & 1);
  const learn = Boolean((flags >> 5) & 1);
  const freeze = Boolean((flags >> 4) & 1);
  const teacher = input ? ((input << 1) | (input >> 7)) & 0xff : 0;
  return {
    ...prev,
    kind: "live",
    tick,
    updates,
    mismatch,
    weight,
    input,
    output,
    teacher: learn ? teacher : 0,
    auto,
    learn,
    freeze,
    flags,
    phase: phaseOf(tick, learn, freeze, updates),
    line: `tick=${tick} updates=${updates} mismatch=${mismatch} weight=${weight} hex=${(weight & 0xffff).toString(16).toUpperCase().padStart(4, "0")} in=0x${input.toString(16).padStart(2, "0")} out=0x${output.toString(16).padStart(2, "0")} auto=${auto ? 1 : 0} learn=${learn ? 1 : 0} freeze=${freeze ? 1 : 0}`,
  };
}

export function decodeResult(bytes: Uint8Array, prev: UartFrame): UartFrame | null {
  if (bytes[0] !== SYNC0 || bytes[1] !== RESULT1 || !checksumOk(bytes)) return null;
  const beforeMis = bytes[2] | (bytes[3] << 8);
  const afterMis = bytes[4] | (bytes[5] << 8);
  const beforeAcc = bytes[6];
  const afterAcc = bytes[7];
  const routePass = bytes[8];
  const packed = bytes[9];
  const updates = bytes[10] | (bytes[11] << 8);
  const tick = bytes[12] | (bytes[13] << 8);
  const finalPass = Boolean((packed >> 7) & 1);
  const freezePass = Boolean((packed >> 6) & 1);
  const phase = phaseFromSup(packed & 7);
  return {
    ...prev,
    kind: "result",
    tick,
    updates,
    beforeMis,
    afterMis,
    beforeAcc,
    afterAcc,
    routePass,
    finalPass,
    freezePass,
    freeze: freezePass,
    learn: false,
    phase,
    line: `RESULT before_acc=${beforeAcc}% after_acc=${afterAcc}% routes=${routePass.toString(2).padStart(8, "0")} final=${finalPass ? 1 : 0} freeze=${freezePass ? 1 : 0} updates=${updates} tick=${tick}`,
  };
}

export class FrameScanner {
  private buf: number[] = [];

  push(chunk: Uint8Array): Uint8Array[] {
    for (const b of chunk) this.buf.push(b);
    const frames: Uint8Array[] = [];
    while (this.buf.length >= FRAME_LEN) {
      const i = this.buf.findIndex((v, idx) => v === SYNC0 && UART_KINDS.has(this.buf[idx + 1] ?? -1));
      if (i < 0) {
        this.buf = this.buf.slice(-1);
        break;
      }
      if (i > 0) this.buf = this.buf.slice(i);
      if (this.buf.length < FRAME_LEN) break;
      const frame = Uint8Array.from(this.buf.slice(0, FRAME_LEN));
      if (checksumOk(frame)) {
        frames.push(frame);
        this.buf = this.buf.slice(FRAME_LEN);
      } else {
        this.buf.shift();
      }
    }
    return frames;
  }
}

export function decodeTemp(bytes: Uint8Array, prev: UartFrame): UartFrame | null {
  const ev = parseTempEvent(bytes);
  if (!ev) return null;
  return {
    ...prev,
    kind: "temp",
    output: ev.out,
    teacher: ev.target,
    ctx: ev.ctx,
    learn: false,
    line: `TEMP ctx=${ev.ctx} out=0x${ev.out.toString(16).padStart(2, "0")} tgt=0x${ev.target.toString(16).padStart(2, "0")} match=${ev.match ? 1 : 0}`,
  };
}

export function decodeAny(raw: Uint8Array, prev: UartFrame): UartFrame | null {
  if (raw[1] === KIND_TEMP_EVENT) return decodeTemp(raw, prev);
  if (raw[1] === RESULT1) return decodeResult(raw, prev);
  if (raw[1] === LIVE1) return decodeLive(raw, prev);
  return null;
}

export function pulseFromFrames(prev: UartFrame, next: UartFrame): { src: number; dst: number } | undefined {
  for (let i = 0; i < 8; i++) {
    if ((next.input >> i) & 1) return { src: i, dst: (i + 1) & 7 };
  }
  if (next.weight !== prev.weight) return { src: 0, dst: 1 };
  return undefined;
}

export function parseUartLine(line: string, prev: UartFrame): UartFrame | null {
  const t = line.trim();
  if (!t || t.startsWith("#")) return null;
  const map = new Map<string, string>();
  const re = /([A-Za-z_][\w]*)\s*[=:]\s*([^\s,;]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) map.set(m[1].toLowerCase(), m[2]);
  if (!map.has("tick") && !map.has("after_acc") && !t.startsWith("RESULT")) return null;
  const num = (k: string, fb: number) => {
    const raw = map.get(k);
    if (!raw) return fb;
    return raw.startsWith("0x") ? parseInt(raw, 16) : Number(raw);
  };
  return {
    ...prev,
    kind: t.startsWith("RESULT") ? "result" : "live",
    ctx: prev.ctx,
    tick: num("tick", prev.tick),
    updates: num("updates", prev.updates),
    mismatch: num("mismatch", prev.mismatch),
    weight: num("weight", prev.weight),
    input: num("in", prev.input),
    output: num("out", prev.output),
    auto: (map.get("auto") ?? "") === "1" || prev.auto,
    learn: (map.get("learn") ?? "") === "1" || prev.learn,
    freeze: (map.get("freeze") ?? "") === "1" || prev.freeze,
    phase: phaseOf(num("tick", prev.tick), (map.get("learn") ?? "") === "1", (map.get("freeze") ?? "") === "1", num("updates", prev.updates)),
    line: t,
    afterAcc: num("after_acc", prev.afterAcc),
    beforeAcc: num("before_acc", prev.beforeAcc),
  };
}

export function bitIndex(v: number): number {
  for (let i = 0; i < 8; i++) if ((v >> i) & 1) return i;
  return -1;
}
