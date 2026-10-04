/** Base UI's native/form serialization, independent of the visible item label. */
export function stringifyAsValue<Value>(value: Value | null | undefined, formatter?: (value: Value) => string): string {
  if (value == null) return "";
  if (formatter) return formatter(value) ?? "";
  const raw = typeof value === "object" && "value" in value && "label" in value ? value.value : value;
  if (raw == null) return "";
  if (typeof raw === "string") return raw;
  try {
    return JSON.stringify(raw) ?? String(raw);
  } catch {
    return String(raw);
  }
}