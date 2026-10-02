import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { RadioRootState } from "./RadioRoot";
export const RadioRootContext = createContext<RadioRootState | undefined>(undefined);
export function useRadioRootContext() {
  const context = useContext(RadioRootContext);
  if (!context) throw new Error("Base UI: Radio parts must be used within Radio.Root.");
  return context;
}