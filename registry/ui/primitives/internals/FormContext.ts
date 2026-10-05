import { createContext } from "preact";

export type ValidationMode = "onSubmit" | "onBlur" | "onChange";

export interface RegisteredField {
  name?: string;
  getValue: () => unknown;
  validate: () => void;
  isInvalid: () => boolean;
  focus: () => void;
}

export interface FormContextValue {
  fields: Map<symbol, RegisteredField>;
  submitted: { current: boolean };
  validationMode: ValidationMode;
  errors: Record<string, string | string[]>;
  clearError: (name: string) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);
