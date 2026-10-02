import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { valueToPercent } from "../../internals/valueToPercent";
import { useProgressRootContext, type ProgressRootState } from "../root/ProgressRootContext";
import { progressStateAttributesMapping } from "../root/stateAttributesMapping";
export interface ProgressIndicatorState extends ProgressRootState {}
export interface ProgressIndicatorProps extends BaseUIComponentProps<"div", ProgressIndicatorState> {}
export function ProgressIndicator(componentProps: ProgressIndicatorProps) {
  const { ref, className: _className, render: _render, style: _style, ...elementProps } = componentProps;
  const { state, value, min, max } = useProgressRootContext();
  const percentageValue = Number.isFinite(value) && value !== null ? valueToPercent(value, min, max) : null;
  const indicatorStyle =
    percentageValue == null ? {} : { insetInlineStart: 0, height: "inherit", width: `${percentageValue}%` };
  return useRenderElement("div", componentProps, {
    state,
    ref,
    props: [{ style: indicatorStyle }, elementProps],
    stateAttributesMapping: progressStateAttributesMapping,
  });
}
export declare namespace ProgressIndicator {
  type Props = ProgressIndicatorProps;
  type State = ProgressIndicatorState;
}