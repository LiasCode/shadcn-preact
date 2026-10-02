import { useRef, useState } from "preact/hooks";

import { clamp } from "../../internals/clamp";
import { CompositeList } from "../../internals/composite/list/CompositeList";
import {
  createChangeEventDetails,
  createGenericEventDetails,
  type BaseUIGenericEventDetails,
  type BaseUIChangeEventDetails,
} from "../../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, Orientation } from "../../internals/types";
import { useControlled } from "../../internals/useControlled";
import { useBaseUiId } from "../../internals/useId";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import { SliderRootContext } from "./SliderRootContext";
import { sliderStateAttributesMapping } from "./stateAttributesMapping";
export interface SliderRootState {
  activeThumbIndex: number;
  disabled: boolean;
  dragging: boolean;
  max: number;
  min: number;
  minStepsBetweenValues: number;
  orientation: Orientation;
  step: number;
  values: readonly number[];
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}
export interface SliderRootProps<Value extends number | readonly number[]> extends Omit<
  BaseUIComponentProps<"div", SliderRootState>,
  "value"
> {
  value?: Value;
  defaultValue?: Value;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  minStepsBetweenValues?: number;
  largeStep?: number;
  name?: string;
  form?: string;
  orientation?: Orientation;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  thumbAlignment?: "center" | "edge" | "edge-client-only";
  thumbCollisionBehavior?: "push" | "swap" | "none";
  onValueChange?: (value: Value extends number ? number : Value, details: SliderRoot.ChangeEventDetails) => void;
  onValueCommitted?: (value: Value extends number ? number : Value, details: SliderRoot.CommitEventDetails) => void;
}
export function SliderRoot<Value extends number | readonly number[]>(componentProps: SliderRootProps<Value>) {
  const {
    ref,
    value: valueProp,
    defaultValue,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenValues = 0,
    largeStep = 10,
    name,
    form,
    orientation = "horizontal",
    format,
    locale,
    thumbAlignment = "center",
    thumbCollisionBehavior = "push",
    onValueChange,
    onValueCommitted,
    id: idProp,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const [value, setValue] = useControlled<number | readonly number[]>({
    controlled: valueProp,
    default: defaultValue ?? min,
    name: "Slider",
  });
  const range = Array.isArray(value);
  const values = range ? [...value].sort((a, b) => a - b) : [clamp(value as number, min, max)];
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const [, forceSync] = useState(0);
  const [activeThumbIndex, setActive] = useState(-1);
  const [positions, setPositions] = useState(new Map<number, number>());
  const setPosition = useStableCallback((index: number, position: number | undefined) => {
    setPositions((prev) => {
      if (prev.get(index) === position) return prev;
      const next = new Map(prev);
      if (position === undefined) next.delete(index);
      else next.set(index, position);
      return next;
    });
  });
  const [dragging, setDragging] = useState(false);
  const thumbs = useRef(new Map<number, HTMLElement>());
  const controlRef = useRef<HTMLElement | null>(null);
  const id = useBaseUiId(idProp);
  const changedValue = useRef<number[] | null>(null);
  const change = useStableCallback(
    (next: number[], index: number, reason: SliderRoot.ChangeEventReason, event: Event) => {
      if (disabled || next.some(Number.isNaN) || next.every((entry, i) => entry === valuesRef.current[i])) return false;
      const newValue = range ? next : next[0]!;
      const details = createChangeEventDetails(reason, event, undefined, { activeThumbIndex: index });
      const EventConstructor = event.constructor as typeof Event;
      const clonedEvent = new EventConstructor(event.type, event);
      Object.defineProperty(clonedEvent, "target", { value: { value: newValue, name }, writable: true });
      details.event = clonedEvent;
      onValueChange?.(newValue as Value extends number ? number : Value, details);
      if (details.isCanceled) {
        forceSync((tick) => tick + 1);
        return false;
      }
      valuesRef.current = next;
      changedValue.current = next;
      setValue(newValue);
      if (valueProp !== undefined) forceSync((tick) => tick + 1);
      return true;
    },
  );
  const commit = useStableCallback((reason: SliderRoot.CommitEventReason, event: Event) => {
    if (!changedValue.current) return;
    const next = range ? changedValue.current : changedValue.current[0]!;
    onValueCommitted?.(next as Value extends number ? number : Value, createGenericEventDetails(reason, event));
    changedValue.current = null;
  });
  const reset = useStableCallback(() => {
    setValue(defaultValue ?? min);
    forceSync((tick) => tick + 1);
  });
  const state = {
    activeThumbIndex,
    disabled,
    dragging,
    max,
    min,
    minStepsBetweenValues,
    orientation,
    step,
    values,
    valid: null,
    touched: false,
    dirty: false,
    filled: false,
    focused: false,
  };
  const element = useRenderElement("div", componentProps, {
    state,
    ref,
    props: [{ role: "group", id }, elementProps],
    stateAttributesMapping: sliderStateAttributesMapping,
  });
  return (
    <SliderRootContext.Provider
      value={{
        positions,
        setPosition,
        state,
        valuesRef,
        controlRef,
        thumbs,
        alignment: thumbAlignment,
        collision: thumbCollisionBehavior,
        largeStep,
        name,
        form,
        format,
        locale,
        setActive,
        setDragging,
        change,
        commit,
        reset,
      }}
    >
      <CompositeList>{element}</CompositeList>
    </SliderRootContext.Provider>
  );
}
export declare namespace SliderRoot {
  type Props<Value extends number | readonly number[] = number | readonly number[]> = SliderRootProps<Value>;
  type State = SliderRootState;
  type ChangeEventReason = "input-change" | "track-press" | "drag" | "keyboard" | "none";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason, { activeThumbIndex: number }>;
  type CommitEventReason = ChangeEventReason;
  type CommitEventDetails = BaseUIGenericEventDetails<CommitEventReason>;
}