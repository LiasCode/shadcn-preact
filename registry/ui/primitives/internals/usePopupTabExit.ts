import { useEffect, useRef } from "preact/hooks";

import { getTabbableElements } from "./tabbable";
import { useStableCallback } from "./useStableCallback";

/** Close a list popup, then continue document Tab order after modal marks are released. */
export function usePopupTabExit(
  getReference: () => HTMLElement | null,
  close: (event: KeyboardEvent) => boolean,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return useStableCallback((event: KeyboardEvent) => {
    if (event.key !== "Tab") {
      return false;
    }

    event.preventDefault();
    const reference = getReference();

    if (!reference || !close(event)) {
      return true;
    }

    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const elements = getTabbableElements(reference.ownerDocument.body).filter(
        (e) => !e.hasAttribute("data-base-ui-focus-guard"),
      );
      const index = elements.indexOf(reference);

      if (index < 0) {
        return;
      }

      const next = elements[index + (event.shiftKey ? -1 : 1)];
      next?.focus();
    }, 0);
    return true;
  });
}
