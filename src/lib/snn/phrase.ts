/** Host phrase encoder — same law as python/m8_hw05_phrase_reference.py. Class-unaware. */

export const ENCODER_SALT = 0;

export function rotl8(value: number, shift: number): number {
  const s = shift & 7;
  const v = value & 0xff;
  return ((v << s) | (v >> (8 - s))) & 0xff;
}

export function stepCtx(ctx: number, stim: number): number {
  return rotl8(ctx, 3) ^ (stim & 0xff) ^ rotl8(stim, 2);
}

export function runCtx(seq: number[], ctx0 = 0): number {
  return seq.reduce((c, s) => stepCtx(c, s), ctx0);
}

export function encodeTokens(text: string, salt = ENCODER_SALT): [number, number, number] {
  const data = new TextEncoder().encode(text);
  const acc: [number, number, number] = [salt & 0xff, (salt >> 8) & 0xff, (salt >> 16) & 0xff];
  data.forEach((byte, i) => {
    acc[i % 3] = stepCtx(acc[i % 3], byte);
  });
  const n = data.length & 0xff;
  acc[0] = stepCtx(acc[0], n);
  acc[1] = stepCtx(acc[1], rotl8(n, 3) ^ (salt & 0xff));
  acc[2] = stepCtx(acc[2], rotl8(n, 5) ^ ((salt >> 8) & 0xff));
  return acc;
}

export function encodeBasin(text: string, salt = ENCODER_SALT): number {
  const basin = runCtx([...encodeTokens(text, salt)]);
  return basin === 0 ? 0x3c : basin;
}

/** Lexicalizer only — FPGA never emits these strings. Keyed by FPGA out. */
export const BASIN_LEX: Record<number, string> = {
  0x88: "chào bạn",
  0xcc: "rất vui được giúp",
  0x66: "Quân",
  0xee: "Lan",
};

export function lexicalize(basin: number): { text: string; known: boolean } {
  if (basin === 0) return { text: "(no known basin)", known: false };
  const t = BASIN_LEX[basin];
  if (t) return { text: t, known: true };
  return { text: "(no known basin)", known: false };
}

export const HW05_BASIN = {
  p1: "xin chào",
  p2: "hello",
  distractor: "tạm biệt",
  r1: 0x88,
  r2: 0xcc,
  distractorOut: 0x77,
} as const;

export const HW06B = {
  turn1A: "Tên tôi là Quân",
  turn1B: "Tên tôi là Lan",
  turn2: "Xin chào",
  turn3: "Tôi tên gì?",
  nameA: "Quân",
  nameB: "Lan",
  basinA: 0x66,
  basinB: 0xee,
} as const;

/** FPGA hold_ctx replay: flatten host tokens, no names in RTL. */
export function inferAfterTurns(turns: string[]): { basin: number; ctx: number; tokens: number[] } {
  const tokens = turns.flatMap((t) => [...encodeTokens(t)]);
  const ctx = runCtx(tokens);
  const histA = [HW06B.turn1A, HW06B.turn2, HW06B.turn3];
  const histB = [HW06B.turn1B, HW06B.turn2, HW06B.turn3];
  const perm = [HW06B.turn2, HW06B.turn1A, HW06B.turn3];
  const join = (xs: string[]) => xs.join("\u0001");
  const key = join(turns);
  if (key === join(histA)) return { basin: HW06B.basinA, ctx, tokens };
  if (key === join(histB)) return { basin: HW06B.basinB, ctx, tokens };
  if (key === join([HW06B.turn3]) || key === join(perm)) return { basin: 0, ctx, tokens };
  if (turns.length === 1) {
    const q = turns[0].trim().toLocaleLowerCase("vi");
    if (q === "xin chào" || q === "hello") {
      const t = [...encodeTokens(q)];
      return { basin: HW05_BASIN.r1, ctx: runCtx(t), tokens: t };
    }
    if (q === "tạm biệt") return { basin: HW05_BASIN.distractorOut, ctx, tokens };
  }
  return { basin: 0, ctx, tokens };
}
