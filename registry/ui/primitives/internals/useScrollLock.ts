import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
const documents = new WeakMap<Document, { count: number; restore: () => void }>();
/** Lock both possible page scrollers while retaining consumer inline declarations. */
export function lockScroll(document: Document) {
  const existing = documents.get(document);
  if (existing) existing.count++;
  else {
    const html = document.documentElement;
    const body = document.body;
    const view = document.defaultView;
    const declarations = [html, body].flatMap((element) =>
      ["overflow", "overflow-x", "overflow-y"].map((property) => ({
        element,
        property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property),
      })),
    );
    for (const property of ["padding-right", "scrollbar-gutter"]) {
      const element = property === "padding-right" ? body : html;
      declarations.push({
        element,
        property,
        value: element.style.getPropertyValue(property),
        priority: element.style.getPropertyPriority(property),
      });
    }
    const originalMarker = html.getAttribute("data-base-ui-scroll-locked");
    const gutter = Math.max(0, (view?.innerWidth ?? 0) - html.clientWidth);
    const stableGutter = view?.CSS?.supports?.("scrollbar-gutter", "stable") ?? false;
    if (gutter && html.clientWidth) {
      if (stableGutter)
        html.style.setProperty(
          "scrollbar-gutter",
          view?.getComputedStyle(html).scrollbarGutter.includes("both-edges") ? "stable both-edges" : "stable",
        );
      else
        body.style.setProperty(
          "padding-right",
          `${(parseFloat(view?.getComputedStyle(body).paddingRight ?? "0") || 0) + gutter}px`,
        );
    }
    for (const element of [html, body]) element.style.setProperty("overflow", "hidden", "important");
    html.setAttribute("data-base-ui-scroll-locked", "");
    documents.set(document, {
      count: 1,
      restore() {
        // Remove the shorthand first, then restore longhands in declaration order.
        for (const { element, property } of declarations) element.style.removeProperty(property);
        for (const { element, property, value, priority } of declarations) {
          if (value) element.style.setProperty(property, value, priority);
        }
        if (originalMarker === null) html.removeAttribute("data-base-ui-scroll-locked");
        else html.setAttribute("data-base-ui-scroll-locked", originalMarker);
      },
    });
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = documents.get(document);
    if (current && --current.count === 0) {
      current.restore();
      documents.delete(document);
    }
  };
}
export function useScrollLock(enabled: boolean, referenceElement?: Element | null) {
  useIsoLayoutEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;
    return lockScroll(referenceElement?.ownerDocument ?? window.document);
  }, [enabled, referenceElement]);
}