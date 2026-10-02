import { useEffect, useRef } from "preact/hooks";

import { useDirection } from "../../direction-provider";
import { clamp } from "../../internals/clamp";
import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import type { SliderRootState, SliderRoot } from "../root/SliderRoot";
import { useSliderRootContext } from "../root/SliderRootContext";
import { sliderStateAttributesMapping } from "../root/stateAttributesMapping";
import { resolveThumbCollision } from "../utils/resolveThumbCollision";
import { roundValueToStep } from "../utils/roundValueToStep";
export type SliderControlProps = BaseUIComponentProps<"div", SliderRootState>;
export function SliderControl(componentProps: SliderControlProps) {
  const { ref, render: _render, className: _className, style: _style, ...elementProps } = componentProps;
  const context = useSliderRootContext();
  const direction = useDirection();
  const interaction = useRef<{
    pointerId: number;
    index: number;
    offset: number;
    initial: number[];
    reason: SliderRoot.CommitEventReason;
    document: Document;
  } | null>(null);
  const setPointerValue = useStableCallback((event: PointerEvent, reason: "drag" | "track-press") => {
    const control = context.controlRef.current;
    const press = interaction.current;
    if (!control || !press) return;
    const { min, max, step, minStepsBetweenValues, orientation } = context.state;
    const vertical = orientation === "vertical";
    const rect = control.getBoundingClientRect();
    const thumb = context.thumbs.current.get(press.index);
    const thumbRect = thumb?.getBoundingClientRect();
    const inset =
      context.alignment !== "center" ? (vertical ? (thumbRect?.height ?? 0) : (thumbRect?.width ?? 0)) / 2 : 0;
    const styles = control.ownerDocument.defaultView!.getComputedStyle(control);
    const startOffset = parseFloat(vertical ? styles.paddingBottom : styles.paddingInlineStart) || 0;
    const endOffset = parseFloat(vertical ? styles.paddingTop : styles.paddingInlineEnd) || 0;
    const length = (vertical ? rect.height : rect.width) - 2 * inset - startOffset - endOffset;
    if (length <= 0) return;
    const coordinate = vertical
      ? rect.bottom - (event.clientY - press.offset)
      : direction === "rtl"
        ? rect.right - (event.clientX - press.offset)
        : event.clientX - press.offset - rect.left;
    const next = clamp(
      roundValueToStep(min + clamp((coordinate - inset - startOffset) / length, 0, 1) * (max - min), step, min),
      min,
      max,
    );
    const collision = resolveThumbCollision({
      behavior: context.collision,
      values: context.state.values,
      currentValues: context.valuesRef.current,
      initialValues: press.initial,
      pressedIndex: press.index,
      nextValue: next,
      min,
      max,
      step,
      minStepsBetweenValues,
    });
    const values = typeof collision.value === "number" ? [collision.value] : collision.value;
    if (context.change(values, collision.thumbIndex, reason, event)) {
      press.reason = reason;
      if (collision.didSwap) {
        press.index = collision.thumbIndex;
        context.thumbs.current.get(press.index)?.querySelector("input")?.focus({ preventScroll: true });
      }
    }
  });
  const stop = useStableCallback((event?: PointerEvent) => {
    const press = interaction.current;
    if (!press) return;
    press.document.removeEventListener("pointermove", move);
    press.document.removeEventListener("pointerup", end);
    press.document.removeEventListener("pointercancel", cancel);
    const control = context.controlRef.current;
    if (control?.hasPointerCapture?.(press.pointerId)) control.releasePointerCapture(press.pointerId);
    interaction.current = null;
    context.setDragging(false);
    context.setActive(-1);
    if (event) context.commit(press.reason, event);
  });
  const move = useStableCallback((event: PointerEvent) => {
    if (event.pointerId !== interaction.current?.pointerId) return;
    if (event.pointerType === "mouse" && event.buttons === 0) {
      stop(event);
      return;
    }
    setPointerValue(event, "drag");
  });
  const end = useStableCallback((event: PointerEvent) => {
    if (event.pointerId === interaction.current?.pointerId) stop(event);
  });
  const cancel = useStableCallback((event: PointerEvent) => {
    if (event.pointerId === interaction.current?.pointerId) stop();
  });
  useEffect(() => () => stop(), [stop]);
  useEffect(() => {
    if (context.state.disabled) stop();
  }, [context.state.disabled, stop]);
  return useRenderElement("div", componentProps, {
    state: context.state,
    ref: [ref ?? null, context.controlRef],
    stateAttributesMapping: sliderStateAttributesMapping,
    props: [
      {
        style: { touchAction: "none" },
        "data-base-ui-slider-control": context.alignment === "edge" ? "" : undefined,
        onPointerDown(event: PointerEvent) {
          if (context.state.disabled || event.defaultPrevented || event.button !== 0 || interaction.current) return;
          const target = event.target as HTMLElement;
          const vertical = context.state.orientation === "vertical";
          let index = -1;
          let distance = Infinity;
          let offset = 0;
          let pressedThumb = false;
          for (const [thumbIndex, thumb] of context.thumbs.current) {
            const input = thumb.querySelector("input");
            if (thumb.contains(target)) {
              if (input?.disabled) return;
              index = thumbIndex;
              pressedThumb = true;
              const rect = thumb.getBoundingClientRect();
              offset = vertical
                ? event.clientY - (rect.top + rect.height / 2)
                : event.clientX - (rect.left + rect.width / 2);
              break;
            }
            if (input?.disabled) continue;
            const rect = thumb.getBoundingClientRect();
            const delta = Math.abs(
              vertical ? event.clientY - (rect.top + rect.height / 2) : event.clientX - (rect.left + rect.width / 2),
            );
            if (delta <= distance) {
              distance = delta;
              index = thumbIndex;
            }
          }
          if (index < 0) return;
          const control = context.controlRef.current!;
          const document = control.ownerDocument;
          interaction.current = {
            pointerId: event.pointerId,
            index,
            offset,
            initial: [...context.valuesRef.current],
            reason: "track-press",
            document,
          };
          document.addEventListener("pointermove", move);
          document.addEventListener("pointerup", end);
          document.addEventListener("pointercancel", cancel);
          control.setPointerCapture?.(event.pointerId);
          context.setActive(index);
          context.setDragging(true);
          event.preventDefault();
          context.thumbs.current.get(index)?.querySelector("input")?.focus({ preventScroll: true });
          if (!pressedThumb) setPointerValue(event, "track-press");
        },
      },
      elementProps,
    ],
  });
}
export declare namespace SliderControl {
  type Props = SliderControlProps;
  type State = SliderRootState;
}