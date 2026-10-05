import { CompositeRoot } from "../internals/composite/root/CompositeRoot";
import type { BaseUIChangeEventDetails } from "../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, Orientation } from "../internals/types";
import { useControlled } from "../internals/useControlled";
import { useStableCallback } from "../internals/useStableCallback";
import { ToggleGroupContext } from "./ToggleGroupContext";

export interface ToggleGroupState {
  disabled: boolean;
  multiple: boolean;
  orientation: Orientation;
}

export interface ToggleGroupProps<Value extends string> extends Omit<
  BaseUIComponentProps<"div", ToggleGroupState>,
  "value"
> {
  value?: readonly Value[];
  defaultValue?: readonly Value[];
  onValueChange?: (value: Value[], details: BaseUIChangeEventDetails<"none">) => void;
  disabled?: boolean;
  orientation?: Orientation;
  loopFocus?: boolean;
  multiple?: boolean;
}

export function ToggleGroup<Value extends string>(componentProps: ToggleGroupProps<Value>) {
  const {
    ref,
    value: valueProp,
    defaultValue = [],
    onValueChange,
    disabled = false,
    orientation = "horizontal",
    loopFocus = true,
    multiple = false,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: "ToggleGroup",
  });
  const setGroupValue = useStableCallback(
    (item: string, pressed: boolean, details: BaseUIChangeEventDetails<"none">) => {
      const next = multiple
        ? pressed
          ? [...value, item as Value]
          : value.filter((entry) => entry !== item)
        : pressed
          ? [item as Value]
          : [];
      onValueChange?.(next, details);

      if (!details.isCanceled) {
        setValue(next);
      }
    },
  );
  return (
    <ToggleGroupContext.Provider value={{ value, disabled, setGroupValue }}>
      <CompositeRoot
        render={componentProps.render}
        className={componentProps.className}
        style={componentProps.style}
        refs={[ref ?? null]}
        state={{ disabled, multiple, orientation }}
        stateAttributesMapping={{ multiple: (value) => (value ? { "data-multiple": "" } : null) }}
        props={[{ role: "group" }, elementProps]}
        orientation={orientation}
        loopFocus={loopFocus}
        enableHomeAndEndKeys
      />
    </ToggleGroupContext.Provider>
  );
}

export declare namespace ToggleGroup {
  type Props<Value extends string = string> = ToggleGroupProps<Value>;

  type State = ToggleGroupState;

  type ChangeEventReason = "none";

  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}
