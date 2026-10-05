import type { ComponentChildren } from "preact";

import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { useProgressRootContext, type ProgressRootState } from "../root/ProgressRootContext";
import { progressStateAttributesMapping } from "../root/stateAttributesMapping";

export interface ProgressValueState extends ProgressRootState {}

export interface ProgressValueProps extends Omit<
  BaseUIComponentProps<"span", ProgressValueState>,
  "children"
> {
  children?: null | ((formattedValue: string | null, value: number | null) => ComponentChildren);
}

export function ProgressValue(componentProps: ProgressValueProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    children,
    ...elementProps
  } = componentProps;
  const { state, value, formattedValue } = useProgressRootContext();
  const formattedValueArg = value == null ? "indeterminate" : formattedValue;
  const formattedValueDisplay = value == null ? null : formattedValue;
  return useRenderElement("span", componentProps, {
    state,
    ref,
    props: [
      {
        "aria-hidden": true,
        children:
          typeof children === "function"
            ? children(formattedValueArg, value)
            : formattedValueDisplay,
      },
      elementProps,
    ],
    stateAttributesMapping: progressStateAttributesMapping,
  });
}

export declare namespace ProgressValue {
  type Props = ProgressValueProps;

  type State = ProgressValueState;
}
