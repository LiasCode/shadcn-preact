import { useContext, useRef } from "preact/hooks";

import { FieldRootContext } from "./FieldRootContext";
import { useOverlayContext } from "./popups/OverlayContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";

/** Commit blur validation after popup selection has reached the native constraint bridge. */
export function FieldPopupLifecycle() {
  const field = useContext(FieldRootContext);
  const overlay = useOverlayContext();
  const previous = useRef(overlay.open);
  useIsoLayoutEffect(() => {
    if (previous.current && !overlay.open) field?.focus(false);
    previous.current = overlay.open;
  }, [overlay.open, field]);
  return null;
}