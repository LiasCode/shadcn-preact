import { useRef, useState } from "preact/hooks";

import type { BaseUIComponentProps, NativeButtonProps } from "../types";
import { useButton } from "../useButton";
import { useHoverFloatingInteraction } from "../useHoverFloatingInteraction";
import { useBaseUiId } from "../useId";
import { useIsoLayoutEffect } from "../useIsoLayoutEffect";
import { useRenderElement } from "../useRenderElement";
import { useStableCallback } from "../useStableCallback";
import { getElementProps } from "./getElementProps";
import { useOverlayContext, popupStateMapping } from "./OverlayContext";
import type { PopupHandle } from "./PopupHandle";
import { useTooltipProvider } from "./TooltipProvider";

export interface OverlayTriggerState {
  open: boolean;
  disabled: boolean;
}

export interface OverlayTriggerProps<Payload = unknown>
  extends BaseUIComponentProps<"button", OverlayTriggerState>, NativeButtonProps {
  handle?: PopupHandle<Payload>;
  payload?: Payload;
  delay?: number;
  closeDelay?: number;
  closeOnClick?: boolean;
  openOnHover?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export function OverlayTrigger<Payload>(props: OverlayTriggerProps<Payload>) {
  const {
    handle: handleProp,
    payload,
    delay,
    closeDelay,
    closeOnClick = true,
    openOnHover = false,
    nativeButton = true,
    disabled = false,
    ref,
    ...elementProps
  } = props;
  const inherited = useOverlayContext(true);
  const handle = handleProp ?? inherited?.handle;
  const [, update] = useState(0);
  useIsoLayoutEffect(() => handle?.subscribe(() => update((version) => version + 1)), [handle]);
  const context = handleProp ? handle?.context : inherited;
  const id = useBaseUiId(props.id);
  const elementRef = useRef<HTMLElement | null>(null);
  const pointerFocus = useRef(false);
  const provider = useTooltipProvider();
  const tooltip = context?.kind === "tooltip";
  const preview = context?.kind === "preview-card";
  const hoverable = tooltip || preview || openOnHover;
  const open = Boolean(
    context?.open && (!context.activeTriggerId || context.activeTriggerId === id),
  );
  const { buttonRef, getButtonProps } = useButton({
    disabled: tooltip ? false : disabled,
    native: nativeButton,
    composite: false,
  });
  const setElement = useStableCallback((element: HTMLElement | null) => {
    elementRef.current = element;

    if (!handle) {
      return;
    }

    if (element) {
      handle.triggers.set(id, { element, payload });

      if (context?.activeTriggerId === id) {
        context.setReference(element);
      }
    } else {
      handle.triggers.delete(id);
    }
  });
  useIsoLayoutEffect(() => {
    const trigger = handle?.triggers.get(id);

    if (trigger) {
      trigger.payload = payload;
    }
  }, [handle, id, payload]);

  const show = (event: Event, focus: boolean) => {
    if (!context || disabled || context.disabled || !elementRef.current) {
      return;
    }

    context.closeDelay.current = closeDelay ?? (preview ? 300 : provider.closeDelay);
    const requestedWait = focus ? 0 : (delay ?? (preview ? 600 : provider.delay));
    const wait = tooltip ? provider.resolveDelay(context.id, requestedWait) : requestedWait;
    context.schedule(
      true,
      event,
      focus ? "trigger-focus" : "trigger-hover",
      wait,
      elementRef.current,
      payload,
    );
  };

  useIsoLayoutEffect(() => {
    if (!tooltip || !context) {
      return undefined;
    }

    if (open) {
      provider.activate(context.id, () => context.change(false, new Event("base-ui"), "none"));
    } else {
      provider.deactivate(context.id);
    }

    return () => {
      if (open) {
        provider.deactivate(context.id);
      }
    };
  }, [tooltip, open, context?.id, provider]);
  const hoverLeave = useHoverFloatingInteraction(
    context ?? null,
    () => closeDelay ?? (preview ? 300 : provider.closeDelay),
  );
  const state = { open, disabled };
  const handlers = {
    id,
    "aria-haspopup": tooltip || preview ? undefined : ("dialog" as const),
    "aria-expanded": tooltip || preview ? undefined : open,
    "aria-controls": !tooltip && context?.mounted ? context.popupId : undefined,
    "aria-describedby": tooltip && open ? context?.popupId : undefined,
    onClick(event: MouseEvent) {
      if (!context || disabled || context.disabled || !elementRef.current) {
        return;
      }

      if (tooltip) {
        context.cancelTimers();

        if (closeOnClick) {
          context.change(false, event, "trigger-press");
        }
      } else if (!preview) {
        context.change(!open, event, "trigger-press", elementRef.current, payload);
      }
    },
    onPointerEnter(event: PointerEvent) {
      if (hoverable && event.pointerType !== "touch") {
        show(event, false);
      }
    },
    onPointerLeave(event: PointerEvent) {
      if (!hoverable || !context || event.pointerType === "touch") {
        return;
      }

      hoverLeave(event);
    },
    onFocus(event: FocusEvent) {
      if (hoverable && (!tooltip || !pointerFocus.current)) {
        show(event, true);
      }
    },
    onBlur(event: FocusEvent) {
      pointerFocus.current = false;

      if (
        !context ||
        !hoverable ||
        context.popupRef.current?.contains(event.relatedTarget as Node)
      ) {
        return;
      }

      context.schedule(
        false,
        event,
        "trigger-focus",
        closeDelay ?? (preview ? 300 : provider.closeDelay),
      );
    },
    onPointerDown(event: PointerEvent) {
      pointerFocus.current = true;

      if (tooltip && event.pointerType === "touch") {
        context?.cancelTimers();
      }
    },
  };
  // PreviewCard's default element is an anchor; Tooltip does not impose button semantics on render overrides.
  return useRenderElement(preview ? "a" : "button", props, {
    state,
    ref: [ref ?? null, setElement, tooltip || preview ? null : buttonRef],
    props: [
      tooltip || preview ? handlers : getButtonProps(handlers),
      getElementProps(elementProps),
    ],
    stateAttributesMapping: popupStateMapping,
  });
}

export namespace OverlayTrigger {
  export type Props<Payload = unknown> = OverlayTriggerProps<Payload>;

  export type State = OverlayTriggerState;
}
