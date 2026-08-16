import { useLab } from "@/lib/snn/store";

export function UartLog() {
  const log = useLab((s) => s.log);
  return (
    <div className="h-36 overflow-auto rounded-md border border-line bg-canvas px-2 py-2 font-mono text-[10px] leading-5 text-mute">
      {log.map((line, i) => (
        <div key={`${i}-${line.slice(0, 18)}`} className={i === 0 ? "text-ink" : undefined}>
          {line}
        </div>
      ))}
    </div>
  );
}
