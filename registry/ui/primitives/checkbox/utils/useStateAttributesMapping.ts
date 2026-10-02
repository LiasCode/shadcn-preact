import type { CheckboxRootState } from "../root/CheckboxRoot";
export function useStateAttributesMapping(state: Pick<CheckboxRootState, "indeterminate">) {
  return {
    checked: (value: boolean): Record<string, string> =>
      state.indeterminate ? {} : value ? { "data-checked": "" } : { "data-unchecked": "" },
    valid: (value: boolean | null): Record<string, string> | null =>
      value === null ? null : value ? { "data-valid": "" } : { "data-invalid": "" },
  };
}