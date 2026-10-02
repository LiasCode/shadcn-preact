import { useState } from "preact/hooks";

import { CollapsibleRootContext } from "../../collapsible/root/CollapsibleRootContext";
import { useCollapsibleRoot, type UseCollapsibleRootParameters } from "../../collapsible/root/useCollapsibleRoot";
import { useCompositeListItem } from "../../internals/composite/list/useCompositeListItem";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import type { AccordionRootState } from "../root/AccordionRoot";
import { useAccordionRootContext } from "../root/AccordionRootContext";
import { AccordionItemContext } from "./AccordionItemContext";
import { accordionStateAttributesMapping } from "./stateAttributesMapping";
export interface AccordionItemState extends AccordionRootState {
  hidden: boolean;
  index: number;
  open: boolean;
}
export interface AccordionItemProps extends BaseUIComponentProps<"div", AccordionItemState> {
  value?: any;
  disabled?: boolean;
  onOpenChange?: UseCollapsibleRootParameters["onOpenChange"];
}
export function AccordionItem(componentProps: AccordionItemProps) {
  const {
    ref,
    value: valueProp,
    disabled: disabledProp = false,
    onOpenChange: onOpenChangeProp,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const root = useAccordionRootContext();
  const { ref: listRef, index } = useCompositeListItem();
  const fallbackValue = useBaseUiId();
  const value = valueProp ?? fallbackValue;
  const disabled = root.state.disabled || disabledProp;
  const open = root.state.value.includes(value);
  const onOpenChange = useStableCallback((next: boolean, details: AccordionItem.ChangeEventDetails) => {
    onOpenChangeProp?.(next, details);
    if (!details.isCanceled) root.handleValueChange(value, next, details);
  });
  const collapsible = useCollapsibleRoot({ open, disabled, onOpenChange });
  const collapsibleState = { open, disabled, transitionStatus: collapsible.transitionStatus };
  const state = { ...root.state, hidden: !open && !collapsible.mounted, index, disabled, open };
  const defaultTriggerId = useBaseUiId();
  const [triggerId, setTriggerId] = useState<string>();
  const element = useRenderElement("div", componentProps, {
    state,
    ref: [ref ?? null, listRef],
    props: elementProps,
    stateAttributesMapping: accordionStateAttributesMapping,
  });
  return (
    <CollapsibleRootContext.Provider value={{ ...collapsible, state: collapsibleState, onOpenChange }}>
      <AccordionItemContext.Provider value={{ state, triggerId: triggerId ?? defaultTriggerId, setTriggerId }}>
        {element}
      </AccordionItemContext.Provider>
    </CollapsibleRootContext.Provider>
  );
}
export declare namespace AccordionItem {
  type Props = AccordionItemProps;
  type State = AccordionItemState;
  type ChangeEventReason = "trigger-press" | "none";
  type ChangeEventDetails = Parameters<NonNullable<UseCollapsibleRootParameters["onOpenChange"]>>[1];
}