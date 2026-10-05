import type {
  OverlayRootProps,
  OverlayChangeDetails,
  OverlayReason,
} from "../internals/popups/OverlayContext";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { PopupHandle } from "../internals/popups/PopupHandle";
export { OverlayTrigger as Trigger } from "../internals/popups/OverlayTrigger";
export {
  OverlayPortal as Portal,
  OverlayPopup as Popup,
  OverlayPositioner as Positioner,
  OverlayArrow as Arrow,
} from "../internals/popups/OverlayParts";
export { TooltipProvider as Provider } from "../internals/popups/TooltipProvider";

export function Root<Payload = unknown>(
  props: Omit<OverlayRootProps<Payload>, "modal" | "disablePointerDismissal">,
) {
  return <OverlayRoot kind="tooltip" {...props} />;
}

export namespace Root {
  export type Props<Payload = unknown> = Omit<
    OverlayRootProps<Payload>,
    "modal" | "disablePointerDismissal"
  >;

  export type ChangeEventDetails = OverlayChangeDetails;

  export type ChangeEventReason = OverlayReason;

  export type Actions = { close(): void; unmount(): void };
}

export function createHandle<Payload = unknown>() {
  return new PopupHandle<Payload>();
}
