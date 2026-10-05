import { useContext, useRef, useState } from "preact/hooks";

import { CompositeRoot } from "../internals/composite/root/CompositeRoot";
import type { BaseUIChangeEventDetails } from "../internals/createBaseUIEventDetails";
import { FieldRootContext, fieldValidityMapping } from "../internals/FieldRootContext";
import { FieldsetRootContext } from "../internals/FieldsetRootContext";
import type { BaseUIComponentProps, ElementRef } from "../internals/types";
import { useControlled } from "../internals/useControlled";
import { useBaseUiId } from "../internals/useId";
import { useRegisterFieldControl } from "../internals/useRegisterFieldControl";
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

export interface RadioGroupProps<Value> extends Omit<
  BaseUIComponentProps<"div", RadioGroupState>,
  "value"
> {
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
    disabled: disabledProp = false,
    readOnly = false,
    required = false,
    name: nameProp,
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
  const field = useContext(FieldRootContext);
  const fieldset = useContext(FieldsetRootContext);
  const disabled = field?.state.disabled || fieldset?.disabled || disabledProp;
  const name = field?.name ?? nameProp;
  const id = useBaseUiId(elementProps.id);
  const controlRef = useRef<HTMLElement | null>(null);
  const [value, setValue] = useControlled({
    controlled: valueProp,
    default: defaultValue,
    name: "RadioGroup",
  });
  const [, forceSync] = useState(0);
  const registeredInput = useRef<HTMLInputElement | null>(null);
  const registerInput = useStableCallback((input: HTMLInputElement | null) => {
    if (!input || input.disabled) {
      return;
    }

    if (
      input.checked ||
      !registeredInput.current ||
      registeredInput.current.disabled ||
      !registeredInput.current.isConnected
    ) {
      const needsRegistration = !registeredInput.current || !registeredInput.current.isConnected;
      registeredInput.current = input;

      if (needsRegistration) {
        forceSync((tick) => tick + 1);
      }

      if (typeof inputRef === "function") {
        inputRef(input);
      } else if (inputRef) {
        inputRef.current = input;
      }
    }
  });
  const keyboard = useRef(false);
  const change = useStableCallback((next: unknown, details: BaseUIChangeEventDetails<"none">) => {
    forceSync((tick) => tick + 1);

    onValueChange?.(next as Value, details);

    if (!details.isCanceled) {
      setValue(next as Value);
    }
  });
  const reset = useStableCallback(() => {
    setValue(defaultValue as Value);

    forceSync((tick) => tick + 1);
  });
  const getInput = useStableCallback(() => {
    const inputs = controlRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    const enabled = [...(inputs ?? [])].filter((input) => !input.disabled);
    return enabled.find((input) => input.checked) ?? enabled[0] ?? null;
  });
  useRegisterFieldControl({
    inputRef: registeredInput,
    controlRef,
    id,
    name: nameProp,
    disabled,
    value: value ?? null,
    getInput,
    getFormValue: () => (getInput()?.checked ? (value ?? null) : null),
    focus: () => {
      const inputs = [
        ...(controlRef.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]') ?? []),
      ];
      const current = getInput();

      if (current) {
        const radios = [
          ...(controlRef.current?.querySelectorAll<HTMLElement>('[role="radio"]') ?? []),
        ];
        radios[inputs.indexOf(current)]?.focus();
      }
    },
  });
  const state = {
    disabled,
    readOnly,
    required,
    valid: field?.state.valid ?? null,
    touched: field?.state.touched ?? false,
    dirty: field?.state.dirty ?? false,
    filled: field?.state.filled ?? false,
    focused: field?.state.focused ?? false,
  };
  return (
    <RadioGroupContext.Provider
      value={{
        value,
        state,
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
        refs={[ref ?? null, controlRef]}
        stateAttributesMapping={fieldValidityMapping}
        props={[
          {
            id,
            role: "radiogroup",
            "aria-labelledby": field?.labelId ?? fieldset?.legendId,
            "aria-describedby": field?.messages.join(" ") || undefined,
            "aria-invalid": (field?.state.valid === false && !disabled) || undefined,
            onFocus() {
              field?.focus(true);
            },
            onBlur(event: FocusEvent) {
              if (!controlRef.current?.contains(event.relatedTarget as Node | null)) {
                field?.focus(false);
              }
            },
            "aria-required": required || undefined,
            "aria-disabled": disabled || undefined,
            "aria-readonly": readOnly || undefined,
            onKeyDownCapture(event: KeyboardEvent) {
              if (event.key.startsWith("Arrow")) {
                keyboard.current = true;
              }
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
