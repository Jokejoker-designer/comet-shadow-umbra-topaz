# Milestone checklist — 8-agent Basys 3

Living document. A box is checked only after its conjunctive gates pass.
Do **not** skip ahead. Conversation is last.

Frozen M8-HW-02: `results/M8-HW-02/IMMUTABLE_20260814/`
Tag name: `M8-HW-02-BOARD-PASS-20260814`
Bitstream lock: `74F989937CAB99B02E43313E33243DA5B0BC562646548797F150F5FA3CB9F05B`
Cyclic lock: `E27B0277D4B03EF30D5CE9D49C370C731DA8FBC0A0336F35C7AC3EA5BC318BA4`

---

## M8-HW-01 — cyclic learning

- [x] Basys 3 / 8 agents / online STDP / route-gate
- [x] EVAL_BEFORE → TRAIN → WEIGHT EFFECT → FREEZE → EVAL_AFTER
- [x] Frozen cyclic accuracy 650/650
- [x] `W[1][0]` HOLD = 1088 = `0440` (not `07FF`)
- [x] Claim: `8_AGENT_CYCLIC_LEARNING_CONVERGENCE_DEMONSTRATED`
- [x] Closeout: `results/M8-HW-01_CLOSEOUT.md`

**Not claimed:** arbitrary remapping, dense 64-cell, conversation.

---

## M8-HW-02 — arbitrary A → reset → B remapping

- [x] Same bitstream A then B
- [x] Host session echo A `[1,7,4,5,3,2,0,6]` seed `2026081401`
- [x] A before 0/32
- [x] A after / HOLD 32/32
- [x] A targets 320 × 8
- [x] 64-weight dump A
- [x] Reset neutral 0 / 64
- [x] A forget 0/32
- [x] Host session echo B `[5,6,0,1,7,3,2,4]` seed `2026081403`
- [x] B before 0/32
- [x] B after / HOLD 32/32
- [x] B targets 320 × 8
- [x] 64-weight dump reset + B
- [x] Permutations absent from `rtl/`
- [x] Claim (two host seeds only): `8_AGENT_ARBITRARY_ASSOCIATIVE_REMAPPING_BOARD_VALIDATED`
- [x] Immutable checkpoint + bitstream not overwritten

**Not claimed:** large random ensemble, dense same-transaction 64-cell, conversation.

---

## M8-HW-03 — 64-cell same-transaction full-parallel plasticity

Contract: `docs/M8-HW-03_DENSE_CONTRACT.md`
New bitstream **name** only: `build/out/basys3_eight_agent_m8hw03.bit`
Must **not** overwrite the M8-HW-02 file.

### 0. Freeze / hygiene

- [x] M8-HW-02 evidence copied immutable
- [x] Build script writes `m8hw03.bit`, not `m8hw02.bit`

### 1. Golden

- [x] `python/m8_hw03_dense_reference.py` exists
- [x] pytest: Dense-A 64/64, Dense-B 64/64, freeze 0/64, teacher-off 0/64
- [x] `matrix_sha256` stable (`C2A3751D…` for Dense-A)

### 2. RTL architecture

- [x] Dense bipolar law: `ΔW[d][s] = LR × (±teacher[d]) × (±stimulus[s])`
- [x] All 64 lanes including diagonal update in **one** TRAIN step
- [x] Hardware `changed_cell_count` (not host-inferred only)
- [x] One-hot STDP path unchanged when `dense_mode=0`
- [x] Teacher to core = 0 outside TRAIN
- [x] No Dense-A/B patterns compiled into `rtl/`

### 3. Telemetry

- [x] `A5 60` dense sample load (host → FPGA)
- [x] `A5 61` `DENSE_TRAIN_EVENT` (stim, teacher, changed_cell_count, learn, freeze)
- [x] `A5 5D` 16 pages × 4 weights still used
- [x] Snapshots: BEFORE=1, AFTER_ONE=2, FREEZE=3

### 4. Assertions / XSim

- [x] TRAIN ⇒ learn=1, freeze=0
- [x] else ⇒ learn=0, freeze=1, teacher_to_core=0
- [x] freeze stable ⇒ weights frozen
- [x] Dense-A after one TRAIN: `changed_cell_count==64`
- [x] Freeze replay: 0/64
- [x] Teacher disconnected: 0/64
- [x] FPGA matrix == Python matrix bit-exact
- [x] XSim prints `M8_HW03_PASS`

### 5. Board (one program)

