import type { CSSProperties, HTMLAttributes } from "preact";
import { useRef, useState } from "preact/hooks";

import { useDirection } from "../../direction-provider";
import { clamp } from "../../internals/clamp";
import { useCompositeListItem } from "../../internals/composite/list/useCompositeListItem";
import type { BaseUIComponentProps, ElementRef } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useMergedRefs } from "../../internals/useMergedRefs";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import { visuallyHidden } from "../../internals/visuallyHidden";
import { mergeProps } from "../../merge-props";
import type { SliderRootState } from "../root/SliderRoot";
import { useSliderRootContext } from "../root/SliderRootContext";
import { sliderStateAttributesMapping } from "../root/stateAttributesMapping";
import { roundValueToStep, getDecimalPrecision } from "../utils/roundValueToStep";
import { script } from "./prehydrationScript.min";
export interface SliderThumbProps extends Omit<
  BaseUIComponentProps<"div", SliderRootState>,
  "onBlur" | "onFocus" | "onKeyDown"
> {
  disabled?: boolean;
  index?: number;
  inputRef?: ElementRef<HTMLInputElement>;
  getAriaLabel?: ((index: number) => string) | null;
  getAriaValueText?: ((formattedValue: string, value: number, index: number) => string) | null;
  onBlur?: HTMLAttributes<HTMLInputElement>["onFocus"];
  onFocus?: HTMLAttributes<HTMLInputElement>["onFocus"];
  onKeyDown?: HTMLAttributes<HTMLInputElement>["onKeyDown"];
}
export function SliderThumb(componentProps: SliderThumbProps) {
  const {
    ref,
    children,
    disabled: disabledProp = false,
    index: indexProp,
    inputRef: inputRefProp,
    getAriaLabel,
    getAriaValueText,
    onBlur,
    onFocus,
    onKeyDown,
    tabIndex,
    id: idProp,
    "aria-label": ariaLabelProp,
    "aria-labelledby": ariaLabelledBy,
    "aria-describedby": ariaDescribedBy,
    "aria-valuetext": ariaValueText,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const context = useSliderRootContext();
  const { min, max, step, minStepsBetweenValues, values, orientation } = context.state;
  const { ref: listRef, index: compositeIndex } = useCompositeListItem();
  const index = indexProp ?? (values.length === 1 ? 0 : compositeIndex);
  const value = values[index] ?? min;
  const disabled = disabledProp || context.state.disabled;
  const direction = useDirection();
  const thumbRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedInputRef = useMergedRefs(inputRef, inputRefProp);
  const id = useBaseUiId(idProp);
  const inputId = useBaseUiId();
  const [labelledBy, setLabelledBy] = useState<string>();
  const [hydrating, setHydrating] = useState(true);
  useIsoLayoutEffect(() => setHydrating(false), []);
  const vertical = orientation === "vertical";
  const update = useStableCallback(() => {
    const thumb = thumbRef.current;
    if (!thumb || index < 0 || context.alignment === "center") return;
    const control = context.controlRef.current;
    if (!control) return;
    const thumbSize = vertical ? thumb.getBoundingClientRect().height : thumb.getBoundingClientRect().width;
    const controlSize = vertical ? control.getBoundingClientRect().height : control.getBoundingClientRect().width;
    const percent = ((value - min) / (max - min)) * 100;
    const position = ((thumbSize / 2 + ((controlSize - thumbSize) * percent) / 100) / controlSize) * 100;
    context.setPosition(index, Number.isFinite(position) ? position : undefined);
  });
  useIsoLayoutEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb || index < 0) return undefined;
    context.thumbs.current.set(index, thumb);
    const input = inputRef.current;
    setLabelledBy(
      [...(input?.labels ?? [])]
        .map((label, i) => {
          if (!label.id) label.id = `${id}-label-${i}`;
          return label.id;
        })
        .join(" ") || undefined,
    );
    const observer =
      typeof window !== "undefined" && typeof ResizeObserver === "function" && context.alignment !== "center"
        ? new ResizeObserver(update)
        : undefined;
    observer?.observe(thumb);
    if (context.controlRef.current) observer?.observe(context.controlRef.current);
    const ownerForm = input?.form;
    const reset = (event: Event) =>
      setTimeout(() => {
        if (!event.defaultPrevented) context.reset();
      });
    ownerForm?.addEventListener("reset", reset);
    return () => {
      context.thumbs.current.delete(index);
      observer?.disconnect();
      ownerForm?.removeEventListener("reset", reset);
    };
  }, [index, context.thumbs, context.reset, id, context.alignment, context.controlRef, update]);
  useIsoLayoutEffect(() => {
    update();
  }, [value, min, max, vertical, index, context.alignment, update]);
  const percent = ((value - min) / (max - min)) * 100;
  const position = context.positions.get(index);
  const inset = context.alignment !== "center";
  const style: CSSProperties = {
    position: "absolute",
    ...(inset ? { "--position": `${position ?? 0}%`, visibility: position === undefined ? "hidden" : undefined } : {}),
    [vertical ? "bottom" : "insetInlineStart"]: inset ? "var(--position)" : `${percent}%`,
    [vertical ? "left" : "top"]: "50%",
    translate: `${vertical || direction !== "rtl" ? -50 : 50}% ${vertical ? 50 : -50}%`,
    zIndex: context.state.activeThumbIndex === index ? 2 : undefined,
  };
  const formatted = new Intl.NumberFormat(context.locale, context.format).format(value);
  const valueText =
    getAriaValueText?.(formatted, value, index) ??
    ariaValueText ??
    (values.length === 2
      ? `${formatted} ${index === 0 ? "start" : "end"} range`
      : context.format
        ? formatted
        : undefined);
  const inputProps = mergeProps<"input">(
    {
      type: "range",
      min,
      max,
      step,
      value,
      name: context.name,
      form: context.form,
      disabled,
      id: inputId,
      "aria-label": getAriaLabel?.(index) ?? ariaLabelProp,
      "aria-labelledby": ariaLabelledBy ?? context.field?.labelId ?? labelledBy,
      "aria-describedby": ariaDescribedBy ?? (context.field?.messages.join(" ") || undefined),
      "aria-invalid": (context.state.valid === false && !disabled) || undefined,
      "aria-orientation": orientation,
      "aria-valuenow": value,
      "aria-valuetext": valueText,
      style: { ...visuallyHidden, width: "100%", height: "100%", writingMode: vertical ? "vertical-lr" : undefined },
      tabIndex,
      onFocus() {
        context.setActive(index);
      },
      onBlur() {
        context.setActive(-1);
      },
      onInput(event) {
        const next = [...context.valuesRef.current];
        next[index] = clamp(event.currentTarget.valueAsNumber, values[index - 1] ?? min, values[index + 1] ?? max);
        if (next.some((entry, i) => i > 0 && entry - next[i - 1]! < step * minStepsBetweenValues - 1e-7)) return;
        if (context.change(next, index, "input-change", event)) context.commit("input-change", event);
        event.currentTarget.value = String(context.valuesRef.current[index] ?? value);
      },
      onKeyDown(event) {
        if (disabled || event.defaultPrevented) return;
        const increment = event.shiftKey ? context.largeStep : step;
        const rounded = roundValueToStep(value, step, min);
        let nextValue: number;
        switch (event.key) {
          case "ArrowUp":
            nextValue = rounded + increment;
            break;
          case "ArrowDown":
            nextValue = rounded - increment;
            break;
          case "ArrowRight":
            nextValue = rounded + (direction === "rtl" ? -increment : increment);
            break;
          case "ArrowLeft":
            nextValue = rounded + (direction === "rtl" ? increment : -increment);
            break;
          case "PageUp":
            nextValue = rounded + context.largeStep;
            break;
          case "PageDown":
            nextValue = rounded - context.largeStep;
            break;
          case "Home":
            nextValue = (values[index - 1] ?? min - step * minStepsBetweenValues) + step * minStepsBetweenValues;
            break;
          case "End":
            nextValue = (values[index + 1] ?? max + step * minStepsBetweenValues) - step * minStepsBetweenValues;
            break;
          default:
            return;
        }
        nextValue = Number(
          nextValue.toFixed(
            Math.max(getDecimalPrecision(value), getDecimalPrecision(increment), getDecimalPrecision(min)),
          ),
        );
        const next = [...context.valuesRef.current];
        next[index] = clamp(nextValue, values[index - 1] ?? min, values[index + 1] ?? max);
        event.preventDefault();
        event.stopPropagation();
        if (next.some((entry, i) => i > 0 && entry - next[i - 1]! < step * minStepsBetweenValues - 1e-7)) return;
        if (context.change(next, index, "keyboard", event)) context.commit("keyboard", event);
      },
    },
    { onFocus, onBlur, onKeyDown } as never,
  );
  return useRenderElement("div", componentProps, {
    state: context.state,
    ref: [ref ?? null, thumbRef, listRef],
    props: [
      {
        id,
        "data-index": index,
        style,
        children: (
          <>
            {children}
            <input {...inputProps} ref={mergedInputRef} />
            {hydrating && context.alignment === "edge" && index === values.length - 1 && (
              <script dangerouslySetInnerHTML={{ __html: script }} />
            )}
          </>
        ),
      },
      elementProps,
    ],
    stateAttributesMapping: sliderStateAttributesMapping,
  });
}
export declare namespace SliderThumb {
  type Props = SliderThumbProps;
  type State = SliderRootState;
}