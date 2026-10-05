import type { CheckboxRootState } from "../../checkbox/root/CheckboxRoot";
import type { BaseUIComponentProps, ElementRef, NonNativeButtonProps } from "../../internals/types";
import { useCheckable, type CheckableParameters } from "../../internals/useCheckable";
import { useRenderElement } from "../../internals/useRenderElement";
import { stateAttributesMapping } from "../stateAttributesMapping";
import { SwitchRootContext } from "./SwitchRootContext";

export type SwitchRootState = Omit<CheckboxRootState, "indeterminate">;

export interface SwitchRootProps
  extends
    NonNativeButtonProps,
    Omit<CheckableParameters, "indeterminate">,
    Omit<
      BaseUIComponentProps<"span", SwitchRootState>,
      "onChange" | "value" | "ref" | keyof CheckableParameters
    > {
  ref?: ElementRef<HTMLElement>;
  uncheckedValue?: string;
}

export function SwitchRoot(componentProps: SwitchRootProps) {
  const {
    ref,
    checked: _checked,
    defaultChecked: _defaultChecked,
    disabled: _disabled,
    readOnly: _readOnly,
    required: _required,
    inputRef: _inputRef,
    nativeButton: _nativeButton,
    name: _name,
    form,
    id: _id,
    value: _value,
    onCheckedChange: _onCheckedChange,
    uncheckedValue,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const {
    state: checkableState,
    rootProps,
    inputProps,
    controlRef,
    buttonRef,
    getButtonProps,
  } = useCheckable(componentProps, "switch");
  const { indeterminate: _indeterminate, ...state } = checkableState;
  const element = useRenderElement("span", componentProps, {
    state,
    ref: [ref ?? null, controlRef, buttonRef],
    props: [rootProps, elementProps, getButtonProps],
    stateAttributesMapping,
  });
  return (
    <SwitchRootContext.Provider value={state}>
      {element}
      {!state.checked && inputProps.name && uncheckedValue !== undefined && (
        <input
          type="hidden"
          name={inputProps.name}
          form={form}
          value={uncheckedValue}
          disabled={state.disabled}
        />
      )}
      <input {...inputProps} />
    </SwitchRootContext.Provider>
  );
}

export declare namespace SwitchRoot {
  type Props = SwitchRootProps;

  type State = SwitchRootState;

  type ChangeEventReason = "none";

  type ChangeEventDetails = Parameters<NonNullable<CheckableParameters["onCheckedChange"]>>[1];
}
