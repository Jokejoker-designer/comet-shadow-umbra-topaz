import { CLAIMS, MILESTONE, MILESTONE_TITLE } from "@/lib/snn/research";
import { cn } from "@/lib/utils";

export function ClaimBanner() {
  const pass = CLAIMS.filter((c) => c.state === "PASS").length;
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2 overflow-hidden border-b border-line bg-panel px-3 py-2 md:px-4">
      <div className="min-w-0">
        <div className="font-mono text-[11px] text-mute">{MILESTONE}</div>
        <div className="text-sm font-medium tracking-tight">{MILESTONE_TITLE}</div>
        <div className="mt-1 h-1.5 w-44 overflow-hidden rounded-xs bg-elevated">
          <div className="h-full bg-pass" style={{ width: `${(pass / CLAIMS.length) * 100}%` }} />
        </div>
        <div className="mt-0.5 font-mono text-[10px] text-pass">BOARD PASS · {pass}/{CLAIMS.length} claims</div>
      </div>
      <div className="grid flex-1 grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
        {CLAIMS.map((c) => (
          <div key={c.id} className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
            <span className="text-mute">{c.label}</span>
            <span className={cn(c.state === "PASS" ? "text-pass" : "text-faint")}>{c.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
