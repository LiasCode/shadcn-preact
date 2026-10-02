import { useId as usePreactId } from "preact/hooks";

/** A stable id, or `idOverride` when given. */
export function useId(idOverride?: string, prefix?: string): string {
  const id = usePreactId();
  return idOverride ?? (prefix ? `${prefix}-${id}` : id);
}

export function useBaseUiId(idOverride?: string): string {
  return useId(idOverride, "base-ui");
}