import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { useProgressRootContext, type ProgressRootState } from "../root/ProgressRootContext";
import { progressStateAttributesMapping } from "../root/stateAttributesMapping";

export interface ProgressTrackState extends ProgressRootState {}

export interface ProgressTrackProps extends BaseUIComponentProps<"div", ProgressTrackState> {}

export function ProgressTrack(componentProps: ProgressTrackProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    ...elementProps
  } = componentProps;
  const { state } = useProgressRootContext();
  return useRenderElement("div", componentProps, {
    state,
    ref,
    props: elementProps,
    stateAttributesMapping: progressStateAttributesMapping,
  });
}

export declare namespace ProgressTrack {
  type Props = ProgressTrackProps;

  type State = ProgressTrackState;
}
