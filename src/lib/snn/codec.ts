/** Host encoder/decoder only. Does not decide the FPGA response. */

export type Phrase = {
  prompts: string[];
  code: number;
  reply: string;
  replyCode: number;
};

export const CURRICULUM: Phrase[] = [
  { prompts: ["xin chào", "hello", "hi", "chào", "chào bạn"], code: 0x01, reply: "chào bạn", replyCode: 0x02 },
  { prompts: ["chào buổi sáng", "good morning"], code: 0x02, reply: "chào bạn", replyCode: 0x04 },
  { prompts: ["cảm ơn", "thanks", "thank you"], code: 0x04, reply: "rất vui được giúp", replyCode: 0x08 },
  { prompts: ["tạm biệt", "bye", "goodbye"], code: 0x08, reply: "tạm biệt, hẹn gặp lại", replyCode: 0x10 },
  { prompts: ["bạn khỏe không", "how are you"], code: 0x10, reply: "tôi đang ở chế độ inference", replyCode: 0x20 },
  { prompts: ["bạn tên gì", "who are you"], code: 0x20, reply: "tôi là 8-agent FPGA đã học", replyCode: 0x40 },
  { prompts: ["ok", "được", "yes"], code: 0x40, reply: "đã nhận", replyCode: 0x80 },
  { prompts: ["không", "no"], code: 0x80, reply: "đã hiểu", replyCode: 0x01 },
];

export function encodeText(text: string): { code: number; phrase: Phrase | null } {
  const q = text.trim().toLowerCase();
  for (const p of CURRICULUM) {
    if (p.prompts.some((s) => q === s || q.includes(s))) return { code: p.code, phrase: p };
  }
  return { code: 0, phrase: null };
}

export function decodeCode(code: number): string {
  const p = CURRICULUM.find((x) => x.replyCode === code || x.code === code);
  if (p && p.replyCode === code) return p.reply;
  if (code === 0) return "(im lặng — không có basin)";
  return `pattern 0x${code.toString(16).padStart(2, "0")}`;
}

/** FPGA route-gate inference from frozen W: dest spikes if W[d][s] > 256 and source[s]. */
export function inferOutput(weights: number[][], stimulus: number, gate = 256): number {
  let out = 0;
  for (let s = 0; s < 8; s++) {
    if (((stimulus >> s) & 1) === 0) continue;
    for (let d = 0; d < 8; d++) {
      if (weights[d][s] > gate) out |= 1 << d;
    }
  }
  return out;
}

export function rotl8(v: number): number {
  return ((v << 1) | (v >> 7)) & 0xff;
}
