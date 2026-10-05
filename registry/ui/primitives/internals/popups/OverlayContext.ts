import { createContext, type ComponentChildren, type RefObject } from "preact";
import { useContext } from "preact/hooks";

import type { BaseUIChangeEventDetails } from "../createBaseUIEventDetails";
import type { FloatingRootContext } from "../useFloatingRootContext";
import type { TransitionStatus } from "../useTransitionStatus";
import type { PopupHandle } from "./PopupHandle";

export type OverlayKind =
  | "dialog"
  | "alert-dialog"
  | "drawer"
  | "popover"
  | "tooltip"
  | "preview-card"
  | "menu"
  | "select"
  | "combobox"
  | "navigation-menu";

export type OverlayReason =
  | "trigger-press"
  | "close-press"
  | "outside-press"
  | "escape-key"
  | "focus-out"
  | "imperative-action"
  | "none"
  | "trigger-hover"
  | "trigger-focus"
  | "swipe"
  | "item-press"
  | "list-navigation"
  | "sibling-open"
  | "cancel-open"
  | "link-press"
  | "window-resize"
  | "input-change"
  | "input-press"
  | "clear-press"
  | "chip-remove-press";

export type OverlayChangeDetails = BaseUIChangeEventDetails<OverlayReason> & {
  preventUnmountOnClose(): void;
};

export interface OverlayRootProps<Payload = unknown> {
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean | "trap-focus";
  onOpenChange?: (open: boolean, details: OverlayChangeDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  disablePointerDismissal?: boolean;
  actionsRef?: RefObject<{ close(): void; unmount(): void } | null>;
  handle?: PopupHandle<Payload>;
  children?: ComponentChildren | ((payload: Payload | undefined) => ComponentChildren);
  triggerId?: string | null;
  defaultTriggerId?: string | null;
  disabled?: boolean;
  disableHoverablePopup?: boolean;
  "data-slot"?: string;
}

export interface NestedPopup {
  count?: number;
  kind: OverlayKind;
  open: boolean;
  height: number;
  swiping: boolean;
  progress: number;
}

export interface OverlayContextValue {
  kind: OverlayKind;
  open: boolean;
  mounted: boolean;
  transitionStatus: TransitionStatus;
  modal: boolean | "trap-focus";
  disabled: boolean;
  disablePointerDismissal: boolean;
  disableHoverablePopup: boolean;
  id: string;
  popupId: string;
  activeTriggerId: string | null;
  reference: HTMLElement | null;
  setReference(element: HTMLElement | null): void;
  popupRef: RefObject<HTMLElement | null>;
  setPopup(element: HTMLElement | null): void;
  backdrop: HTMLElement | null;
  setBackdrop(element: HTMLElement | null): void;
  viewport: HTMLElement | null;
  setViewport(element: HTMLElement | null): void;
  titleId?: string;
  descriptionId?: string;
  setTitleId(id: string | undefined): void;
  setDescriptionId(id: string | undefined): void;
  setPopupId(id: string): void;
  floatingContext: FloatingRootContext;
  handle: PopupHandle<any>;
  change(
    open: boolean,
    event: Event,
    reason: OverlayReason,
    trigger?: HTMLElement,
    payload?: unknown,
  ): OverlayChangeDetails;
  schedule(
    open: boolean,
    event: Event,
    reason: OverlayReason,
    delay: number,
    trigger?: HTMLElement,
    payload?: unknown,
  ): void;
  cancelTimers(): void;
  closeDelay: RefObject<number>;
  hoverCleanup: RefObject<(() => void) | null>;
  nested: boolean;
  nestedPopups: Map<string, NestedPopup>;
  registerNested(id: string, popup: NestedPopup): () => void;
  parent: OverlayContextValue | null;
}

export const OverlayContext = createContext<OverlayContextValue | null>(null);

export function useOverlayContext(optional = false) {
  const context = useContext(OverlayContext);

  if (!context && !optional) {
    throw new Error("Base UI: Popup parts must be within their Root.");
  }

  return context!;
}

export const popupStateMapping = {
  open(value: boolean): Record<string, string> {
    return value ? { "data-open": "" } : { "data-closed": "" };
  },
};
