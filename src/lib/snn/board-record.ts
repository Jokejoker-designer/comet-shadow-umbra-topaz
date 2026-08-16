/** Board-captured matrices from kit THROUGH-M8-HW-05, run_003 / run_001. */

export const KIT_ID = "basys3-eight-agent-full-parallel-learning-v0.1-THROUGH-M8-HW-06B-20260816";

export const BITS = {
  cyclic: { file: "basys3_eight_agent.bit", sha: "E27B0277D4B03EF30D5CE9D49C370C731DA8FBC0A0336F35C7AC3EA5BC318BA4" },
  hw02: { file: "basys3_eight_agent_m8hw02.bit", sha: "74F989937CAB99B02E43313E33243DA5B0BC562646548797F150F5FA3CB9F05B" },
  hw03: { file: "basys3_eight_agent_m8hw03.bit", sha: "34D63D5D60968DA637879FA6F8DCA9CC93B8636FF24080E151151D4BC246EC45" },
  hw04: { file: "basys3_eight_agent_m8hw04.bit", sha: "DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A" },
  hw06b: { file: "basys3_eight_agent_m8hw06b.bit", sha: "7CE3238E93128D2C1F5420723752B01A3683B9DBF5A114502DB677A725E4B4F6" },
} as const;

export const BOARD = {
  part: "xc7a35tcpg236-1",
  device: "Digilent 210183BF7B31A",
  uart: "COM8 115200",
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
