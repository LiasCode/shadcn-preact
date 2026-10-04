import { createContext } from "preact";

import type { FieldControlState } from "../field/control/FieldControl";

export interface FieldValidityData {
  state: Omit<ValidityState, "valid"> & { valid: boolean | null };
  error: string;
  errors: string[];
  value: unknown;
  initialValue: unknown;
}
export const emptyValidity = (): FieldValidityData => ({
  state: {
    badInput: false,
    customError: false,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    valid: null,
  },
  error: "",
  errors: [],
  value: "",
  initialValue: "",
});
export const fieldValidityMapping = {
  valid: (valid: boolean | null) => (valid === null ? null : { [valid ? "data-valid" : "data-invalid"]: "" }),
};
export interface FieldRootContextValue {
  state: FieldControlState;
  name?: string;
  controlId?: string;
  labelId?: string;
  messages: string[];
  validity: FieldValidityData;
  register: (input: HTMLInputElement | HTMLTextAreaElement, id: string, name?: string) => () => void;
  label: (id: string) => () => void;
  message: (id: string) => () => void;
  change: (value: string) => void;
  focus: (focused: boolean) => void;
}
export const FieldRootContext = createContext<FieldRootContextValue | null>(null);