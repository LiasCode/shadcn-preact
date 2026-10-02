import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import type { TransitionStatus } from "../../internals/useTransitionStatus";
import { CollapsibleRootContext } from "./CollapsibleRootContext";
import { collapsibleStateAttributesMapping } from "./stateAttributesMapping";
import { useCollapsibleRoot, type UseCollapsibleRootParameters } from "./useCollapsibleRoot";
export interface CollapsibleRootState {
  open: boolean;
  disabled: boolean;
  transitionStatus: TransitionStatus;
}
export interface CollapsibleRootProps
  extends BaseUIComponentProps<"div", CollapsibleRootState>, UseCollapsibleRootParameters {}
export function CollapsibleRoot(componentProps: CollapsibleRootProps) {
  const {
    ref,
    open: _open,
    defaultOpen: _defaultOpen,
    disabled: _disabled,
    onOpenChange,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const collapsible = useCollapsibleRoot(componentProps);
  const state = {
    open: collapsible.open,
    disabled: collapsible.disabled,
    transitionStatus: collapsible.transitionStatus,
  };
  const element = useRenderElement("div", componentProps, {
    state,
    ref,
    props: elementProps,
    stateAttributesMapping: collapsibleStateAttributesMapping,
  });
  return (
    <CollapsibleRootContext.Provider value={{ ...collapsible, state, onOpenChange }}>
      {element}
    </CollapsibleRootContext.Provider>
  );
}
export declare namespace CollapsibleRoot {
  type Props = CollapsibleRootProps;
  type State = CollapsibleRootState;
  type ChangeEventReason = "trigger-press" | "none";
  type ChangeEventDetails = Parameters<NonNullable<UseCollapsibleRootParameters["onOpenChange"]>>[1];
}