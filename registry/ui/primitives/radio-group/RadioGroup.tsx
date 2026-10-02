import { useRef, useState } from "preact/hooks";

import { CompositeRoot } from "../internals/composite/root/CompositeRoot";
import type { BaseUIChangeEventDetails } from "../internals/createBaseUIEventDetails";
import type { BaseUIComponentProps, ElementRef } from "../internals/types";
import { useControlled } from "../internals/useControlled";
import { useStableCallback } from "../internals/useStableCallback";
import { RadioGroupContext } from "./RadioGroupContext";
export interface RadioGroupState {
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}
export interface RadioGroupProps<Value> extends Omit<BaseUIComponentProps<"div", RadioGroupState>, "value"> {
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  form?: string;
  value?: Value;
  defaultValue?: Value;
  inputRef?: ElementRef<HTMLInputElement>;
  onValueChange?: (value: Value, details: BaseUIChangeEventDetails<"none">) => void;
}
export function RadioGroup<Value>(componentProps: RadioGroupProps<Value>) {
  const {
    ref,
    disabled = false,
    readOnly = false,
    required = false,
    name,
    form,
    inputRef,
    value: valueProp,
    defaultValue,
    onValueChange,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const [value, setValue] = useControlled({ controlled: valueProp, default: defaultValue, name: "RadioGroup" });
  const [, forceSync] = useState(0);
  const registeredInput = useRef<HTMLInputElement | null>(null);
  const registerInput = useStableCallback((input: HTMLInputElement | null) => {
    if (!input || input.disabled) return;
    if (
      input.checked ||
      !registeredInput.current ||
      registeredInput.current.disabled ||
      !registeredInput.current.isConnected
    ) {
      registeredInput.current = input;
      if (typeof inputRef === "function") inputRef(input);
      else if (inputRef) inputRef.current = input;
    }
  });
  const keyboard = useRef(false);
  const change = useStableCallback((next: unknown, details: BaseUIChangeEventDetails<"none">) => {
    forceSync((tick) => tick + 1);
    onValueChange?.(next as Value, details);
    if (!details.isCanceled) setValue(next as Value);
  });
  const reset = useStableCallback(() => {
    setValue(defaultValue as Value);
    forceSync((tick) => tick + 1);
  });
  const state = {
    disabled,
    readOnly,
    required,
    valid: null,
    touched: false,
    dirty: false,
    filled: false,
    focused: false,
  };
  return (
    <RadioGroupContext.Provider
      value={{
        value,
        disabled,
        readOnly,
        required,
        name,
        form,
        inputRef,
        registerInput,
        keyboard,
        setValue: change,
        reset,
      }}
    >
      <CompositeRoot
        modifierKeys={["Shift"]}
        render={componentProps.render}
        className={componentProps.className}
        style={componentProps.style}
        state={state}
        refs={[ref ?? null]}
        props={[
          {
            role: "radiogroup",
            "aria-required": required || undefined,
            "aria-disabled": disabled || undefined,
            "aria-readonly": readOnly || undefined,
            onKeyDownCapture(event: KeyboardEvent) {
              if (event.key.startsWith("Arrow")) keyboard.current = true;
            },
          },
          elementProps,
        ]}
      />
    </RadioGroupContext.Provider>
  );
}
export declare namespace RadioGroup {
  type Props<Value = any> = RadioGroupProps<Value>;
  type State = RadioGroupState;
  type ChangeEventReason = "none";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}