# M8-HW-03 — closeout (this session)

**Date:** 2026-08-14  
**Board:** Digilent Basys 3 `210183BF7B31A`  
**Bitstream:** `build/out/basys3_eight_agent_m8hw03.bit`  
**SHA-256:** `34D63D5D60968DA637879FA6F8DCA9CC93B8636FF24080E151151D4BC246EC45`  
**Frozen M8-HW-02 bit untouched:** `74F989937CAB99B02E43313E33243DA5B0BC562646548797F150F5FA3CB9F05B`  
**WNS:** +93.129 ns  
**Evidence:** `results/M8-HW-03/run_002/`

run_001 on the SW12-gated image is **not** a pass (dense path not armed).  
run_002 uses host `A5 60` to arm dense mode.

---

## Verdict

```
M8-HW-03
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ONE DENSE TRAIN TRANSACTION    PASS
HARDWARE changed_cell_count    64
HOST Δ 64/64                   PASS
FPGA == Python SHA             PASS
  C2A3751D4473C0AE…9066B5A
FREEZE == AFTER bit-exact      PASS
Dense-B 64 + SHA match         PASS
Teacher off / freeze (XSim)    PASS
Timing WNS ≥ 0                 PASS

FINAL:
64_SYNAPSES_SIMULTANEOUSLY_ACTIVE
FULL_PARALLEL_PLASTICITY
BOARD_VALIDATED                PASS
```

Law: `ΔW[d][s] = 8 × (±t[d]) × (±x[s])`, diagonal plastic.  
Dense-A `stim=0xB4 teacher=0x6B`. Dense-B invert stim.

**Still not:** conversation, temporal memory, 32/128 random ensemble (that is M8-HW-03R).
