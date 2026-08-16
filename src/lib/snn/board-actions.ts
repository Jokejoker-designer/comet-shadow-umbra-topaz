import type { BtnId } from "./board";
import { useLab } from "./store";

export function handleButton(id: BtnId) {
  useLab.getState().pressBtn(id);
}
