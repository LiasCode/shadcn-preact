import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import type { SliderRootState } from "../root/SliderRoot";
import { useSliderRootContext } from "../root/SliderRootContext";
import { sliderStateAttributesMapping } from "../root/stateAttributesMapping";

export type SliderTrackProps = BaseUIComponentProps<"div", SliderRootState>;

export function SliderTrack(componentProps: SliderTrackProps) {
  const {
    ref,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  return useRenderElement("div", componentProps, {
    state: useSliderRootContext().state,
    ref,
    props: [{ style: { position: "relative" } }, elementProps],
    stateAttributesMapping: sliderStateAttributesMapping,
  });
}

export declare namespace SliderTrack {
  type Props = SliderTrackProps;

  type State = SliderRootState;
}
