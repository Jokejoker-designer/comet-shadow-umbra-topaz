/** Board-captured matrices from kit THROUGH-M8-HW-06B zip (updated in place with LM-00…05). */

export const KIT_ID = "basys3-eight-agent-full-parallel-learning-v0.1-THROUGH-M8-HW-06B-20260816";

export const BITS = {
  cyclic: { file: "basys3_eight_agent.bit", sha: "E27B0277D4B03EF30D5CE9D49C370C731DA8FBC0A0336F35C7AC3EA5BC318BA4" },
  hw02: { file: "basys3_eight_agent_m8hw02.bit", sha: "74F989937CAB99B02E43313E33243DA5B0BC562646548797F150F5FA3CB9F05B" },
  hw03: { file: "basys3_eight_agent_m8hw03.bit", sha: "34D63D5D60968DA637879FA6F8DCA9CC93B8636FF24080E151151D4BC246EC45" },
  hw04: { file: "basys3_eight_agent_m8hw04.bit", sha: "DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A" },
  hw06b: { file: "basys3_eight_agent_m8hw06b.bit", sha: "7CE3238E93128D2C1F5420723752B01A3683B9DBF5A114502DB677A725E4B4F6" },
  lm01: { file: "basys3_eight_agent_m8lm01.bit", sha: "5D80331DB940C2A04E4FE3EEF9FA738F7951F75CD5061A7C35868216ED41238E" },
  lm02: { file: "basys3_lm02.bit", sha: "C3C1467139F28C2EE36FBA8B065703DFC5000658DA724B705262E37072A19B1E" },
  lm03: { file: "basys3_lm03.bit", sha: "8D2AF247110D5631BB93D12312D316D0252DBC68C43466B105A7FD39208F83B0" },
  lm04: { file: "basys3_lm04.bit", sha: "B7135153E50C992DA623FC5114CE04C96AEE4872A9EACC46DD0D1BF8BE5826CA" },
  lm05: { file: "basys3_lm05.bit", sha: "8657DA03346C05B72A243FFF0FDE540437FCB18FB52E55EB822FB6E56E025483" },
} as const;

export const BOARD = {
  part: "xc7a35tcpg236-1",
  device: "Digilent 210183BD3646A",
  uart: "COM10 115200 (LM) · COM8 (HW-06B)",
  vivado: "2026.1",
};

/** Session A HOLD — W[dst][src], targets 320 on P_A. */
export const MATRIX_A: number[][] = [
  [0, 64, 64, 64, 64, 64, 320, 64],
  [320, 0, 64, 64, 64, 64, 64, 64],
  [64, 64, 0, 64, 64, 320, 64, 64],
  [64, 64, 64, 0, 320, 64, 64, 64],
  [64, 64, 320, 64, 0, 64, 64, 64],
  [64, 64, 64, 320, 64, 0, 64, 64],
  [64, 64, 64, 64, 64, 64, 0, 320],
  [64, 320, 64, 64, 64, 64, 64, 0],
];

export const MATRIX_RESET: number[][] = [
  [0, 64, 64, 64, 64, 64, 64, 64],
  [64, 0, 64, 64, 64, 64, 64, 64],
  [64, 64, 0, 64, 64, 64, 64, 64],
  [64, 64, 64, 0, 64, 64, 64, 64],
  [64, 64, 64, 64, 0, 64, 64, 64],
  [64, 64, 64, 64, 64, 0, 64, 64],
  [64, 64, 64, 64, 64, 64, 0, 64],
  [64, 64, 64, 64, 64, 64, 64, 0],
];

export const MATRIX_B: number[][] = [
  [0, 64, 320, 64, 64, 64, 64, 64],
  [64, 0, 64, 320, 64, 64, 64, 64],
  [64, 64, 0, 64, 64, 64, 320, 64],
  [64, 64, 64, 0, 64, 320, 64, 64],
  [64, 64, 64, 64, 0, 64, 64, 320],
  [320, 64, 64, 64, 64, 0, 64, 64],
  [64, 320, 64, 64, 64, 64, 0, 64],
  [64, 64, 64, 64, 320, 64, 64, 0],
];

export function clone8(m: number[][]): number[][] {
  return m.map((r) => r.slice());
}
