import { useRef } from "preact/hooks";

import { useCompositeItem } from "../../internals/composite/item/useCompositeItem";
import type { BaseUIComponentProps, NativeButtonProps } from "../../internals/types";
import { useButton } from "../../internals/useButton";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTabsListContext } from "../list/TabsListContext";
import { tabsStateAttributesMapping } from "../root/stateAttributesMapping";
import type { TabsRootState } from "../root/TabsRoot";
import { useTabsRootContext } from "../root/TabsRootContext";
export interface TabsTabState extends TabsRootState {
  active: boolean;
  disabled: boolean;
}
export interface TabsTabProps extends NativeButtonProps, Omit<BaseUIComponentProps<"button", TabsTabState>, "value"> {
  value: any;
}
export function TabsTab(componentProps: TabsTabProps) {
  const {
    ref,
    value,
    id: idProp,
    disabled = false,
    nativeButton = true,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const root = useTabsRootContext();
  const list = useTabsListContext();
  const { compositeRef, compositeProps, index } = useCompositeItem();
  const elementRef = useRef<HTMLElement | null>(null);
  const id = useBaseUiId(idProp);
  const active = value === root.value;
  const { getButtonProps, buttonRef } = useButton({ disabled, native: nativeButton, focusableWhenDisabled: true });
  useIsoLayoutEffect(() => {
    if (elementRef.current) return root.registerTab({ element: elementRef.current, value, id, disabled });
    return undefined;
  }, [value, id, disabled, root.registerTab]);
  useIsoLayoutEffect(() => {
    if (!active || disabled || index < 0 || list.highlightedIndex === index) return;
    const element = list.element.current;
    if (element && element.contains(element.ownerDocument.activeElement)) return;
    list.setHighlightedIndex(index);
  }, [active, disabled, index, list.highlightedIndex, list.setHighlightedIndex, list.element]);
  const state = { ...root.state, active, disabled };
  return useRenderElement("button", componentProps, {
    state,
    ref: [ref ?? null, elementRef, buttonRef, compositeRef],
    stateAttributesMapping: tabsStateAttributesMapping,
    props: [
      compositeProps,
      {
        role: "tab",
        id,
        "aria-selected": active,
        "aria-controls": root.panels.get(value),
        "data-composite-item-active": active ? "" : undefined,
        onClick(event: Event) {
          if (!active && !disabled) root.change(value, event);
        },
        onFocus(event: Event) {
          if (list.activateOnFocus && !active && !disabled) root.change(value, event);
        },
      },
      elementProps,
      getButtonProps,
    ],
  });
}
export declare namespace TabsTab {
  type Props = TabsTabProps;
  type State = TabsTabState;
  type Value = any;
  type ActivationDirection = import("../root/TabsRoot").ActivationDirection;
}