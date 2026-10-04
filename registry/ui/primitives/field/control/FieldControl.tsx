import { useContext, useRef } from "preact/hooks";

import type { BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { createChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { FieldRootContext, fieldValidityMapping } from "../../internals/FieldRootContext";
import type { ComponentProps, ElementRef } from "../../internals/types";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import { mergeProps } from "../../merge-props";

// Shared state of Field.Root and its controls; standalone controls keep the default state.
export interface FieldControlState {
  disabled: boolean;
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}
export interface FieldControlProps extends Omit<BaseUIComponentProps<"input", FieldControlState>, "ref"> {
  ref?: ElementRef<HTMLElement>;
  onValueChange?: (value: string, eventDetails: BaseUIChangeEventDetails<"none">) => void;
  defaultValue?: ComponentProps<"input">["value"];
}
export function FieldControl(componentProps: FieldControlProps) {
  const {
    ref,
    render: _render,
    className: _className,
    style: _style,
    id: idProp,
    value,
    defaultValue,
    disabled: disabledProp = false,
    onValueChange,
    onChange,
    onInput,
    ...elementProps
  } = componentProps;
  const id = useBaseUiId(idProp);
  const field = useContext(FieldRootContext);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const disabled = field?.state.disabled || disabledProp;
  const register = field?.register;
  useIsoLayoutEffect(() => {
    if (!register || !inputRef.current || disabled) return;
    return register(inputRef.current, id, elementProps.name);
  }, [register, disabled, id, elementProps.name]);
  useIsoLayoutEffect(() => {
    if (
      value !== undefined &&
      inputRef.current &&
      field?.controlId === id &&
      String(value) !== String(field.validity.value)
    )
      field.change(String(value));
  }, [value, field]);
  const state: FieldControlState = field
    ? { ...field.state, disabled }
    : {
        disabled,
        valid: null,
        touched: false,
        dirty: false,
        filled: false,
        focused: false,
      };
  return useRenderElement("input", componentProps, {
    state,
    ref: [ref ?? null, inputRef],
    props: [
      {
        id,
        disabled,
        name: field?.name ?? elementProps.name,
        "aria-invalid": (field?.state.valid === false && !disabled) || undefined,
        "aria-labelledby": field?.labelId,
        "aria-describedby": field?.messages.join(" ") || undefined,
        onFocus() {
          field?.focus(true);
        },
        onBlur() {
          field?.focus(false);
        },
        ...(value !== undefined ? { value } : { defaultValue }),
        onInput(event: Event & { currentTarget: HTMLInputElement }) {
          const details = createChangeEventDetails("none", event);
          const next = event.currentTarget.value;
          onValueChange?.(next, details);
          if (details.isCanceled) {
            event.currentTarget.value = String(value ?? field?.validity.value ?? defaultValue ?? "");
            return;
          }
          field?.change(next);
        },
      },
      {
        ...elementProps,
        name: field?.name ?? elementProps.name,
        onInput: mergeProps<"input">({ onInput: onChange }, { onInput }).onInput,
      },
    ],
    stateAttributesMapping: field ? fieldValidityMapping : { valid: () => null },
  });
}
export declare namespace FieldControl {
  type State = FieldControlState;
  type Props = FieldControlProps;
  type ChangeEventReason = "none";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}