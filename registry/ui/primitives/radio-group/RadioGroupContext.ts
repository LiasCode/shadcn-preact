import { createContext } from "preact";

import type { BaseUIChangeEventDetails } from "../internals/createBaseUIEventDetails";
import type { ElementRef } from "../internals/types";
import type { RadioGroupState } from "./RadioGroup";
export interface RadioGroupContextValue {
  value: unknown;
  state: RadioGroupState;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  name?: string;
  form?: string;
  inputRef?: ElementRef<HTMLInputElement>;
  registerInput(input: HTMLInputElement | null): void;
  keyboard: { current: boolean };
  setValue(value: unknown, details: BaseUIChangeEventDetails<"none">): void;
  reset(): void;
}
export const RadioGroupContext = createContext<RadioGroupContextValue | undefined>(undefined);