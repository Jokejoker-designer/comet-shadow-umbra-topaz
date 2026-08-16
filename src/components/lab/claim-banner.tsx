import { CLAIMS, MILESTONE } from "@/lib/snn/research";
import { cn } from "@/lib/utils";

export function ClaimBanner() {
  return (
    <div className="flex min-w-0 items-center gap-3 overflow-x-auto border-b border-line px-3 py-1 md:px-4">
      <span className="shrink-0 font-mono text-[10px] text-pass">{MILESTONE} PASS</span>
      <div className="flex min-w-0 flex-1 items-center gap-x-3">
        {CLAIMS.map((c) => (
          <div key={c.id} className="flex shrink-0 items-baseline gap-1.5 font-mono text-[10px]">
            <span className="text-faint">{c.label}</span>
            <span className={cn(c.state === "PASS" ? "text-pass" : "text-faint")}>{c.state === "PASS" ? "PASS" : c.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
