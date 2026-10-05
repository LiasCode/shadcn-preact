import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import type { SwitchRootState } from "../root/SwitchRoot";
import { useSwitchRootContext } from "../root/SwitchRootContext";
import { stateAttributesMapping } from "../stateAttributesMapping";

export type SwitchThumbProps = BaseUIComponentProps<"span", SwitchRootState>;

export function SwitchThumb(componentProps: SwitchThumbProps) {
  const {
    ref,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  return useRenderElement("span", componentProps, {
    state: useSwitchRootContext(),
    ref,
    props: elementProps,
    stateAttributesMapping,
  });
}

export declare namespace SwitchThumb {
  type Props = SwitchThumbProps;

  type State = SwitchRootState;
}
