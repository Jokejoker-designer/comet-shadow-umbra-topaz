import { blankFrame } from "./parse-uart";
import { emptyCounts, emptyWeights, type UartFrame } from "./types";

export function resetFrame(): UartFrame {
  return blankFrame();
}

export function liveSnapshot(): UartFrame {
  const weights = emptyWeights();
  const updateCounts = emptyCounts();
  for (let s = 0; s < 8; s++) {
    const d = (s + 1) & 7;
    updateCounts[d][s] = 128;
    weights[d][s] = 1088;
  }
  return {
    ...blankFrame(),
    tick: 1200,
    updates: 1024,
    weight: 1088,
    weights,
    updateCounts,
    input: 1,
    output: 2,
    auto: true,
    freeze: true,
    learn: false,
    phase: "hold",
    afterAcc: 100,
    line: "HOLD W=1088=0440 updates=1024",
  };
}

export { emptyCounts, emptyWeights };
