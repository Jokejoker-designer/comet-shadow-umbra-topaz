import { BTN_META, LED_LABEL, SW_HINT, SW_LABEL, selectedPair, type BtnId } from "@/lib/snn/board";
import { manualTick } from "@/lib/snn/simulator";
import { useLab } from "@/lib/snn/store";
import { cn } from "@/lib/utils";
import { SevenSeg } from "./seven-seg";

function Switch({
  on,
  label,
  hint,
  role,
  locked,
  large,
  onToggle,
}: {
  on: boolean;
  label: string;
  hint: string;
  role: string;
  locked?: boolean;
  large?: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      title={hint}
      onClick={onToggle}
      disabled={locked}
      className={cn("flex min-w-0 flex-col items-center gap-1 disabled:cursor-not-allowed", large ? "w-full" : "w-10")}
    >
      <span className={cn("relative rounded-sm border border-line-strong bg-canvas", large ? "h-11 w-5" : "h-8 w-3.5")}>
        <span
          className={cn(
            "absolute left-0.5 right-0.5 rounded-sm transition-transform duration-150",
            large ? "h-4" : "h-3",
            on ? "top-0.5 bg-steel" : "bottom-0.5 bg-faint",
          )}
        />
      </span>
      <span className={cn("font-mono leading-none", large ? "text-[11px]" : "text-[10px]", on ? "text-ink" : "text-faint")}>{label}</span>
      <span className={cn("font-mono leading-none text-faint", large ? "text-[10px]" : "text-[9px]")}>{role}</span>
    </button>
  );
}

function Btn({ id, flash, onPress }: { id: BtnId; flash: boolean; onPress: () => void }) {
  const meta = BTN_META[id];
  return (
    <button
      type="button"
      title={`${meta.name}: ${meta.does}`}
      onClick={onPress}
      className={cn(
        "grid size-9 place-items-center rounded-full border text-[10px] font-medium",
        flash ? "border-steel bg-steel text-steel-fg" : "border-line-strong bg-elevated text-mute",
      )}
    >
      {id}
    </button>
  );
}

export function Basys3Panel({ large = false }: { large?: boolean }) {
  const sw = useLab((s) => s.sw);
  const led = useLab((s) => s.led);
  const frame = useLab((s) => s.frame);
  const source = useLab((s) => s.source);
  const toggleSw = useLab((s) => s.toggleSw);
  const pressBtn = useLab((s) => s.pressBtn);
  const btnFlash = useLab((s) => s.btnFlash);
  const rxBytes = useLab((s) => s.rxBytes);
  const { src, dst } = selectedPair(sw);
  const live = source === "board";

  function onBtn(id: BtnId) {
    pressBtn(id);
    if (id === "C" && source === "sim") manualTick();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[10px] font-medium uppercase tracking-[0.16em] text-faint">Basys 3 · XC7A35T · SW15…0</div>
          <div className="mt-0.5 text-xs text-mute">
            {live
              ? "Hai hàng: SW15–8 rồi SW7–0. LED8 BUSY ≠ SW8."
              : "Paddle = SW. Chấm trên = LED. SW8 = SRC2, không phải LEARN."}
          </div>
        </div>
        <SevenSeg value={frame.weight} />
      </div>

      <div className="space-y-3 rounded-md border border-line bg-canvas p-2">
        {[
          { from: 15, to: 8 },
          { from: 7, to: 0 },
        ].map((row) => (
          <div key={row.from} className="grid grid-cols-8 justify-items-center gap-1">
            {Array.from({ length: 8 }, (_, k) => row.from - k).map((i) => (
              <div key={i} className="flex min-w-0 flex-col items-center gap-1">
                <span
                  title={`LED${i} ${LED_LABEL[i]}`}
                  className={cn("rounded-full", large ? "h-2.5 w-2.5" : "h-2 w-2", led[i] ? "bg-pass shadow-[0_0_8px_var(--color-pass)]" : "bg-line")}
                />
                <span className="font-mono text-[9px] text-faint">{LED_LABEL[i]}</span>
                <Switch
                  on={sw[i]}
                  label={`SW${i}`}
                  role={SW_LABEL[i]}
                  hint={SW_HINT[i]}
                  large={large}
                  locked={live && rxBytes > 0 && i === 11}
                  onToggle={() => toggleSw(i)}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-1">
          <span />
          <Btn id="U" flash={btnFlash === "U"} onPress={() => onBtn("U")} />
          <span />
          <Btn id="L" flash={btnFlash === "L"} onPress={() => onBtn("L")} />
          <Btn id="C" flash={btnFlash === "C"} onPress={() => onBtn("C")} />
          <Btn id="R" flash={btnFlash === "R"} onPress={() => onBtn("R")} />
          <span />
          <Btn id="D" flash={btnFlash === "D"} onPress={() => onBtn("D")} />
          <span />
        </div>
        <div className="min-w-0 flex-1 font-mono text-[11px] tabular-nums text-mute">
          <div>
            inspect W[{dst}][{src}] = {frame.weight}{" "}
            <span className="text-faint">hex {(frame.weight & 0xffff).toString(16).toUpperCase().padStart(4, "0")}</span>
          </div>
          <div>
            SW11 AUTO {sw[11] ? "ON" : "off"} · SW9 FRZ {sw[9] ? "ON" : "off"} · SW8 SRC2 {sw[8] ? "ON" : "off"}
          </div>
          <div>
            LED13 LEARN {frame.learn ? "ON" : "off"} · LED12 FRZ {frame.freeze ? "ON" : "off"} · LED8 BUSY
          </div>
        </div>
      </div>
    </div>
  );
}
