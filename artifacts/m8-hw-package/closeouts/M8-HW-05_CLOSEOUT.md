# M8-HW-05 — closeout

**Date:** 2026-08-14  
**Same bitstream as M8-HW-04:** `basys3_eight_agent_m8hw04.bit`  
**SHA-256:** `DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A`  
**No rebuild.** Frozen 01/02/03 bits untouched.  
**Evidence:** `results/M8-HW-05/run_001/`

Encoder is host-only (UTF-8 stripe + same `rotl3^stim^rotl2` mixer, salt 0).  
Teacher basin is also host-encoded. RTL has no HELLO id and none of the demo strings.

| Probe | out | Expect |
|-------|-----|--------|
| `xin chào` after joint TRAIN | **0x88 = R1** | basin(`chào bạn`) |
| `hello` after joint TRAIN | **0x88 = R1** | same basin |
| `hello` after TRAIN P1 only | **0** | no class in the code |
| `tạm biệt` | **0x77** | not R1 |
| `xin chào` after RESET | **0** | forget |
| same two phrases remapped | **0xCC = R2** | basin(`rất vui được giúp`) |

```text
PHRASE_BASIN_ASSOCIATION_BOARD_VALIDATED
```

Not conversation. Teacher was used in TRAIN. Next is **M8-HW-06**:
Teacher OFF, Learn OFF, Freeze ON, weight writes = 0, FPGA is the response source.
