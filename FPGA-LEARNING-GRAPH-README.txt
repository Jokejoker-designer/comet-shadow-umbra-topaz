FPGA Learning Graph — through M8-HW-06B
=======================================
React + Vite + TanStack Start + React Flow.

npm install
npm run dev     # 0.0.0.0:8080

Basys 3:
  Chrome/Edge → Connect COM8 @ 115200
  Program m8hw06b.bit
  SW10 OFF. A5 62 arms temporal (SW11 optional).
  AFTER-TRAIN: Teacher OFF, Learn OFF, Freeze ON, LLM 0.

Closed on silicon:
  01 cyclic · 02 remap · 03/03R dense · 04 temporal
  05 phrase basin · 06A teacher-free single-turn
  06B simple learned multi-turn (Quân / Lan)

Not an LLM. Not open-domain chat.
Host encoder + local decoder. FPGA holds W + hold_ctx.
UART AFTER: A5 63 probe (hold flag) · A5 64 event · A5 5F 08 clear ctx.
