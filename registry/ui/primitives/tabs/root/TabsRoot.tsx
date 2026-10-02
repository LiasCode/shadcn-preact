import { useRef, useState } from "preact/hooks";

import { CompositeList } from "../../internals/composite/list/CompositeList";
import { createChangeEventDetails, type BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, Orientation } from "../../internals/types";
import { useControlled } from "../../internals/useControlled";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import { tabsStateAttributesMapping } from "./stateAttributesMapping";
import { TabsRootContext, type TabMetadata } from "./TabsRootContext";
export type ActivationDirection = "left" | "right" | "up" | "down" | "none";
export interface TabsRootState {
  orientation: Orientation;
  tabActivationDirection: ActivationDirection;
}
export interface TabsRootProps extends BaseUIComponentProps<"div", TabsRootState> {
  value?: any;
  defaultValue?: any;
  orientation?: Orientation;
  onValueChange?: (value: any, details: TabsRoot.ChangeEventDetails) => void;
}
export function TabsRoot(componentProps: TabsRootProps) {
  const {
    ref,
    value: valueProp,
    defaultValue = 0,
    orientation = "horizontal",
    onValueChange,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const [value, setValue] = useControlled({ controlled: valueProp, default: defaultValue, name: "Tabs" });
  const [tabs, setTabs] = useState<TabMetadata[]>([]);
  const [panels, setPanels] = useState(new Map<any, string>());
  const [directionState, setDirectionState] = useState<{ value: any; direction: ActivationDirection }>({
    value,
    direction: "none",
  });
  const direction =
    directionState.value === value
      ? directionState.direction
      : computeDirection(directionState.value, value, orientation, tabs);
  useIsoLayoutEffect(() => {
    if (directionState.value !== value) setDirectionState({ value, direction });
  }, [value, direction, directionState.value]);
  const registerTab = useStableCallback((metadata: TabMetadata) => {
    setTabs((prev) =>
      [...prev.filter((tab) => tab.element !== metadata.element), metadata].sort((a, b) =>
        a.element.compareDocumentPosition(b.element) & 4 ? -1 : 1,
      ),
    );
    return () => setTabs((prev) => prev.filter((tab) => tab.element !== metadata.element));
  });
  const registerPanel = useStableCallback((panelValue: any, id: string) => {
    setPanels((prev) => new Map(prev).set(panelValue, id));
    return () =>
      setPanels((prev) => {
        if (prev.get(panelValue) !== id) return prev;
        const next = new Map(prev);
        next.delete(panelValue);
        return next;
      });
  });
  const change = useStableCallback((next: any, event: Event) => {
    const details = createChangeEventDetails("none", event, undefined, {
      activationDirection: computeDirection(value, next, orientation, tabs),
    });
    onValueChange?.(next, details);
    if (!details.isCanceled) setValue(next);
  });
  const initial = useRef(componentProps.defaultValue === undefined);
  const honorDisabledDefault = useRef(componentProps.defaultValue !== undefined);
  const registered = useRef(false);
  useIsoLayoutEffect(() => {
    if (valueProp !== undefined || (!tabs.length && !registered.current)) return;
    registered.current = true;
    const selected = tabs.find((tab) => tab.value === value);
    if (selected && !selected.disabled) honorDisabledDefault.current = false;
    if (selected?.disabled && honorDisabledDefault.current && value === defaultValue) return;
    const missing = value !== null && !selected;
    if (selected?.disabled || missing) {
      const next = tabs.find((tab) => !tab.disabled)?.value ?? null;
      if (next !== value) {
        const reason = initial.current ? "initial" : selected?.disabled ? "disabled" : "missing";
        setValue(next);
        setDirectionState({ value: next, direction: "none" });
        onValueChange?.(
          next,
          createChangeEventDetails(reason, undefined, undefined, { activationDirection: "none" as const }),
        );
      }
      initial.current = false;
    } else if (initial.current && selected) {
      onValueChange?.(
        value,
        createChangeEventDetails("initial", undefined, undefined, { activationDirection: "none" as const }),
      );
      initial.current = false;
    }
  }, [tabs, value, valueProp, defaultValue, onValueChange, setValue]);
  const state = { orientation, tabActivationDirection: direction };
  const element = useRenderElement("div", componentProps, {
    ref,
    state,
    props: elementProps,
    stateAttributesMapping: tabsStateAttributesMapping,
  });
  return (
    <TabsRootContext.Provider value={{ value, state, tabs, panels, registerTab, registerPanel, change }}>
      <CompositeList>{element}</CompositeList>
    </TabsRootContext.Provider>
  );
}
function computeDirection(
  oldValue: any,
  newValue: any,
  orientation: Orientation,
  tabs: TabMetadata[],
): ActivationDirection {
  if (oldValue == null || newValue == null) return "none";
  const oldTab = tabs.find((tab) => tab.value === oldValue)?.element;
  const newTab = tabs.find((tab) => tab.value === newValue)?.element;
  if (oldTab && newTab) {
    const oldRect = oldTab.getBoundingClientRect();
    const newRect = newTab.getBoundingClientRect();
    const delta = orientation === "horizontal" ? newRect.left - oldRect.left : newRect.top - oldRect.top;
    if (!delta) return "none";
    return orientation === "horizontal" ? (delta > 0 ? "right" : "left") : delta > 0 ? "down" : "up";
  }
  if ((typeof oldValue === "number" || typeof oldValue === "string") && typeof oldValue === typeof newValue)
    return orientation === "horizontal"
      ? newValue > oldValue
        ? "right"
        : "left"
      : newValue > oldValue
        ? "down"
        : "up";
  return "none";
}
export declare namespace TabsRoot {
  type Props = TabsRootProps;
  type State = TabsRootState;
  type Orientation = import("../../internals/types").Orientation;
  type ChangeEventReason = "none" | "initial" | "disabled" | "missing";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason, { activationDirection: ActivationDirection }>;
}