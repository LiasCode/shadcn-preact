/** Realm-independent checks for popups portaled into another document or a shadow tree. */
export function isNode(value: unknown): value is Node {
  return value != null && typeof value === "object" && "nodeType" in value;
}
export function isHTMLElement(value: unknown): value is HTMLElement {
  return isNode(value) && value.nodeType === 1 && "style" in value && "focus" in value;
}