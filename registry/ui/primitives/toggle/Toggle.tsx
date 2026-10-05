import { useContext } from "preact/hooks";

import { CompositeItem } from "../internals/composite/item/CompositeItem";
import {
  createChangeEventDetails,
  type BaseUIChangeEventDetails,
} from "../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, NativeButtonProps } from "../internals/types";
import { useButton } from "../internals/useButton";
import { useControlled } from "../internals/useControlled";
import { useBaseUiId } from "../internals/useId";
import { useRenderElement } from "../internals/useRenderElement";
import { ToggleGroupContext } from "../toggle-group/ToggleGroupContext";

export interface ToggleState {
  pressed: boolean;
  disabled: boolean;
}

export interface ToggleProps<Value extends string>
  extends NativeButtonProps, Omit<BaseUIComponentProps<"button", ToggleState>, "value"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean, details: BaseUIChangeEventDetails<"none">) => void;
  value?: Value;
}

export function Toggle<Value extends string>(componentProps: ToggleProps<Value>) {
  const {
    ref,
    pressed: pressedProp,
    defaultPressed = false,
    disabled: disabledProp = false,
    onPressedChange,
    value: valueProp,
    nativeButton = true,
    form: _form,
    type: _type,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const group = useContext(ToggleGroupContext);
  const value = useBaseUiId(valueProp || undefined);
  const [pressed, setPressed] = useControlled({
    controlled: group ? group.value.includes(value) : pressedProp,
    default: defaultPressed,
    name: "Toggle",
  });
  const disabled = disabledProp || group?.disabled || false;
  const { getButtonProps, buttonRef } = useButton({ disabled, native: nativeButton });
  const state = { pressed, disabled };
  const props = [
    {
      "aria-pressed": pressed,
      onClick(event: Event) {
        const details = createChangeEventDetails("none", event);
        onPressedChange?.(!pressed, details);

        if (details.isCanceled) {
          return;
        }

        group?.setGroupValue(value, !pressed, details);

        if (!details.isCanceled) {
          setPressed(!pressed);
        }
      },
    },
    elementProps,
    getButtonProps,
  ];
  const element = useRenderElement("button", componentProps, {
    enabled: !group,
    state,
    ref: [ref ?? null, buttonRef],
    props,
  });

  if (group) {
    return (
      <CompositeItem
        render={componentProps.render}
        className={componentProps.className}
        style={componentProps.style}
        tag="button"
        state={state}
        refs={[ref ?? null, buttonRef]}
        props={props}
      />
    );
  }

  return element;
}

export declare namespace Toggle {
  type Props<Value extends string = string> = ToggleProps<Value>;

  type State = ToggleState;

  type ChangeEventReason = "none";

  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}
