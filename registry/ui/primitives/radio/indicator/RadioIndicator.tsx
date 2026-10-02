import { useRef } from "preact/hooks";

import { transitionStatusMapping } from "../../internals/stateAttributesMapping";
import type { BaseUIComponentProps } from "../../internals/types";
import { useOpenChangeComplete } from "../../internals/useOpenChangeComplete";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";
import type { RadioRootState } from "../root/RadioRoot";
import { useRadioRootContext } from "../root/RadioRootContext";
import { stateAttributesMapping } from "../utils/stateAttributesMapping";
export interface RadioIndicatorState extends RadioRootState {
  transitionStatus: TransitionStatus;
}
export interface RadioIndicatorProps extends BaseUIComponentProps<"span", RadioIndicatorState> {
  keepMounted?: boolean;
}
export function RadioIndicator(componentProps: RadioIndicatorProps) {
  const {
    ref,
    keepMounted = false,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const rootState = useRadioRootContext();
  const open = rootState.checked;
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
    stateAttributesMapping: { ...stateAttributesMapping, ...transitionStatusMapping },
  });
  return keepMounted || mounted ? element : null;
}
export declare namespace RadioIndicator {
  type Props = RadioIndicatorProps;
  type State = RadioIndicatorState;
}