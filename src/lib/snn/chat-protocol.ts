import { encodeTokens, lexicalize } from "./phrase";

/** Silicon AFTER uses A5 63 probe + A5 64 event (see uart.ts). These names are leftover aliases. */
export const CHAT_PROBE = 0x63;
export const CHAT_RESULT = 0x64;
export const SYNC0 = 0xa5;

export type AfterFlags = {
  teacher: boolean;
  learn: boolean;
  freeze: boolean;
  weightWrites: number;
  responseValid: boolean;
  fpgaSource: boolean;
};

export type ResponseObject = {
  request_id: number;
  input: string;
  encoded: [number, number, number];
  fpga_response: number;
  temporal_context: number;
  text: string;
  source: "FPGA" | "BLOCKED";
  teacher: boolean;
  learn: boolean;
  freeze: boolean;
  weight_writes: number;
  response_valid: boolean;
  fpga_source: boolean;
  latency_ms: number;
  app: "DELIVERED" | "HELD";
  lcd: "DISPLAYED" | "HELD";
  gate: "PASS" | "FAIL";
  reason: string;
};

export function xor14(bytes: number[]): number {
  let x = 0;
  for (let i = 0; i < 14; i++) x ^= bytes[i] & 0xff;
  return x & 0xff;
}

export function buildChatProbe(requestId: number, tokens: [number, number, number]): Uint8Array {
  const b = new Array(15).fill(0);
  b[0] = SYNC0;
  b[1] = CHAT_PROBE;
  b[2] = requestId & 0xff;
  b[3] = 3;
  b[4] = tokens[0];
  b[5] = tokens[1];
  b[6] = tokens[2];
  b[14] = xor14(b);
  return Uint8Array.from(b);
}

export function parseChatResult(bytes: Uint8Array): {
  requestId: number;
  basin: number;
  ctx: number;
  phase: number;
  flags: AfterFlags;
  updates: number;
} | null {
  if (bytes.length < 15 || bytes[0] !== SYNC0 || bytes[1] !== CHAT_RESULT) return null;
  if (xor14([...bytes]) !== bytes[14]) return null;
  const f = bytes[6];
  return {
    requestId: bytes[2],
    basin: bytes[3],
    ctx: bytes[4],
    phase: bytes[5],
    flags: {
      teacher: Boolean(f & 1),
      learn: Boolean(f & 2),
      freeze: Boolean(f & 4),
      weightWrites: (f >> 3) & 1,
      responseValid: Boolean(f & 16),
      fpgaSource: Boolean(f & 32),
    },
    updates: bytes[7] | (bytes[8] << 8) | (bytes[9] << 16) | (bytes[10] << 24),
  };
}

export function afterGate(f: AfterFlags): { ok: boolean; reason: string } {
  if (f.teacher) return { ok: false, reason: "teacher still ON" };
  if (f.learn) return { ok: false, reason: "learn still ON" };
  if (!f.freeze) return { ok: false, reason: "freeze not ON" };
  if (f.weightWrites) return { ok: false, reason: "weight write in AFTER" };
  if (!f.fpgaSource) return { ok: false, reason: "source not FPGA" };
  return { ok: true, reason: "AFTER flags clean" };
}

export function makeResponse(opts: {
  requestId: number;
  input: string;
  basin: number;
  ctx: number;
  flags: AfterFlags;
  latencyMs: number;
}): ResponseObject {
  const tokens = encodeTokens(opts.input);
  const gate = afterGate(opts.flags);
  const lex = lexicalize(opts.basin);
  const silent = gate.ok && !lex.known;
  return {
    request_id: opts.requestId,
    input: opts.input,
    encoded: tokens,
    fpga_response: opts.basin,
    temporal_context: opts.ctx,
    text: gate.ok ? lex.text : `GATE · ${gate.reason}`,
    source: gate.ok ? "FPGA" : "BLOCKED",
    teacher: opts.flags.teacher,
    learn: opts.flags.learn,
    freeze: opts.flags.freeze,
    weight_writes: opts.flags.weightWrites,
    response_valid: gate.ok,
    fpga_source: opts.flags.fpgaSource,
    latency_ms: opts.latencyMs,
    app: gate.ok ? "DELIVERED" : "HELD",
    lcd: gate.ok ? "DISPLAYED" : "HELD",
    gate: gate.ok ? "PASS" : "FAIL",
    reason: silent
      ? "FPGA out=0 · câu này chưa có basin đã học (hold_ctx không khớp xin chào / Quân / Lan)"
      : gate.reason,
  };
}

export function asciiLcd(s: string): string {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
