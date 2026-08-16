import { useLab } from "@/lib/snn/store";
import { cn } from "@/lib/utils";

export function UartLog({ compact = false }: { compact?: boolean }) {
  const log = useLab((s) => s.log);
  return (
    <div
      className={cn(
        "overflow-auto rounded-md border border-line bg-canvas px-2 py-2 font-mono text-[10px] leading-5 text-mute",
        compact ? "max-h-28" : "h-36",
      )}
    >
      {log.map((line, i) => (
        <div key={`${i}-${line.slice(0, 18)}`} className={i === 0 ? "text-ink" : undefined}>
          {line}
        </div>
      ))}
    </div>
  );
}
