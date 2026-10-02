const selector =
  'button,input,select,textarea,a[href],area[href],iframe,summary,[tabindex],[contenteditable="true"],audio[controls],video[controls]';
export function isTabbable(element: HTMLElement) {
  if (element.tabIndex < 0 || element.matches(':disabled,input[type="hidden"]')) return false;
  for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.tagName === "FIELDSET" && (ancestor as HTMLFieldSetElement).disabled) {
      const legend = Array.from(ancestor.children).find((child) => child.tagName === "LEGEND");
      if (!legend?.contains(element)) return false;
    }
  }
  if (element.closest("[inert],[hidden]")) return false;
  const view = element.ownerDocument.defaultView;
  for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
    const style = view?.getComputedStyle(parent);
    if (style?.display === "none" || style?.visibility === "hidden" || style?.visibility === "collapse") return false;
    if (
      parent.tagName === "DETAILS" &&
      !parent.hasAttribute("open") &&
      !parent.querySelector("summary")?.contains(element)
    )
      return false;
  }
  if (
    element.tagName === "INPUT" &&
    (element as HTMLInputElement).type === "radio" &&
    (element as HTMLInputElement).name
  ) {
    const input = element as HTMLInputElement;
    const radios = Array.from(element.ownerDocument.querySelectorAll<HTMLInputElement>('input[type="radio"]')).filter(
      (radio) => radio.name === input.name && radio.form === input.form && !radio.disabled,
    );
    const checked = radios.find((radio) => radio.checked);
    if (checked && checked !== element) return false;
    if (!checked && radios[0] !== element) return false;
  }
  return true;
}
export function getTabbableElements(container: Element): HTMLElement[] {
  const result: HTMLElement[] = [];
  function visit(root: Element | ShadowRoot) {
    for (const element of root.querySelectorAll<HTMLElement>(selector)) {
      if (isTabbable(element)) result.push(element);
    }
    for (const element of root.querySelectorAll<HTMLElement>("*")) if (element.shadowRoot) visit(element.shadowRoot);
  }
  visit(container);
  return result.sort((a, b) => {
    const ai = a.tabIndex > 0 ? a.tabIndex : Infinity;
    const bi = b.tabIndex > 0 ? b.tabIndex : Infinity;
    return ai - bi || 0;
  });
}