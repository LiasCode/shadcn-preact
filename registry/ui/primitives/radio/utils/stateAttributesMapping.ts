export const stateAttributesMapping = {
  checked: (value: boolean): Record<string, string> =>
    value ? { "data-checked": "" } : { "data-unchecked": "" },
  valid: (value: boolean | null): Record<string, string> | null =>
    value === null ? null : value ? { "data-valid": "" } : { "data-invalid": "" },
};
