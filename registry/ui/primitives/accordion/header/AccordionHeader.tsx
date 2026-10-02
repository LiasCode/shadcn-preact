import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import type { AccordionItemState } from "../item/AccordionItem";
import { useAccordionItemContext } from "../item/AccordionItemContext";
import { accordionStateAttributesMapping } from "../item/stateAttributesMapping";
export type AccordionHeaderProps = BaseUIComponentProps<"h3", AccordionItemState>;
export function AccordionHeader(componentProps: AccordionHeaderProps) {
  const { ref, render: _render, className: _className, style: _style, ...elementProps } = componentProps;
  return useRenderElement("h3", componentProps, {
    ref,
    state: useAccordionItemContext().state,
    props: elementProps,
    stateAttributesMapping: accordionStateAttributesMapping,
  });
}
export declare namespace AccordionHeader {
  type Props = AccordionHeaderProps;
  type State = AccordionItemState;
}