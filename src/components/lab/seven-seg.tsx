const GLYPH: Record<string, string> = {
  "0": "1111110",
  "1": "0110000",
  "2": "1101101",
  "3": "1111001",
  "4": "0110011",
  "5": "1011011",
  "6": "1011111",
  "7": "1110000",
  "8": "1111111",
  "9": "1111011",
  A: "1110111",
  B: "0011111",
  C: "1001110",
  D: "0111101",
  E: "1001111",
  F: "1000111",
  "-": "0000001",
  " ": "0000000",
};

function Digit({ ch }: { ch: string }) {
  const bits = GLYPH[ch] ?? GLYPH[" "];
  const on = (i: number) => (bits[i] === "1" ? "bg-ink" : "bg-line");
  return (
    <div className="relative h-9 w-5">
      <span className={`absolute left-1 right-1 top-0 h-0.5 ${on(0)}`} />
      <span className={`absolute right-0 top-0.5 h-3.5 w-0.5 ${on(1)}`} />
      <span className={`absolute right-0 bottom-0.5 h-3.5 w-0.5 ${on(2)}`} />
      <span className={`absolute left-1 right-1 bottom-0 h-0.5 ${on(3)}`} />
      <span className={`absolute left-0 bottom-0.5 h-3.5 w-0.5 ${on(4)}`} />
      <span className={`absolute left-0 top-0.5 h-3.5 w-0.5 ${on(5)}`} />
      <span className={`absolute left-1 right-1 top-1/2 h-0.5 -translate-y-1/2 ${on(6)}`} />
    </div>
  );
}

/** Matches Basys3 sevenseg_hex4: 4 hex digits of selected_weight. */
export function SevenSeg({ value }: { value: number }) {
  const text = (value & 0xffff).toString(16).toUpperCase().padStart(4, "0");
  return (
    <div className="flex items-center gap-1.5 rounded-sm border border-line bg-canvas px-2 py-1.5" aria-label={`7-seg ${text}`}>
      {text.split("").map((ch, i) => (
        <Digit key={i} ch={ch} />
      ))}
    </div>
  );
}
