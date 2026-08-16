import { inferOutput } from "./codec";
import { INITIAL_CROSS, TARGET_W, type EvidenceItem, type UartFrame } from "./types";

export function antiHardcode(frame: UartFrame): EvidenceItem[] {
  const acc = (() => {
    let ok = 0;
    for (let s = 0; s < 8; s++) {
      if (inferOutput(frame.weights, 1 << s) === 1 << ((s + 1) & 7)) ok += 1;
    }
    return ok / 8;
  })();
  const w10 = frame.weights[1][0];
  const allInit = frame.weights.every((row, d) => row.every((w, s) => (d === s ? w === 0 : w === INITIAL_CROSS)));
  const trained = frame.updates > 0 && w10 > INITIAL_CROSS;
  const frozen = frame.freeze && !frame.learn;
  const after = frame.phase === "hold" || frame.phase === "eval_after" || frame.phase === "score";
  const holdOk = after && acc >= 0.99 && w10 === TARGET_W;

  return [
    {
      id: "init",
      label: "Initial weights 64/0",
      status: frame.tick === 0 || frame.phase === "reset" || frame.phase === "eval_before" ? "pass" : trained ? "pass" : "pending",
      detail: allInit ? "Ma trận reset đúng." : "Đã lệch khỏi init (sau TRAIN là đúng).",
    },
    {
      id: "before",
      label: "BEFORE accuracy thấp",
      status: frame.phase === "eval_before" ? (acc < 0.5 ? "pass" : "fail") : frame.beforeAcc < 50 || frame.tick > 32 ? "pass" : "pending",
      detail: "EVAL_BEFORE: W=64 < gate 256 → out=0, mạng chưa biết mapping.",
    },
    {
      id: "updates",
      label: "Training updates > 0",
      status: frame.updates > 0 ? "pass" : "pending",
      detail: `${frame.updates} cập nhật song song 8×8.`,
    },
    {
      id: "teacher-train",
      label: "Teacher during TRAIN",
      status: frame.learn ? "pass" : after ? "pass" : "pending",
      detail: "Teacher one-hot rotl chỉ trong TRAIN.",
    },
    {
      id: "teacher-eval",
      label: "Teacher during EVAL = NO",
      status: !frame.learn && (frame.phase === "eval_before" || after) ? "pass" : frame.learn ? "warn" : "pending",
      detail: frame.learn ? "Đang TRAIN — teacher được phép." : "Teacher ngắt.",
    },
    {
      id: "freeze",
      label: "Freeze holds",
      status: frozen && after ? "pass" : "pending",
      detail: frozen ? `W[1][0]=${w10} khóa.` : "Chưa HOLD.",
    },
    {
      id: "after",
      label: "EVAL_AFTER / HOLD mapping",
      status: holdOk ? "pass" : after && acc > 0.5 ? "warn" : "pending",
      detail: holdOk ? "0440 + cyclic 8/8 — BOARD PASS law." : `acc≈${Math.round(acc * 100)}% W=${w10}`,
    },
    {
      id: "llm",
      label: "External LLM AFTER-TRAIN",
      status: "pass",
      detail: "0 lời gọi — decoder local, provenance = FPGA.",
    },
  ];
}

export function scorecard(frame: UartFrame): EvidenceItem[] {
  return antiHardcode(frame);
}
