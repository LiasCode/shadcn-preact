import { resolveStyle } from "../../internals/resolveStyle";
import type { BaseUIComponentProps } from "../../internals/types";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { CollapsibleRootState } from "../root/CollapsibleRoot";
import { useCollapsibleRootContext } from "../root/CollapsibleRootContext";
import { collapsibleStateAttributesMapping } from "../root/stateAttributesMapping";
import { useCollapsiblePanel } from "./useCollapsiblePanel";

export interface CollapsiblePanelProps extends BaseUIComponentProps<"div", CollapsibleRootState> {
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
}

export function CollapsiblePanel(componentProps: CollapsiblePanelProps) {
  const {
    ref,
    hiddenUntilFound = false,
    keepMounted = false,
    id,
    render: _render,
    className: _className,
    style,
    ...elementProps
  } = componentProps;
  const context = useCollapsibleRootContext();
  useIsoLayoutEffect(() => {
    if (id) {
      context.setPanelIdState(id);
    }

    return () => context.setPanelIdState(undefined);
  }, [id, context.setPanelIdState]);
  const panel = useCollapsiblePanel(context, hiddenUntilFound, keepMounted);
  const element = useRenderElement(
    "div",
    { ...componentProps, style: undefined },
    {
      state: context.state,
      ref: [ref ?? null, panel.panelRef],
      props: [
        panel.props,
        {
          style: {
            "--collapsible-panel-height":
              panel.dimensions.height === undefined ? "auto" : `${panel.dimensions.height}px`,
            "--collapsible-panel-width":
              panel.dimensions.width === undefined ? "auto" : `${panel.dimensions.width}px`,
          },
        },
        elementProps,
        { style: resolveStyle(style, context.state) },
        panel.suppressAnimation ? { style: { animationName: "none" } } : {},
      ],
      stateAttributesMapping: collapsibleStateAttributesMapping,
    },
  );
  return panel.shouldRender ? element : null;
}

export declare namespace CollapsiblePanel {
  type Props = CollapsiblePanelProps;

  type State = CollapsibleRootState;
}
