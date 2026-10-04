import { createContext, type ComponentChildren } from "preact";
import { useContext, useRef } from "preact/hooks";

import { FloatingFocusManager, type FloatingFocusManagerProps } from "../FloatingFocusManager";
import { FloatingPortal, type FloatingPortalProps } from "../FloatingPortal";
import { transitionStatusMapping } from "../stateAttributesMapping";
import type { BaseUIComponentProps, NativeButtonProps } from "../types";
import {
  useAnchorPositioning,
  type UseAnchorPositioningSharedParameters,
  type UseAnchorPositioningReturnValue,
} from "../useAnchorPositioning";
import { useButton } from "../useButton";
import { useHoverFloatingInteraction } from "../useHoverFloatingInteraction";
import { useBaseUiId } from "../useId";
import { useIsoLayoutEffect } from "../useIsoLayoutEffect";
import { useRenderElement } from "../useRenderElement";
import { useStableCallback } from "../useStableCallback";
import type { TransitionStatus } from "../useTransitionStatus";
import { getElementProps } from "./getElementProps";
import { useOverlayContext, popupStateMapping } from "./OverlayContext";
export interface PopupState {
  open: boolean;
  transitionStatus: TransitionStatus;
  nested: boolean;
  nestedDialogOpen: boolean;
  side?: string;
  align?: string;
}
const PositionContext = createContext<UseAnchorPositioningReturnValue | null>(null);
export function usePositionContext() {
  return useContext(PositionContext);
}
const mapping = {
  ...popupStateMapping,
  ...transitionStatusMapping,
  nestedDialogOpen(value: boolean) {
    return value ? { "data-nested-dialog-open": "" } : null;
  },
};
export interface OverlayPortalProps extends FloatingPortalProps {
  keepMounted?: boolean;
}
export function OverlayPortal({ keepMounted = false, ...props }: OverlayPortalProps) {
  const context = useOverlayContext();
  return context.mounted || keepMounted ? <FloatingPortal {...props} /> : null;
}
export namespace OverlayPortal {
  export type Props = OverlayPortalProps;
}
export interface OverlayPopupProps extends BaseUIComponentProps<"div", PopupState> {
  initialFocus?: FloatingFocusManagerProps["initialFocus"];
  finalFocus?: FloatingFocusManagerProps["returnFocus"];
}
export function OverlayPopup(props: OverlayPopupProps) {
  const { ref, initialFocus, finalFocus, ...elementProps } = props;
  const context = useOverlayContext();
  const position = usePositionContext();
  const hover = context.kind === "tooltip" || context.kind === "preview-card";
  const hoverLeave = useHoverFloatingInteraction(context, () => context.closeDelay.current, true);
  const id = props.id ?? context.popupId;
  useIsoLayoutEffect(() => {
    context.setPopupId(id);
  }, [id, context.setPopupId]);
  const state = {
    open: context.open,
    transitionStatus: context.transitionStatus,
    nested: context.nested,
    nestedDialogOpen: [...context.nestedPopups.values()].some((popup) => popup.open),
    side: position?.side,
    align: position?.align,
  };
  const node = useRenderElement("div", props, {
    state,
    ref: [ref ?? null, context.setPopup],
    stateAttributesMapping: mapping,
    props: [
      {
        id,
        role:
          context.kind === "tooltip"
            ? "tooltip"
            : context.kind === "alert-dialog"
              ? "alertdialog"
              : context.kind === "preview-card"
                ? undefined
                : "dialog",
        "aria-modal": context.modal === true ? true : undefined,
        "aria-labelledby": context.titleId,
        "aria-describedby": context.descriptionId,
        tabIndex: -1,
        hidden: !context.mounted,
        inert: !context.open ? "" : undefined,
        style: {
          "--nested-dialogs": [...context.nestedPopups.values()].filter((popup) => popup.open).length,
          "--transform-origin": position?.refs.floating.current?.style.getPropertyValue("--transform-origin"),
        },
        onPointerEnter() {
          if (hover && !context.disableHoverablePopup) context.cancelTimers();
        },
        onPointerLeave(event: PointerEvent) {
          if (hover && !context.disableHoverablePopup) hoverLeave(event);
        },
        onKeyDown(event: KeyboardEvent) {
          if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key))
            event.stopPropagation();
        },
      },
      getElementProps(elementProps),
    ],
  });
  if (hover) return node;
  return (
    <FloatingFocusManager
      context={context.floatingContext}
      disabled={!context.mounted}
      modal={context.modal !== false}
      outsideElementsInert={context.modal === true}
      referenceInside={context.kind === "combobox"}
      initialFocus={initialFocus ?? ((type) => (type === "touch" ? context.popupRef.current : true))}
      returnFocus={finalFocus}
      restoreFocus="popup"
      closeOnFocusOut={!context.disablePointerDismissal}
      getInsideElements={() => [context.backdrop, context.viewport]}
    >
      {node!}
    </FloatingFocusManager>
  );
}
export namespace OverlayPopup {
  export type Props = OverlayPopupProps;
  export type State = PopupState;
}
export function OverlayBackdrop(props: BaseUIComponentProps<"div", PopupState>) {
  const context = useOverlayContext();
  const state = {
    open: context.open,
    transitionStatus: context.transitionStatus,
    nested: context.nested,
    nestedDialogOpen: false,
  };
  return useRenderElement("div", props, {
    state,
    ref: [props.ref ?? null, context.setBackdrop],
    stateAttributesMapping: mapping,
    props: [
      { role: "presentation", hidden: !context.mounted, style: { pointerEvents: context.open ? undefined : "none" } },
      getElementProps(props),
    ],
  });
}
export namespace OverlayBackdrop {
  export type Props = BaseUIComponentProps<"div", PopupState>;
  export type State = PopupState;
}
export interface OverlayCloseProps extends BaseUIComponentProps<"button", { disabled: boolean }>, NativeButtonProps {}
export function OverlayClose(props: OverlayCloseProps) {
  const { nativeButton = true, disabled = false, ref, ...elementProps } = props;
  const context = useOverlayContext();
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  return useRenderElement("button", props, {
    state: { disabled },
    ref: [ref ?? null, buttonRef],
    props: [
      getButtonProps({
        onClick(event: MouseEvent) {
          context.change(false, event, "close-press");
        },
      }),
      getElementProps(elementProps),
    ],
  });
}
export namespace OverlayClose {
  export type Props = OverlayCloseProps;
}
export function OverlayTitle(props: BaseUIComponentProps<"h2", {}>) {
  const context = useOverlayContext();
  const id = useBaseUiId(props.id);
  useIsoLayoutEffect(() => {
    context.setTitleId(id);
    return () => context.setTitleId(undefined);
  }, [id, context.setTitleId]);
  return useRenderElement("h2", props, { ref: props.ref, props: { ...getElementProps(props), id } });
}
export namespace OverlayTitle {
  export type Props = BaseUIComponentProps<"h2", {}>;
}
export function OverlayDescription(props: BaseUIComponentProps<"p", {}>) {
  const context = useOverlayContext();
  const id = useBaseUiId(props.id);
  useIsoLayoutEffect(() => {
    context.setDescriptionId(id);
    return () => context.setDescriptionId(undefined);
  }, [id, context.setDescriptionId]);
  return useRenderElement("p", props, { ref: props.ref, props: { ...getElementProps(props), id } });
}
export namespace OverlayDescription {
  export type Props = BaseUIComponentProps<"p", {}>;
}
export interface OverlayPositionerProps
  extends
    BaseUIComponentProps<"div", { open: boolean; side: string; align: string; anchorHidden: boolean }>,
    UseAnchorPositioningSharedParameters {}
