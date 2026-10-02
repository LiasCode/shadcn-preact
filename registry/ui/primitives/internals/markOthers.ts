// Adapted from Base UI 1.6.0 floating-ui-react/utils/markOthers (MIT).
// Reference-count attributes so overlapping modal lifetimes restore original values.
const locks = new WeakMap<Element, Map<string, { count: number; original: string | null }>>();
function lock(element: Element, attribute: string, value: string) {
  let attributes = locks.get(element);
  if (!attributes) {
    attributes = new Map();
    locks.set(element, attributes);
  }
  const record = attributes.get(attribute);
  if (record) record.count++;
  else {
    attributes.set(attribute, { count: 1, original: element.getAttribute(attribute) });
    element.setAttribute(attribute, value);
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = attributes.get(attribute);
    if (!current || --current.count) return;
    if (current.original === null) element.removeAttribute(attribute);
    else element.setAttribute(attribute, current.original);
    attributes.delete(attribute);
  };
}
export function markOthers(
  avoidElements: Element[],
  options: { ariaHidden?: boolean; inert?: boolean; mark?: boolean } = {},
) {
  if (typeof window === "undefined" || !avoidElements[0]) return () => {};
  const body = avoidElements[0].ownerDocument.body;
  // Keep shadow hosts and their ancestors reachable when the popup lives in a shadow tree.
  function host(element: Element): Element {
    const root = element.getRootNode();
    return "host" in root ? host((root as ShadowRoot).host) : element;
  }
  const allowed = avoidElements.map((element) => (body.contains(element) ? element : host(element)));
  const live = Array.from(body.querySelectorAll("[aria-live]"));
  const releases: (() => void)[] = [];
  function walk(parent: Element, control: boolean) {
    for (const child of parent.children) {
      if (child.tagName === "SCRIPT") continue;
      const targets = control ? allowed.concat(live) : allowed;
      if (targets.includes(child)) continue;
      if (targets.some((element) => child.contains(element))) {
        walk(child, control);
        continue;
      }
      const attribute = control ? (options.inert ? "inert" : "aria-hidden") : "data-base-ui-inert";
      releases.push(lock(child, attribute, attribute === "aria-hidden" ? "true" : ""));
    }
  }
  if (options.inert || options.ariaHidden) walk(body, true);
  if (options.mark !== false) walk(body, false);
  return () => {
    for (const release of releases) release();
  };
}