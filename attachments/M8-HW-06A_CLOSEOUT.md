# M8-HW-06A — closeout

**Date:** 2026-08-16  
**Same bitstream as M8-HW-04/05:** `basys3_eight_agent_m8hw04.bit`  
**SHA-256:** `DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A`  
**No new bit file.** Frozen 01–04 untouched.  
**Evidence:** `results/M8-HW-06A/run_002/`

TRAIN used an external teacher. AFTER disconnected it.

| Input | FPGA out | Local decode |
|-------|----------|--------------|
| `xin chào` | **0x88** | **chào bạn** |
| `hello` | **0x88** | **chào bạn** |
| `tạm biệt` | 0x77 | *(empty)* |

Weight SHA before/after AFTER infer: `5452F2B6…` = `5452F2B6…`  
EXTERNAL LLM = 0. LEARN OFF. FREEZE ON. Weight writes = 0.

```text
TEACHER_FREE_AFTER_TRAIN_SIMPLE_INTERACTION_BOARD_VALIDATED
```

**Not conversation.** Multi-turn name memory is M8-HW-06B and is still open.
