import { useCollapsiblePanel } from "../../collapsible/panel/useCollapsiblePanel";
import { useCollapsibleRootContext } from "../../collapsible/root/CollapsibleRootContext";
import { resolveStyle } from "../../internals/resolveStyle";
import type { BaseUIComponentProps } from "../../internals/types";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { TransitionStatus } from "../../internals/useTransitionStatus";
import type { AccordionItemState } from "../item/AccordionItem";
import { useAccordionItemContext } from "../item/AccordionItemContext";
import { accordionStateAttributesMapping } from "../item/stateAttributesMapping";
import { useAccordionRootContext } from "../root/AccordionRootContext";
export interface AccordionPanelState extends AccordionItemState {
  transitionStatus: TransitionStatus;
}
export interface AccordionPanelProps extends BaseUIComponentProps<"div", AccordionPanelState> {
  keepMounted?: boolean;
  hiddenUntilFound?: boolean;
}
export function AccordionPanel(componentProps: AccordionPanelProps) {
  const root = useAccordionRootContext();
  const context = useCollapsibleRootContext();
  const item = useAccordionItemContext();
  const {
    ref,
    id,
    keepMounted = root.keepMounted,
    hiddenUntilFound = root.hiddenUntilFound,
    render: _render,
    className: _className,
    style,
    ...elementProps
  } = componentProps;
  useIsoLayoutEffect(() => {
    if (id) context.setPanelIdState(id);
    return () => context.setPanelIdState(undefined);
  }, [id, context.setPanelIdState]);
  const panel = useCollapsiblePanel(context, hiddenUntilFound, keepMounted);
  const state = { ...item.state, transitionStatus: context.transitionStatus };
  const element = useRenderElement(
    "div",
    { ...componentProps, style: undefined },
    {
      state,
      ref: [ref ?? null, panel.panelRef],
      props: [
        panel.props,
        {
          role: "region",
          "aria-labelledby": item.triggerId,
          style: {
            "--accordion-panel-height": panel.dimensions.height === undefined ? "auto" : `${panel.dimensions.height}px`,
            "--accordion-panel-width": panel.dimensions.width === undefined ? "auto" : `${panel.dimensions.width}px`,
          },
        },
        elementProps,
        { style: resolveStyle(style, state) },
        panel.suppressAnimation ? { style: { animationName: "none" } } : {},
      ],
      stateAttributesMapping: accordionStateAttributesMapping,
    },
  );
  return panel.shouldRender ? element : null;
}
export declare namespace AccordionPanel {
  type Props = AccordionPanelProps;
  type State = AccordionPanelState;
}