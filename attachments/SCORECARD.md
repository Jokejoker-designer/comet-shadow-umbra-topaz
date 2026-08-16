# 8-agent scorecard

Board default = `LIF + STDP + route-gate + latch + eval supervisor`.  
**No semantic ROM / conversation claim on board.**

## M8-HW-01 — closed 2026-08-14

`8_AGENT_CYCLIC_LEARNING_CONVERGENCE_DEMONSTRATED` **PASS**

| Item | Status |
|------|--------|
| Basys 3 / 8 agents / online STDP / route-gate | PASS |
| EVAL_BEFORE → TRAIN → WEIGHT EFFECT → FREEZE → EVAL_AFTER | PASS |
| Frozen cyclic accuracy | **650 / 650** |
| `W[1][0]` HOLD | 1088 = `0440` (not `07FF`) |
| 64-synapse associative remapping (2 host sessions) | **BOARD PASS run_003** |
| Session A → reset → Session B same bitstream | **BOARD PASS** |
| Reset → forget → retrain new mapping | **BOARD PASS** |
| Simple conversation | **NOT YET** |

Closeout: `results/M8-HW-01_CLOSEOUT.md`  
## M8-HW-02 — BOARD PASS 2026-08-14

XSim and COM8 agree: `A_before=0/32 A_after=32/32 A_forget=0/32 B_after=32/32`.  
A targets 320 on P_A, reset 0/64, B targets 320 on P_B.  
Bit: `basys3_eight_agent_m8hw02.bit` SHA-256 `74F98993…`.  
Evidence: `results/M8-HW-02/run_003/BOARD_REPORT.md`  
**Not conversation.** Scope = seeds `2026081401` and `2026081403` only.

## M8-HW-03 — BOARD PASS 2026-08-14

`changed_cell_count` event **64**, host Δ **64/64**, SHA `C2A3751D…` matches Python, freeze == after, Dense-B 64.  
Bit: `basys3_eight_agent_m8hw03.bit` SHA-256 `34D63D5D…` (M8-HW-02 `74F98993…` untouched).  
Evidence: `results/M8-HW-03/run_002/`  
**Not conversation.** Next was M8-HW-03R (same bit).

## M8-HW-03R — BOARD PASS 2026-08-14

32/32 then 128/128 random mixed-polarity sessions, `changed=64`, SHA match, freeze exact.  
No rebuild. Evidence: `results/M8-HW-03R/`.

## M8-HW-04 — BOARD PASS 2026-08-14

A,B,C → X; ACB/BAC/AB/forget ≠ X. ctx 201/108/228/245 match XSim.  
Bit: `basys3_eight_agent_m8hw04.bit` `DEEFE548…`. Not conversation.

## M8-HW-05 — BOARD PASS 2026-08-14

Host encoder: `xin chào` + `hello` → basin `0x88`; distractor `0x77`; RESET 0; remap `0xCC`.  
Same `m8hw04.bit` `DEEFE548…`, no rebuild. Evidence: `results/M8-HW-05/run_001/`.  
**Not conversation.** Next = M8-HW-06 after-train (Teacher/Learn OFF, Freeze ON).

## Build / program (support, not a conversation proof)

| Item | Status |
|------|--------|
| Vivado 2026.1 WNS | +103.692 ns |
| DRC | 3 DSP pipeline warnings |
| Program | Digilent 210183BF7B31A, startup HIGH |
| UART | COM8 115200; RESULT `A5 5C` not captured (HOLD live frames scored) |
