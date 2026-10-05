import type { OverlayContextValue } from "./popups/OverlayContext";
import { useStableCallback } from "./useStableCallback";

interface Point {
  x: number;
  y: number;
}

function inTriangle(point: Point, a: Point, b: Point, c: Point) {
  const sign = (p: Point, q: Point, r: Point) =>
    (p.x - r.x) * (q.y - r.y) - (q.x - r.x) * (p.y - r.y);

  const values = [sign(point, a, b), sign(point, b, c), sign(point, c, a)];
  return !(values.some((value) => value < 0) && values.some((value) => value > 0));
}
/** Keep a hoverable popup open while crossing the gap along a corridor to its facing edge. */
export function useHoverFloatingInteraction(
  context: OverlayContextValue | null,
  getDelay: () => number,
  fromPopup = false,
) {
  return useStableCallback((event: PointerEvent) => {
    if (!context) {
      return;
    }

    const source = fromPopup ? context.popupRef.current : context.reference;
    const target = fromPopup ? context.reference : context.popupRef.current;

    if (event.relatedTarget instanceof Node && target?.contains(event.relatedTarget)) {
      context.cancelTimers();
      return;
    }

    const close = () => context.schedule(false, event, "trigger-hover", getDelay());

    if (!context.open || context.disableHoverablePopup || !source || !target) {
      close();
      return;
    }

    const rect = target.getBoundingClientRect();
    const start = source.getBoundingClientRect();

    if (!rect.width || !rect.height) {
      close();
      return;
    }

    const dx = rect.x + rect.width / 2 - start.x - start.width / 2;
    const dy = rect.y + rect.height / 2 - start.y - start.height / 2;
    let b: Point;
    let c: Point;

    if (Math.abs(dx) > Math.abs(dy)) {
      const x = dx > 0 ? rect.left - 4 : rect.right + 4;
      b = { x, y: rect.top - 4 };
      c = { x, y: rect.bottom + 4 };
    } else {
      const y = dy > 0 ? rect.top - 4 : rect.bottom + 4;
      b = { x: rect.left - 4, y };
      c = { x: rect.right + 4, y };
    }

    const a = { x: event.clientX - Math.sign(dx) * 4, y: event.clientY - Math.sign(dy) * 4 };
    const doc = source.ownerDocument;

    const move = (next: PointerEvent) => {
      if (next.pointerType === "touch") {
        return;
      }

      if (next.composedPath().includes(target) || next.composedPath().includes(source)) {
        context.cancelTimers();
        return;
      }

      if (!inTriangle({ x: next.clientX, y: next.clientY }, a, b, c)) {
        close();
      }
    };

    context.schedule(false, event, "trigger-hover", Math.max(500, getDelay()));

    doc.addEventListener("pointermove", move);
    context.hoverCleanup.current = () => {
      doc.removeEventListener("pointermove", move);
    };
  });
}
