import { createContext } from "preact";

import type { BaseUIChangeEventDetails } from "../internals/createBaseUIEventDetails";

export interface ToggleGroupContextValue {
  value: readonly string[];
  disabled: boolean;
  setGroupValue(value: string, pressed: boolean, details: BaseUIChangeEventDetails<"none">): void;
}

export const ToggleGroupContext = createContext<ToggleGroupContextValue | undefined>(undefined);
