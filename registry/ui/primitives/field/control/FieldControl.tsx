import type { BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { createChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import type { ComponentProps, ElementRef } from "../../internals/types";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useRenderElement } from "../../internals/useRenderElement";
import { mergeProps } from "../../merge-props";

// The default Field.Root context, used by Input outside Base UI Field/Form (ADR 0012).
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
    disabled = false,
    onValueChange,
    onChange,
    onInput,
    ...elementProps
  } = componentProps;
  const id = useBaseUiId(idProp);
  const state: FieldControlState = {
    disabled,
    valid: null,
    touched: false,
    dirty: false,
    filled: false,
    focused: false,
  };
  return useRenderElement("input", componentProps, {
    state,
    ref,
    props: [
      {
        id,
        disabled,
        ...(value !== undefined ? { value } : { defaultValue }),
        onInput(event: Event & { currentTarget: HTMLInputElement }) {
          onValueChange?.(event.currentTarget.value, createChangeEventDetails("none", event));
        },
      },
      { ...elementProps, onInput: mergeProps<"input">({ onInput: onChange }, { onInput }).onInput },
    ],
    stateAttributesMapping: { valid: () => null },
  });
}
export declare namespace FieldControl {
  type State = FieldControlState;
  type Props = FieldControlProps;
  type ChangeEventReason = "none";
  type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>;
}