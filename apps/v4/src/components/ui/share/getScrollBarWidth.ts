export function getScrollBarWidth(element: HTMLElement): number {
  if (!element) {
    throw new Error("A valid DOM element must be provided.");
  }

  if (element.tagName === "BODY" || !element.parentElement) {
    return window.innerWidth - element.offsetWidth;
  }

  const scrollBarWidth = element.parentElement.offsetWidth - element.offsetWidth;
  return scrollBarWidth;
}
