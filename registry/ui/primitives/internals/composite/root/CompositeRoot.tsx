import { useRef, useState } from "preact/hooks";

import { useDirection } from "../../../direction-provider";
import type { StateAttributesMapping } from "../../getStateAttributesProps";
import type { BaseUIComponentProps, ElementRef } from "../../types";
import { useIsoLayoutEffect } from "../../useIsoLayoutEffect";
import { useRenderElement } from "../../useRenderElement";
import { useStableCallback } from "../../useStableCallback";
import { CompositeList } from "../list/CompositeList";
import { CompositeRootContext } from "./CompositeRootContext";

export interface CompositeRootProps<State extends Record<string, any>> extends BaseUIComponentProps<
  "div",
  State
> {
  tag?: string;
  state?: State;
  props?: Record<string, any>[];
  refs?: ElementRef<any>[];
  stateAttributesMapping?: StateAttributesMapping<State>;
  orientation?: "horizontal" | "vertical" | "both";
  loopFocus?: boolean;
  enableHomeAndEndKeys?: boolean;
  highlightedIndex?: number;
  onHighlightedIndexChange?: (index: number) => void;
  stopEventPropagation?: boolean;
  modifierKeys?: string[];
  disabledIndices?: number[];
  highlightItemOnHover?: boolean;
}

export function CompositeRoot<State extends Record<string, any>>(
  componentProps: CompositeRootProps<State>,
) {
  const {
    tag = "div",
    state = {} as State,
    props = [],
    refs = [],
    stateAttributesMapping,
    orientation = "both",
    loopFocus = true,
    enableHomeAndEndKeys = false,
    highlightedIndex: controlledIndex,
    onHighlightedIndexChange,
    stopEventPropagation = true,
    highlightItemOnHover = false,
    disabledIndices,
    modifierKeys = [],
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const direction = useDirection();
  const rootRef = useRef<HTMLElement | null>(null);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const [internalIndex, setInternalIndex] = useState(0);
  const highlightedIndex = controlledIndex ?? internalIndex;
  const changeIndex = useStableCallback((index: number) => {
    if (onHighlightedIndexChange) {
      onHighlightedIndexChange(index);
    } else {
      setInternalIndex(index);
    }
  });

  const disabledAt = (index: number) =>
    disabledIndices ? disabledIndices.includes(index) : isDisabled(elements[index]);

  const initialized = useRef(false);
  useIsoLayoutEffect(() => {
    if (!elements.length) {
      return;
    }

    if (!initialized.current) {
      initialized.current = true;
      const active = elements.findIndex((node) => node.hasAttribute("data-composite-item-active"));
      const firstEnabled = elements.findIndex((node) => !isDisabled(node));

      if (active !== -1) {
        changeIndex(active);
      } else if (disabledAt(highlightedIndex) && firstEnabled !== -1) {
        changeIndex(firstEnabled);
      }
    } else if (highlightedIndex >= elements.length) {
      const lastEnabled = elements.findLastIndex((node) => !isDisabled(node));

      if (lastEnabled !== -1) {
        changeIndex(lastEnabled);
      }
    }
  }, [elements, highlightedIndex, changeIndex]);
  const element = useRenderElement(tag, componentProps, {
    state,
    ref: [rootRef, ...refs],
    stateAttributesMapping,
    props: [
      {
        onKeyDown(event: KeyboardEvent) {
          if (
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            (event.shiftKey && !modifierKeys.includes("Shift"))
          ) {
            return;
          }

          const target = event.target as HTMLElement;

          if (target.isContentEditable) {
            return;
          }

          const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
          const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

          if (
            target.tagName === "TEXTAREA" ||
            (target.tagName === "INPUT" && (target as HTMLInputElement).selectionStart != null)
          ) {
            const input = target as HTMLInputElement;
            const start = input.selectionStart;
            const forwardKey = orientation === "vertical" ? "ArrowDown" : forward;
            const backwardKey = orientation === "vertical" ? "ArrowUp" : backward;

            if (start == null || event.shiftKey || start !== input.selectionEnd) {
              return;
            }

            if (event.key !== backwardKey && start < input.value.length) {
              return;
            }

            if (event.key !== forwardKey && start > 0) {
              return;
            }
          }

          const delta =
            (orientation !== "vertical" && event.key === forward) ||
            (orientation !== "horizontal" && event.key === "ArrowDown")
              ? 1
              : (orientation !== "vertical" && event.key === backward) ||
                  (orientation !== "horizontal" && event.key === "ArrowUp")
                ? -1
                : 0;
          const home = enableHomeAndEndKeys && event.key === "Home";
          const end = enableHomeAndEndKeys && event.key === "End";

          if (!delta && !home && !end) {
            return;
          }

          let next = home ? 0 : end ? elements.length - 1 : highlightedIndex + delta;
          const step = end ? -1 : delta || 1;

          for (let count = 0; count < elements.length; count++, next += step) {
            if (next < 0 || next >= elements.length) {
              if (!loopFocus || home || end) {
                return;
              }

              next = (next + elements.length) % elements.length;
            }

            if (!disabledAt(next)) {
              break;
            }
          }

          const node = elements[next];

          if (!node || disabledAt(next) || next === highlightedIndex) {
            return;
          }

          event.preventDefault();

          if (stopEventPropagation) {
            event.stopPropagation();
          }

          changeIndex(next);

          queueMicrotask(() => node.focus());
        },
      },
      ...props,
      elementProps,
    ],
  });
  return (
    <CompositeRootContext.Provider
      value={{ highlightedIndex, onHighlightedIndexChange: changeIndex, highlightItemOnHover }}
    >
      <CompositeList onMapChange={setElements}>{element}</CompositeList>
    </CompositeRootContext.Provider>
  );
}

function isDisabled(node: HTMLElement | undefined) {
  return !node || node.hasAttribute("disabled") || node.getAttribute("aria-disabled") === "true";
}
