import type { BaseUIComponentProps, Orientation } from "../internals/types";
import { useRenderElement } from "../internals/useRenderElement";
export interface SeparatorState {
  orientation: Orientation;
}
export interface SeparatorProps extends BaseUIComponentProps<"div", SeparatorState> {
  orientation?: Orientation;
}
export function Separator(componentProps: SeparatorProps) {
  const {
    ref,
    render: _render,
    className: _className,
    style: _style,
    orientation = "horizontal",
    ...elementProps
  } = componentProps;
  return useRenderElement("div", componentProps, {
    state: { orientation },
    ref,
    props: [{ role: "separator", "aria-orientation": orientation }, elementProps],
  });
}
export declare namespace Separator {
  type State = SeparatorState;
  type Props = SeparatorProps;
}