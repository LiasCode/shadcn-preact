export const sliderStateAttributesMapping = {
  activeThumbIndex: () => null,
  max: () => null,
  min: () => null,
  minStepsBetweenValues: () => null,
  step: () => null,
  values: () => null,
  valid: (value: boolean | null): Record<string, string> | null =>
    value === null ? null : value ? { "data-valid": "" } : { "data-invalid": "" },
};