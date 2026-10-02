import { useDirection } from "../../direction-provider";
import { CompositeList } from "../../internals/composite/list/CompositeList";
import type { BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, Orientation } from "../../internals/types";
import { useControlled } from "../../internals/useControlled";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import { AccordionRootContext } from "./AccordionRootContext";
export interface AccordionRootState<Value = any> {
  value: Value[];
  disabled: boolean;
  orientation: Orientation;
}
export interface AccordionRootProps<Value> extends Omit<
  BaseUIComponentProps<"div", AccordionRootState<Value>>,
  "value"
> {
  value?: Value[];
  defaultValue?: Value[];
  disabled?: boolean;
  multiple?: boolean;
  orientation?: Orientation;
  loopFocus?: boolean;
  hiddenUntilFound?: boolean;
  keepMounted?: boolean;
  onValueChange?: (value: Value[], details: BaseUIChangeEventDetails<"trigger-press" | "none">) => void;
}
export function AccordionRoot<Value>(componentProps: AccordionRootProps<Value>) {
  const {
    ref,
    value: valueProp,
    defaultValue = [],
    disabled = false,
    multiple = false,
    orientation = "vertical",
    loopFocus: _loopFocus,
    hiddenUntilFound = false,
    keepMounted = false,
    onValueChange,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const [value, setValue] = useControlled({ controlled: valueProp, default: defaultValue, name: "Accordion" });
  const direction = useDirection();
  const handleValueChange = useStableCallback(
    (item: unknown, open: boolean, details: BaseUIChangeEventDetails<"trigger-press" | "none">) => {
      const next = multiple
        ? open
          ? [...value, item as Value]
          : value.filter((entry) => entry !== item)
        : value[0] === item
          ? []
          : [item as Value];
      onValueChange?.(next, details);
      if (!details.isCanceled) setValue(next);
    },
  );
  const state = { value, disabled, orientation };
  const element = useRenderElement("div", componentProps, {
    ref,
    state,
    props: [{ dir: direction }, elementProps],
    stateAttributesMapping: { value: () => null },
  });
  return (
    <AccordionRootContext.Provider value={{ state, hiddenUntilFound, keepMounted, handleValueChange }}>
      <CompositeList>{element}</CompositeList>
    </AccordionRootContext.Provider>
  );
}
export declare namespace AccordionRoot {
  type Props<Value = any> = AccordionRootProps<Value>;
  type State<Value = any> = AccordionRootState<Value>;
  type Value<T = any> = T[];
  type ChangeEventReason = "trigger-press" | "none";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}