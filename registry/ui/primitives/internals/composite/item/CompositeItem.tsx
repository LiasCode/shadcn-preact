import type { StateAttributesMapping } from "../../getStateAttributesProps";
import type { BaseUIComponentProps, ElementRef } from "../../types";
import { useRenderElement } from "../../useRenderElement";
import { useCompositeListItem } from "../list/useCompositeListItem";
import { useCompositeRootContext } from "../root/CompositeRootContext";

export interface CompositeItemProps<State extends Record<string, any>> extends BaseUIComponentProps<
  "div",
  State
> {
  tag?: string;
  state?: State;
  props?: Record<string, any>[];
  refs?: ElementRef<any>[];
  stateAttributesMapping?: StateAttributesMapping<State>;
  metadata?: { disabled?: boolean; focusableWhenDisabled?: boolean };
}

export function CompositeItem<State extends Record<string, any>>(
  componentProps: CompositeItemProps<State>,
) {
  const {
    tag = "div",
    state = {} as State,
    props = [],
    refs = [],
    metadata: _metadata,
    stateAttributesMapping,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const context = useCompositeRootContext()!;
  const { ref: compositeRef, elementRef, index } = useCompositeListItem();
  return useRenderElement(tag, componentProps, {
    state,
    stateAttributesMapping,
    ref: [...refs, compositeRef],
    props: [
      {
        tabIndex: context.highlightedIndex === index ? 0 : -1,
        onFocus() {
          if (index !== -1) {
            context.onHighlightedIndexChange(index);
          }
        },
        onMouseMove() {
          const node = elementRef.current;

          if (
            context.highlightItemOnHover &&
            node &&
            !node.hasAttribute("disabled") &&
            node.getAttribute("aria-disabled") !== "true"
          ) {
            node.focus();
          }
        },
      },
      ...props,
      elementProps,
    ],
  });
}
