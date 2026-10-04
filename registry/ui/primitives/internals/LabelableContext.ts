import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { FieldControlState } from "../field/control/FieldControl";
import { FieldRootContext } from "./FieldRootContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";
export interface LabelableContextValue {
  state: FieldControlState;
  controlId?: string;
  labelId?: string;
  messages: string[];
  label: (id: string) => () => void;
  message: (id: string) => () => void;
  focusControl: () => void;
  registerControl: (id: string, focus: () => void) => () => void;
}
export const LabelableContext = createContext<LabelableContextValue | null>(null);
export function useFieldLabelScope() {
  const item = useContext(LabelableContext);
  const field = useContext(FieldRootContext);
  return item ?? field;
}
export function useItemControl(id: string, control: { current: HTMLElement | null }) {
  const item = useContext(LabelableContext);
  const focus = useStableCallback(() => control.current?.focus());
  useIsoLayoutEffect(() => item?.registerControl(id, focus), [item?.registerControl, id, focus]);
  return item;
}