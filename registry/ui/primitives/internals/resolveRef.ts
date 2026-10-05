/** Returns the `current` value of a ref object, or the argument itself. */
export function resolveRef<T>(
  maybeRef: T | { current: T } | null | undefined,
): T | null | undefined {
  if (maybeRef == null) {
    return maybeRef;
  }

  return typeof maybeRef === "object" && "current" in maybeRef ? maybeRef.current : (maybeRef as T);
}
