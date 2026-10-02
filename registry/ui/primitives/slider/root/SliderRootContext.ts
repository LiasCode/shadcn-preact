import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { SliderRootState, SliderRoot } from "./SliderRoot";
export interface SliderContext {
  positions: Map<number, number>;
  setPosition(index: number, value: number | undefined): void;
  state: SliderRootState;
  valuesRef: { current: number[] };
  controlRef: { current: HTMLElement | null };
  thumbs: { current: Map<number, HTMLElement> };
  alignment: "center" | "edge" | "edge-client-only";
  collision: "push" | "swap" | "none";
  largeStep: number;
  name?: string;
  form?: string;
  format?: Intl.NumberFormatOptions;
  locale?: Intl.LocalesArgument;
  setActive(index: number): void;
  setDragging(dragging: boolean): void;
  change(values: number[], index: number, reason: SliderRoot.ChangeEventReason, event: Event): boolean;
  commit(reason: SliderRoot.CommitEventReason, event: Event): void;
  reset(): void;
}
export const SliderRootContext = createContext<SliderContext | undefined>(undefined);
export function useSliderRootContext() {
  const context = useContext(SliderRootContext);
  if (!context) throw new Error("Base UI: Slider parts must be used within Slider.Root.");
  return context;
}