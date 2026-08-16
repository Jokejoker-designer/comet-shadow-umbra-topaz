# M8-HW-04 — closeout

**Date:** 2026-08-14  
**Bitstream:** `build/out/basys3_eight_agent_m8hw04.bit`  
**SHA-256:** `DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A`  
**m8hw03 untouched:** `34D63D5D…C246EC45`  
**WNS:** +95.532 ns  
**Evidence:** `results/M8-HW-04/run_001/`

Host symbols (not in RTL): A=`0xB4` B=`0x6B` C=`0x4B` X=`0xA5`.

| Probe | ctx | out | Expect |
|-------|-----|-----|--------|
| A,B,C | 201 | **0xA5 = X** | X |
| A,C,B | 108 | 0 | not X |
| B,A,C | 228 | 0 | not X |
| A,B | 245 | 0 | not X |
| ABC after RESET | 201 | 0 | not X |

```text
TEMPORAL_SEQUENCE_MEMORY_BOARD_VALIDATED
```

Context binder is fixed (`rotl3(ctx) ^ stim ^ rotl2(stim)`).  
Readout 8×8 is learned Hebbian on the last TRAIN step only.  
Not conversation. Not phrase generalization (M8-HW-05).
