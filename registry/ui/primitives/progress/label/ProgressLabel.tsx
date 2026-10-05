import type { BaseUIComponentProps } from "../../internals/types";
import { useRegisteredLabelId } from "../../internals/useRegisteredLabelId";
import { useRenderElement } from "../../internals/useRenderElement";
import { useProgressRootContext, type ProgressRootState } from "../root/ProgressRootContext";
import { progressStateAttributesMapping } from "../root/stateAttributesMapping";

export interface ProgressLabelState extends ProgressRootState {}

export interface ProgressLabelProps extends BaseUIComponentProps<"span", ProgressLabelState> {}

export function ProgressLabel(componentProps: ProgressLabelProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    id: idProp,
    ...elementProps
  } = componentProps;
  const { state, setLabelId } = useProgressRootContext();
  const id = useRegisteredLabelId(idProp, setLabelId);
  return useRenderElement("span", componentProps, {
    state,
    ref,
    props: [{ id, role: "presentation" }, elementProps],
    stateAttributesMapping: progressStateAttributesMapping,
  });
}

export declare namespace ProgressLabel {
  type Props = ProgressLabelProps;

  type State = ProgressLabelState;
}
