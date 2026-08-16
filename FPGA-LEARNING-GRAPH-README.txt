FPGA Learning Graph — through M8-LM-05
=======================================
React + Vite + TanStack Start + React Flow.

Same kit zip (updated in place, not renamed):
  D:\Jetking_sem4\SEM_4\basys3-eight-agent-full-parallel-learning-v0.1-THROUGH-M8-HW-06B-20260816.zip

npm install
npm run dev     # 0.0.0.0:8080

Basys 3:
  Chrome/Edge → Connect, pick the COM the kit enumerates
  HW-06B chat: program m8hw06b.bit, COM8, SW10 OFF, ARM AFTER
  LM-05: program basys3_lm05.bit (do not overwrite 06B), COM10, all SW off, 7-seg 05xx

Closed on silicon:
  01 cyclic · 02 remap · 03/03R dense · 04 temporal
  05 phrase basin · 06A teacher-free · 06B simple multi-turn
  LM-00 freeze · LM-01 token AR · LM-02 tiny LM
  LM-03 causal GPT fwd · LM-04 head/embed SGD
  LM-05 full tiny Transformer backprop (dumpz CE 40.6%, 128/128)

Not an LLM. Not open-domain chat. SRAM weights vanish on power-off.
Next research gate is Arty M8-LM-06.