- [x] Program `m8hw03.bit` once, record SHA-256 (`34D63D5D…`)
- [x] RESET + DUMP BEFORE (changed conceptually 0)
- [x] LOAD Dense-A
- [x] EXACTLY one TRAIN transaction
- [x] `changed_cell_count==64` on UART event
- [x] DUMP AFTER; 64/64 delta ≠ 0; SHA match Python
- [x] FREEZE + 32 infer; teacher disconnected
- [x] DUMP FREEZE == AFTER bit-exact
- [x] Dense-B 64/64 after reset
- [x] Freeze control 0/64 (XSim + freeze dump)
- [x] Teacher-disabled control: no learned mapping (XSim)
- [x] Post-route WNS ≥ 0 (+93.129)
- [x] Replay verdict == live verdict

**PASS claim (only if every AND-gate above is true):**

```text
64_SYNAPSES_SIMULTANEOUSLY_ACTIVE
FULL_PARALLEL_PLASTICITY
BOARD_VALIDATED
```

No PARTIAL PASS if count is 63 or less.

---

## M8-HW-03R — randomized regression ensemble

- [x] 32/32 random sessions: changed=64, SHA match, freeze == after (`run_032`)
- [x] 128/128 (`run_128`, seeds `2026081500`–`2026081627`)
- [x] Each seed stores: seed, stim, teacher, before_sha, after_sha, freeze_sha, changed_count

**Not claimed:** conversation. Same `m8hw03.bit`, no rebuild.

---

## M8-HW-04 — temporal / context memory

- [x] Sequence A→B→C trains output X (`0xA5`)
- [x] Negatives A,C,B / B,A,C / A,B do **not** produce X
- [x] RESET forgets (ABC after reset → 0)
- [x] No A/B/C/X constants in `rtl/`
- [x] Claim: `TEMPORAL_SEQUENCE_MEMORY_BOARD_VALIDATED`

Binder is fixed and non-commutative; readout W is learned. Not conversation.

---

## M8-HW-05 — semantic / phrase association

Contract: `docs/M8-HW-05_PHRASE_CONTRACT.md`  
Same bitstream as 04: `basys3_eight_agent_m8hw04.bit` `DEEFE548…`. No rebuild.

- [x] Encoder (host) → temporal/distributed spikes (no HELLO ID in RTL)
- [x] Distinct phrases can converge to one learned response basin
- [x] Not a prompt→response lookup table
- [x] Train P1 only: P2 misses (no class smuggled in the code)
- [x] Distractor `tạm biệt` ≠ basin
- [x] RESET forgets
- [x] Same phrases remapped to a new host basin
- [x] Claim: `PHRASE_BASIN_ASSOCIATION_BOARD_VALIDATED`

**Not claimed:** conversation, Teacher-off chat, LLM-free after-train dialogue.

---

## M8-HW-06A — teacher-free single-turn interaction

Contract: `docs/M8-HW-06A_TEACHER_FREE_CONTRACT.md`  
Same bitstream as 04/05: `basys3_eight_agent_m8hw04.bit` `DEEFE548…`. No rebuild.

- [x] TRAIN uses external teacher on phrase examples
- [x] AFTER hard switch: Teacher OFF, External LLM = 0, Learn OFF, Freeze ON, weight writes = 0
- [x] `xin chào` → host encoder → FPGA → R1 → local decoder → `chào bạn`
- [x] `hello` (same basin) also decodes to `chào bạn`
- [x] Distractor does not
- [x] DUMP SHA before AFTER infer == after (`5452F2B6…`)
- [x] UI / transcript shows provenance flags
- [x] Claim: `TEACHER_FREE_AFTER_TRAIN_SIMPLE_INTERACTION_BOARD_VALIDATED`

**Not claimed:** conversation, multi-turn, name memory.

---

## M8-HW-06B — multi-turn context

Contract: `docs/M8-HW-06B_MULTI_TURN_CONTRACT.md`  
Bit: `basys3_eight_agent_m8hw06b.bit` `7CE3238E…` (04 `DEEFE548…` not overwritten)

- [x] Turn 3 depends on earlier FPGA ctx (`hold_ctx`)
- [x] RESET ctx, then only `Tôi tên gì?` → empty
- [x] Change name Quân ↔ Lan → decode changes
- [x] Permuted order → not Quân
- [x] AFTER: Teacher OFF, LLM 0, Learn OFF, Freeze ON, W SHA frozen
- [x] Claim: `SIMPLE_LEARNED_MULTI_TURN_CONVERSATION_BOARD_VALIDATED`

Not an LLM. Not open-domain chat.

---

## Current pointer

**NOW:** M8-HW-06B **BOARD PASS**.
Ladder 01→02→03→03R→04→05→06A→06B is closed on silicon.
