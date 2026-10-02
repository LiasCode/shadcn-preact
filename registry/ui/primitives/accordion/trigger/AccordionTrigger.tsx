import { useCollapsibleRootContext } from "../../collapsible/root/CollapsibleRootContext";
import { triggerOpenStateMapping } from "../../collapsible/root/stateAttributesMapping";
import type { BaseUIComponentProps, NativeButtonProps } from "../../internals/types";
import { useButton } from "../../internals/useButton";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { AccordionItemState } from "../item/AccordionItem";
import { useAccordionItemContext } from "../item/AccordionItemContext";
export interface AccordionTriggerProps extends NativeButtonProps, BaseUIComponentProps<"button", AccordionItemState> {}
export function AccordionTrigger(componentProps: AccordionTriggerProps) {
  const context = useCollapsibleRootContext();
  const item = useAccordionItemContext();
  const {
    ref,
    id,
    disabled: disabledProp,
    nativeButton = true,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const disabled = disabledProp || context.disabled;
  const { getButtonProps, buttonRef } = useButton({ disabled, native: nativeButton, focusableWhenDisabled: true });
  useIsoLayoutEffect(() => {
    if (id) item.setTriggerId(id);
    return () => item.setTriggerId(undefined);
  }, [id, item.setTriggerId]);
  return useRenderElement("button", componentProps, {
    state: item.state,
    ref: [ref ?? null, buttonRef],
    props: [
      {
        id: item.triggerId,
        "aria-expanded": context.open,
        "aria-controls": context.open ? context.panelId : undefined,
        onClick: context.handleTrigger,
      },
      elementProps,
      getButtonProps,
    ],
    stateAttributesMapping: triggerOpenStateMapping,
  });
}
export declare namespace AccordionTrigger {
  type Props = AccordionTriggerProps;
  type State = AccordionItemState;
}