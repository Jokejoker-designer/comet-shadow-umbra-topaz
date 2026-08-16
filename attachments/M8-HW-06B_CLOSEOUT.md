# M8-HW-06B — closeout

**Date:** 2026-08-16  
**Bitstream:** `build/out/basys3_eight_agent_m8hw06b.bit`  
**SHA-256:** `7CE3238E93128D2C1F5420723752B01A3683B9DBF5A114502DB677A725E4B4F6`  
**Frozen 04:** `DEEFE548634904B27B70E7D6C969B0E3FF9C2178A2D3F465FD78F06B5670D79A`  
**WNS:** +96.343 ns  
**Evidence:** `results/M8-HW-06B/run_003/`

Context lives in the FPGA binder (`hold_ctx`). Host only encodes text.  
AFTER: Teacher OFF, LLM 0, Learn OFF, Freeze ON, W writes 0.

| Turns | out | decode |
|-------|-----|--------|
| `Tên tôi là Quân` → `Xin chào` → `Tôi tên gì?` | **0x66** | **Quân** |
| `Tên tôi là Lan` → `Xin chào` → `Tôi tên gì?` | **0xEE** | **Lan** |
| RESET ctx, then only `Tôi tên gì?` | 0x00 | empty |
| Permuted order | 0x00 | empty |

```text
SIMPLE_LEARNED_MULTI_TURN_CONVERSATION_BOARD_VALIDATED
```

Still not an LLM and not open-domain chat. Encoder/decoder stay on the host.
`rtl/` has no names.
