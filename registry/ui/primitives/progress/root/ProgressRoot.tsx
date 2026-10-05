import { useMemo, useState } from "preact/hooks";

import { formatNumberValue } from "../../internals/formatNumber";
import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { visuallyHidden } from "../../internals/visuallyHidden";
import {
  ProgressRootContext,
  type ProgressRootState,
  type ProgressStatus,
} from "./ProgressRootContext";
import { progressStateAttributesMapping } from "./stateAttributesMapping";
export type { ProgressRootState, ProgressStatus } from "./ProgressRootContext";

export interface ProgressRootProps extends BaseUIComponentProps<"div", ProgressRootState> {
  format?: Intl.NumberFormatOptions;
  getAriaValueText?: (formattedValue: string | null, value: number | null) => string;
  locale?: Intl.LocalesArgument;
  max?: number;
  min?: number;
  value: number | null;
}

function getDefaultAriaValueText(formattedValue: string | null, value: number | null) {
  return value == null ? "indeterminate progress" : formattedValue || `${value}%`;
}

export function ProgressRoot(componentProps: ProgressRootProps) {
  const {
    ref,
    className: _className,
    render: _render,
    style: _style,
    format,
    getAriaValueText = getDefaultAriaValueText,
    locale,
    max = 100,
    min = 0,
    value,
    children,
    ...elementProps
  } = componentProps;
  const [labelId, setLabelId] = useState<string>();
  const status: ProgressStatus = Number.isFinite(value)
    ? value === max
      ? "complete"
      : "progressing"
    : "indeterminate";
  const formattedValue = formatNumberValue(value, locale, format);
  const state = useMemo(() => ({ status }), [status]);
  const contextValue = useMemo(
    () => ({ formattedValue, max, min, setLabelId, state, status, value }),
    [formattedValue, max, min, state, status, value],
  );
  const element = useRenderElement("div", componentProps, {
    state,
    ref,
    props: [
      {
        role: "progressbar",
        "aria-labelledby": labelId,
        "aria-valuemax": max,
        "aria-valuemin": min,
        "aria-valuenow": value ?? undefined,
        "aria-valuetext": getAriaValueText(formattedValue, value),
        children: (
          <>
            {children}
            <span role="presentation" style={visuallyHidden}>
              x
            </span>
          </>
        ),
      },
      elementProps,
    ],
    stateAttributesMapping: progressStateAttributesMapping,
  });
  return (
    <ProgressRootContext.Provider value={contextValue}>{element}</ProgressRootContext.Provider>
  );
}

export declare namespace ProgressRoot {
  type Props = ProgressRootProps;

  type State = ProgressRootState;
}
