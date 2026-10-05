import type { BaseUIComponentProps, ElementRef, NonNativeButtonProps } from "../../internals/types";
import { useCheckable, type CheckableParameters } from "../../internals/useCheckable";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStateAttributesMapping } from "../utils/useStateAttributesMapping";
import { CheckboxRootContext } from "./CheckboxRootContext";

export interface CheckboxRootState {
  checked: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  indeterminate: boolean;
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}

export interface CheckboxRootProps
  extends
    NonNativeButtonProps,
    CheckableParameters,
    Omit<
      BaseUIComponentProps<"span", CheckboxRootState>,
      "onChange" | "value" | "ref" | keyof CheckableParameters
    > {
  ref?: ElementRef<HTMLElement>;
  parent?: boolean;
  uncheckedValue?: string;
}

export function CheckboxRoot(componentProps: CheckboxRootProps) {
  const {
    ref,
    checked: _checked,
    defaultChecked: _defaultChecked,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    indeterminate: _indeterminate,
    inputRef: _inputRef,
    nativeButton: _nativeButton,
    name: _name,
    form,
    id: _id,
    value: _value,
    onCheckedChange: _onCheckedChange,
    parent = false,
    uncheckedValue,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const { state, rootProps, inputProps, controlRef, buttonRef, getButtonProps } = useCheckable(
    componentProps,
    "checkbox",
  );
  const element = useRenderElement("span", componentProps, {
    state,
    ref: [ref ?? null, controlRef, buttonRef],
    props: [{ ...rootProps, "data-parent": parent ? "" : undefined }, elementProps, getButtonProps],
    stateAttributesMapping: useStateAttributesMapping(state),
  });
  return (
    <CheckboxRootContext.Provider value={state}>
      {element}
      {!state.checked && inputProps.name && !parent && uncheckedValue !== undefined && (
        <input
          type="hidden"
          name={inputProps.name}
          form={form}
          value={uncheckedValue}
          disabled={state.disabled}
        />
      )}
      <input {...inputProps} name={parent ? undefined : inputProps.name} />
    </CheckboxRootContext.Provider>
  );
}

export declare namespace CheckboxRoot {
  type Props = CheckboxRootProps;

  type State = CheckboxRootState;

  type ChangeEventReason = "none";

  type ChangeEventDetails = Parameters<NonNullable<CheckableParameters["onCheckedChange"]>>[1];
}
