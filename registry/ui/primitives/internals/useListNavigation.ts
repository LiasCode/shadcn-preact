import { useEffect, useRef } from "preact/hooks";

import { useDirection } from "../direction-provider";
import { useStableCallback } from "./useStableCallback";

export const itemLabels = new WeakMap<HTMLElement, string>();

export function useListNavigation(
  getItems: () => HTMLElement[],
  options: { orientation?: "vertical" | "horizontal" | "both"; loopFocus?: boolean } = {},
) {
  const direction = useDirection();
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const items = () =>
    getItems().filter(
      (e) => e.getAttribute("aria-disabled") !== "true" && !e.hasAttribute("disabled"),
    );

  const focusEdge = useStableCallback((last = false) => {
    const list = items();
    const node = last ? list.at(-1) : list[0];
    node?.focus({ preventScroll: true });

    node?.scrollIntoView?.({ block: "nearest" });
  });
  const navigate = useStableCallback((event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.isComposing) {
      return false;
    }

    const list = items();

    if (!list.length) {
      return false;
    }

    const index = list.indexOf(list[0]!.ownerDocument.activeElement as HTMLElement);
    const horizontal = options.orientation === "horizontal";
    const forward = horizontal ? (direction === "rtl" ? "ArrowLeft" : "ArrowRight") : "ArrowDown";
    const backward = horizontal ? (direction === "rtl" ? "ArrowRight" : "ArrowLeft") : "ArrowUp";
    let next = -1;

    if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = list.length - 1;
    } else if (
      event.key === forward ||
      event.key === backward ||
      (options.orientation === "both" && ["ArrowLeft", "ArrowRight"].includes(event.key))
    ) {
      const delta =
        event.key === forward ||
        (options.orientation === "both" &&
          event.key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight"))
          ? 1
          : -1;
      next = index < 0 ? (delta === 1 ? 0 : list.length - 1) : index + delta;
      next =
        options.loopFocus === false
          ? Math.max(0, Math.min(list.length - 1, next))
          : (next + list.length) % list.length;
    } else if (event.key.length === 1 && !(event.key === " " && !buffer.current)) {
      clearTimeout(timer.current);
      buffer.current += event.key.toLocaleLowerCase();
      timer.current = setTimeout(() => {
        buffer.current = "";
      }, 500);
      const chars = [...buffer.current];
      const search = chars.every((c) => c === chars[0]) ? chars[0]! : buffer.current;
      const start = search.length > 1 ? Math.max(index, 0) : index + 1;

      for (let offset = 0; offset < list.length; offset++) {
        const n = (start + offset) % list.length;
        const label = itemLabels.get(list[n]!) ?? list[n]!.textContent ?? "";

        if (label.trim().toLocaleLowerCase().startsWith(search)) {
          next = n;
          break;
        }
      }
    } else {
      return false;
    }

    event.preventDefault();

    event.stopPropagation();

    if (next >= 0) {
      list[next]?.focus({ preventScroll: true });

      list[next]?.scrollIntoView?.({ block: "nearest" });
    }

    return true;
  });
  return { navigate, focusEdge };
}
