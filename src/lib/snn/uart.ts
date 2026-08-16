/** 15-byte frames matching python/uart_frames.py on m8hw06b. */

export const FRAME_LEN = 15;
export const SOF = 0xa5;
export const KIND_LIVE = 0x5a;
export const KIND_RESULT = 0x5c;
export const KIND_DUMP = 0x5d;
export const KIND_SESSION = 0x5e;
export const KIND_CMD = 0x5f;
export const KIND_DENSE_SAMPLE = 0x60;
export const KIND_DENSE_EVENT = 0x61;
export const KIND_TEMP_SAMPLE = 0x62;
export const KIND_TEMP_PROBE = 0x63;
export const KIND_TEMP_EVENT = 0x64;

export const CMD_DUMP = 0x03;
export const CMD_T_RESET = 0x06;
export const CMD_T_TRAIN = 0x07;
export const CMD_T_CLEAR = 0x08;

export const UART_KINDS = new Set([
  KIND_LIVE,
  KIND_RESULT,
  KIND_DUMP,
  KIND_SESSION,
  KIND_CMD,
  KIND_DENSE_SAMPLE,
  KIND_DENSE_EVENT,
  KIND_TEMP_SAMPLE,
  KIND_TEMP_PROBE,
  KIND_TEMP_EVENT,
]);

export function xor14(bytes: ArrayLike<number>): number {
  let x = 0;
  for (let i = 0; i < 14; i++) x ^= bytes[i] & 0xff;
  return x & 0xff;
}

export function pack15(kind: number, body12: number[]): Uint8Array {
  if (body12.length !== 12) throw new Error("body must be 12 bytes");
  const out = new Uint8Array(15);
  out[0] = SOF;
  out[1] = kind & 0xff;
  for (let i = 0; i < 12; i++) out[2 + i] = body12[i] & 0xff;
  out[14] = xor14(out);
  return out;
}

export function commandFrame(cmd: number): Uint8Array {
  const body = new Array(12).fill(0);
  body[0] = cmd & 0xff;
  return pack15(KIND_CMD, body);
}

export function temporalProbeFrame(tokens: [number, number, number], hold: boolean): Uint8Array {
  const body = new Array(12).fill(0);
  body[0] = 3;
  body[1] = tokens[0] & 0xff;
  body[2] = tokens[1] & 0xff;
  body[3] = tokens[2] & 0xff;
  body[4] = hold ? 1 : 0;
  return pack15(KIND_TEMP_PROBE, body);
}

export function parseTempEvent(bytes: Uint8Array): { ctx: number; out: number; target: number; match: boolean } | null {
  if (bytes.length < 15 || bytes[0] !== SOF || bytes[1] !== KIND_TEMP_EVENT) return null;
  if (xor14(bytes) !== bytes[14]) return null;
  return { ctx: bytes[2], out: bytes[3], target: bytes[4], match: Boolean(bytes[5] & 1) };
}
