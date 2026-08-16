import { cn } from "@/lib/utils";

const CHAIN: { id: string; label: string; status: "pass" | "next" }[] = [
  { id: "hw01", label: "M8-HW-01 cyclic 650/650", status: "pass" },
  { id: "samebit", label: "SAME BITSTREAM A then B", status: "pass" },
  { id: "abefore", label: "EVAL BEFORE A 0/32", status: "pass" },
  { id: "aafter", label: "HOLD A 32/32 · targets 320×8", status: "pass" },
  { id: "reset", label: "RESET neutral 0/64", status: "pass" },
  { id: "forget", label: "A FORGOTTEN 0/32", status: "pass" },
  { id: "bafter", label: "HOLD B 32/32 · seed 2026081403", status: "pass" },
  { id: "remap", label: "GENUINE ASSOCIATIVE REMAPPING", status: "pass" },
  { id: "dense", label: "M8-HW-03 64 cells one txn", status: "pass" },
  { id: "ens", label: "M8-HW-03R 128/128", status: "pass" },
  { id: "temp", label: "M8-HW-04 ABC→X · negatives 0", status: "pass" },
  { id: "phrase", label: "M8-HW-05 phrase basin 0x88", status: "pass" },
  { id: "06a", label: "M8-HW-06A teacher-free AFTER", status: "pass" },
  { id: "06b", label: "M8-HW-06B Quân/Lan hold_ctx", status: "pass" },
  { id: "lm00", label: "M8-LM-00 LEGACY freeze SHA", status: "pass" },
  { id: "lm01", label: "M8-LM-01 token AR 100/100", status: "pass" },
  { id: "lm02", label: "M8-LM-02 tiny LM 1000/1000", status: "pass" },
  { id: "lm03", label: "M8-LM-03 causal GPT forward", status: "pass" },
  { id: "lm04", label: "M8-LM-04 head/embed SGD 128/128", status: "pass" },
  { id: "lm05", label: "M8-LM-05 full backprop dumpz 40.6%", status: "pass" },
  { id: "llm", label: "Open-domain LLM", status: "next" },
];

export function AntiHardcode() {
  return (
    <div className="space-y-4 p-1">
      <div>
        <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Anti-hardcode proof</div>
        <p className="mt-1 text-xs text-mute">
          Board 2026-08-16. LEGACY 01→06B + LM-00→05 closed on silicon. Open-domain LLM stays unclaimed.
        </p>
      </div>
      <ol className="space-y-1">
        {CHAIN.map((n) => (
          <li key={n.id} className="flex items-center justify-between border-b border-line py-2 font-mono text-xs">
            <span>{n.label}</span>
            <span className={cn(n.status === "pass" ? "text-pass" : "text-faint")}>
              {n.status === "pass" ? "✓ PASS" : "○ NEXT"}
            </span>
          </li>
        ))}
      </ol>
      <p className="text-xs text-mute">
        Permutations / names / phrases không nằm trong rtl/. Teacher chỉ lúc TRAIN. AFTER writes = 0. Not an LLM.
      </p>
    </div>
  );
}
