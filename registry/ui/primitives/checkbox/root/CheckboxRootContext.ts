import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { CheckboxRootState } from "./CheckboxRoot";
export const CheckboxRootContext = createContext<CheckboxRootState | undefined>(undefined);

export function useCheckboxRootContext() {
  const context = useContext(CheckboxRootContext);

  if (!context) {
    throw new Error("Base UI: Checkbox parts must be used within Checkbox.Root.");
  }

  return context;
}
