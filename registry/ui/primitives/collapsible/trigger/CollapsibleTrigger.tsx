import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
import type { BaseUIComponentProps, NativeButtonProps } from "../../internals/types";
import { useButton } from "../../internals/useButton";
import { useRenderElement } from "../../internals/useRenderElement";
import type { CollapsibleRootState } from "../root/CollapsibleRoot";
import { useCollapsibleRootContext } from "../root/CollapsibleRootContext";
import { triggerOpenStateMapping } from "../root/stateAttributesMapping";

export interface CollapsibleTriggerProps
  extends NativeButtonProps, BaseUIComponentProps<"button", CollapsibleRootState> {}

export function CollapsibleTrigger(componentProps: CollapsibleTriggerProps) {
  const context = useCollapsibleRootContext();
  const {
    ref,
    disabled = context.disabled,
    nativeButton = true,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
    focusableWhenDisabled: true,
  });
  return useRenderElement("button", componentProps, {
    state: context.state,
    ref: [ref ?? null, buttonRef],
    props: [
      {
        "aria-controls": context.open ? context.panelId : undefined,
        "aria-expanded": context.open,
        onClick: context.handleTrigger,
      },
      elementProps,
      getButtonProps,
    ],
    stateAttributesMapping: { ...triggerOpenStateMapping, ...transitionStatusMapping },
  });
}

export declare namespace CollapsibleTrigger {
  type Props = CollapsibleTriggerProps;

  type State = CollapsibleRootState;
}
