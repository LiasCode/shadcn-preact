import { useRef } from "preact/hooks";

import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
import type { BaseUIComponentProps } from "../../internals/types";
import { useOpenChangeComplete } from "../../internals/useOpenChangeComplete";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";
import type { CheckboxRootState } from "../root/CheckboxRoot";
import { useCheckboxRootContext } from "../root/CheckboxRootContext";
import { useStateAttributesMapping } from "../utils/useStateAttributesMapping";
export interface CheckboxIndicatorState extends CheckboxRootState {
  transitionStatus: TransitionStatus;
}
export interface CheckboxIndicatorProps extends BaseUIComponentProps<"span", CheckboxIndicatorState> {
  keepMounted?: boolean;
}
export function CheckboxIndicator(componentProps: CheckboxIndicatorProps) {
  const {
    ref,
    keepMounted = false,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const rootState = useCheckboxRootContext();
  const open = rootState.checked || rootState.indeterminate;
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
  const elementRef = useRef<HTMLElement | null>(null);
  useOpenChangeComplete({
    open,
    ref: elementRef,
    onComplete() {
      if (!open) setMounted(false);
    },
  });
  const element = useRenderElement("span", componentProps, {
    state: { ...rootState, transitionStatus },
    ref: [ref ?? null, elementRef],
    props: elementProps,
    stateAttributesMapping: { ...useStateAttributesMapping(rootState), ...transitionStatusMapping },
  });
  return keepMounted || mounted ? element : null;
}
export declare namespace CheckboxIndicator {
  type Props = CheckboxIndicatorProps;
  type State = CheckboxIndicatorState;
}