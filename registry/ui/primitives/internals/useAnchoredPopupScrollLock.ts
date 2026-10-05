import { useState } from "preact/hooks";

import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useScrollLock } from "./useScrollLock";

export function useAnchoredPopupScrollLock(
  enabled: boolean,
  touchOpen: boolean,
  positionerElement: HTMLElement | null,
  referenceElement: Element | null,
) {
  const [touchShouldLock, setTouchShouldLock] = useState(false);
  useIsoLayoutEffect(() => {
    const width = positionerElement?.ownerDocument.documentElement.clientWidth ?? 0;
    const popupWidth = positionerElement?.offsetWidth ?? 0;
    setTouchShouldLock(
      enabled && touchOpen && width > 0 && popupWidth > 0 && popupWidth >= width - 20,
    );
  }, [enabled, touchOpen, positionerElement]);

  useScrollLock(enabled && (!touchOpen || touchShouldLock), referenceElement);
}
