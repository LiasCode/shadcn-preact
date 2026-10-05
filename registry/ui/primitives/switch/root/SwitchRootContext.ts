import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { SwitchRootState } from "./SwitchRoot";
export const SwitchRootContext = createContext<SwitchRootState | undefined>(undefined);

export function useSwitchRootContext() {
  const context = useContext(SwitchRootContext);

  if (!context) {
    throw new Error("Base UI: Switch parts must be used within Switch.Root.");
  }

  return context;
}
