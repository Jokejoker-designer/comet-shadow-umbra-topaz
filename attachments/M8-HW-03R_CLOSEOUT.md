# M8-HW-03R — closeout

**Date:** 2026-08-14  
**Same bitstream as M8-HW-03:** `basys3_eight_agent_m8hw03.bit`  
**SHA-256:** `34D63D5D60968DA637879FA6F8DCA9CC93B8636FF24080E151151D4BC246EC45`  
**No rebuild between seeds.**  
**Switches:** SW11 ON, SW12 ON, SW10 OFF, SW13 OFF.

## Results

| Ensemble | Seeds | Result |
|----------|-------|--------|
| 32/32 | `2026081432`…`2026081463` | **PASS** `results/M8-HW-03R/run_032/score.json` |
| 128/128 | `2026081500`…`2026081627` | **PASS** `results/M8-HW-03R/run_128/score.json` |

Every session: mixed-polarity stim/teacher, RESET → one TRAIN → `changed_cell_count==64` → FPGA SHA == Python → FREEZE == AFTER.

```text
M8_HW_03R_32_OF_32_PASS
M8_HW_03R_128_OF_128_PASS
```

Still **not** conversation. Next is **M8-HW-04** temporal / context memory (new law + new bitstream name).
The present dense outer product is commutative, so it cannot distinguish A,B,C from C,B,A. That is why 04 needs recurrent/state, not more 03R sessions.
