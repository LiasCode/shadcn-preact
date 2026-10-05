import type { CSSProperties } from "preact";

import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import type { SliderRootState } from "../root/SliderRoot";
import { useSliderRootContext } from "../root/SliderRootContext";
import { sliderStateAttributesMapping } from "../root/stateAttributesMapping";

export type SliderIndicatorProps = BaseUIComponentProps<"div", SliderRootState>;

export function SliderIndicator(componentProps: SliderIndicatorProps) {
  const {
    ref,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const context = useSliderRootContext();
  const { min, max, values, orientation } = context.state;
  const vertical = orientation === "vertical";
  const range = values.length > 1;
  const inset = context.alignment !== "center";
  const start = inset ? context.positions.get(0) : ((values[0]! - min) / (max - min)) * 100;
  const end = inset
    ? context.positions.get(values.length - 1)
    : ((values[values.length - 1]! - min) / (max - min)) * 100;
  const style: CSSProperties = {
    position: vertical ? "absolute" : "relative",
    [vertical ? "width" : "height"]: "inherit",
    ...(inset
      ? {
          "--start-position": `${start ?? 0}%`,
          "--relative-size": `${(end ?? 0) - (start ?? 0)}%`,
          visibility: start === undefined || (range && end === undefined) ? "hidden" : undefined,
        }
      : {}),
    [vertical ? "bottom" : "insetInlineStart"]: range
      ? inset
        ? "var(--start-position)"
        : `${start}%`
      : 0,
    [vertical ? "height" : "width"]: inset
      ? range
        ? "var(--relative-size)"
        : "var(--start-position)"
      : `${range ? end! - start! : start}%`,
  };
  return useRenderElement("div", componentProps, {
    state: context.state,
    ref,
    props: [
      { style, "data-base-ui-slider-indicator": context.alignment === "edge" ? "" : undefined },
      elementProps,
    ],
    stateAttributesMapping: sliderStateAttributesMapping,
  });
}

export declare namespace SliderIndicator {
  type Props = SliderIndicatorProps;

  type State = SliderRootState;
}