export function OverlayPositioner(props: OverlayPositionerProps) {
  const {
    anchor,
    side,
    sideOffset,
    align,
    alignOffset,
    collisionBoundary,
    collisionPadding,
    collisionAvoidance,
    positionMethod,
    sticky,
    arrowPadding,
    disableAnchorTracking,
    ref,
    children,
    ...elementProps
  } = props;
  const context = useOverlayContext();
  const position = useAnchorPositioning({
    mounted: context.mounted,
    floatingRootContext: context.floatingContext,
    anchor: anchor ?? context.reference,
    side,
    sideOffset,
    align,
    alignOffset,
    collisionBoundary,
    collisionPadding,
    collisionAvoidance,
    positionMethod,
    sticky,
    arrowPadding,
    disableAnchorTracking,
  });
  const node = useRenderElement("div", props, {
    state: { open: context.open, side: position.side, align: position.align, anchorHidden: position.anchorHidden },
    ref: [ref ?? null, position.refs.setFloating],
    props: [
      {
        role: "presentation",
        hidden: !context.mounted,
        style: { ...position.positionerStyles, pointerEvents: context.open ? undefined : "none" },
        children: <PositionContext.Provider value={position}>{children as ComponentChildren}</PositionContext.Provider>,
      },
      getElementProps(elementProps),
    ],
    stateAttributesMapping: {
      ...popupStateMapping,
      anchorHidden(value: boolean) {
        return value ? { "data-anchor-hidden": "" } : null;
      },
    },
  });
  return node;
}
export namespace OverlayPositioner {
  export type Props = OverlayPositionerProps;
}
export function OverlayArrow(
  props: BaseUIComponentProps<"div", { open: boolean; side: string; align: string; uncentered: boolean }>,
) {
  const context = useOverlayContext();
  const position = usePositionContext();
  const arrow = useRef<Element | null>(null);
  const setArrow = useStableCallback((element: Element | null) => {
    arrow.current = element;
    if (position) position.arrowRef.current = element;
  });
  useIsoLayoutEffect(() => {
    void position?.update();
  }, [position?.isPositioned]);
  return useRenderElement("div", props, {
    ref: [props.ref ?? null, setArrow],
    state: {
      open: context.open,
      side: position?.side ?? "bottom",
      align: position?.align ?? "center",
      uncentered: position?.arrowUncentered ?? false,
    },
    props: [{ "aria-hidden": true, style: position?.arrowStyles }, getElementProps(props)],
    stateAttributesMapping: popupStateMapping,
  });
}
export namespace OverlayArrow {
  export type Props = Parameters<typeof OverlayArrow>[0];
}