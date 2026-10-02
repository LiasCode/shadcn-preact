import type { OverlayRootProps, OverlayChangeDetails, OverlayReason } from "../internals/popups/OverlayContext";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { PopupHandle } from "../internals/popups/PopupHandle";
export { OverlayTrigger as Trigger } from "../internals/popups/OverlayTrigger";
export {
  OverlayPortal as Portal,
  OverlayPopup as Popup,
  OverlayClose as Close,
  OverlayBackdrop as Backdrop,
  OverlayTitle as Title,
  OverlayDescription as Description,
} from "../internals/popups/OverlayParts";
export function Root<Payload = unknown>(props: Omit<OverlayRootProps<Payload>, "disabled" | "disableHoverablePopup">) {
  return <OverlayRoot kind="dialog" {...props} />;
}
export namespace Root {
  export type Props<Payload = unknown> = Omit<OverlayRootProps<Payload>, "disabled" | "disableHoverablePopup">;
  export type ChangeEventDetails = OverlayChangeDetails;
  export type ChangeEventReason = OverlayReason;
  export type Actions = { close(): void; unmount(): void };
}
export function createHandle<Payload = unknown>() {
  return new PopupHandle<Payload>();
}