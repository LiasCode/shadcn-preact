import { useContext, useRef, useState } from "preact/hooks";

import { createChangeEventDetails, type BaseUIChangeEventDetails } from "./createBaseUIEventDetails";
import { FieldRootContext } from "./FieldRootContext";
import { FieldsetRootContext } from "./FieldsetRootContext";
import { useItemControl } from "./LabelableContext";
import type { ElementRef } from "./types";
import { useButton } from "./useButton";
import { useControlled } from "./useControlled";
import { useBaseUiId } from "./useId";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useMergedRefs } from "./useMergedRefs";
import { useRegisterFieldControl } from "./useRegisterFieldControl";
import { useStableCallback } from "./useStableCallback";
import { visuallyHidden } from "./visuallyHidden";

export interface CheckableParameters {
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  indeterminate?: boolean;
  nativeButton?: boolean;
  name?: string;
  form?: string;
  id?: string;
  value?: string;
  inputRef?: ElementRef<HTMLInputElement>;
  onCheckedChange?: (checked: boolean, details: BaseUIChangeEventDetails<"none">) => void;
  "aria-labelledby"?: string;
}
/** Native form bridge shared by the standalone Checkbox and Switch ports. */
export function useCheckable(parameters: CheckableParameters, role: "checkbox" | "switch") {
  const {
    checked: checkedProp,
    defaultChecked = false,
    disabled: disabledProp = false,
    readOnly = false,
    required = false,
    indeterminate = false,
    nativeButton = false,
    name: nameProp,
    form,
    id: idProp,
    value,
    onCheckedChange,
  } = parameters;
  const field = useContext(FieldRootContext);
  const fieldset = useContext(FieldsetRootContext);

  const name = field?.name ?? nameProp;
  const [checked, setChecked] = useControlled({ controlled: checkedProp, default: defaultChecked, name: role });
  const controlRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedInputRef = useMergedRefs(inputRef, parameters.inputRef);
  const id = useBaseUiId();
  const hiddenInputId = !nativeButton && idProp ? idProp : `${id}-input`;
  const item = useItemControl(hiddenInputId, controlRef);
  const disabled = field?.state.disabled || fieldset?.disabled || item?.state.disabled || disabledProp;
  const [labelledBy, setLabelledBy] = useState<string>();
  const { getButtonProps, buttonRef } = useButton({ disabled, native: nativeButton });
  const change = useStableCallback((next: boolean, event: Event) => {
    if (disabled || readOnly || event.defaultPrevented) return false;
    const details = createChangeEventDetails("none", event);
    onCheckedChange?.(next, details);
    if (details.isCanceled) return false;
    setChecked(next);
    return true;
  });
  useIsoLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return undefined;
    input.indeterminate = indeterminate;
    input.checked = checked;
    const labels = [...(input.labels ?? [])];
    setLabelledBy(
      labels
        .map((label, index) => {
          if (!label.id) label.id = `${id}-label-${index}`;
          return label.id;
        })
        .join(" ") || undefined,
    );
    return undefined;
  }, [checked, indeterminate, id, idProp]);
  useIsoLayoutEffect(() => {
    const ownerForm = inputRef.current?.form;
    if (!ownerForm) return undefined;
    const reset = (event: Event) => {
      setTimeout(() => {
        if (event.defaultPrevented) return;
        setChecked(defaultChecked);
        if (inputRef.current) inputRef.current.checked = checkedProp ?? defaultChecked;
      });
    };
    ownerForm.addEventListener("reset", reset);
    return () => ownerForm.removeEventListener("reset", reset);
  }, [defaultChecked, form, setChecked, checkedProp]);
  useRegisterFieldControl({ inputRef, controlRef, id: hiddenInputId, name: nameProp, disabled, value: checked });
  const state = {
    checked,
    disabled,
    readOnly,
    required,
    indeterminate,
    valid: field?.state.valid ?? null,
    touched: field?.state.touched ?? false,
    dirty: field?.state.dirty ?? false,
    filled: field?.state.filled ?? false,
    focused: field?.state.focused ?? false,
  };
  const rootProps = {
    id: nativeButton ? idProp : id,
    role,
    "aria-checked": indeterminate ? ("mixed" as const) : checked,
    "aria-readonly": readOnly || undefined,
    "aria-required": required || undefined,
    "aria-labelledby": parameters["aria-labelledby"] ?? item?.labelId ?? field?.labelId ?? labelledBy,
    "aria-invalid": (field?.state.valid === false && !disabled) || undefined,
    "aria-describedby": (item?.messages ?? field?.messages)?.join(" ") || undefined,
    onFocus() {
      field?.focus(true);
    },
    onBlur() {
      field?.focus(false);
    },
    onClick(event: Event) {
      if (readOnly || disabled) return;
      event.preventDefault();
      inputRef.current?.click();
    },
    ...(role === "checkbox"
      ? {
          onKeyDown(event: KeyboardEvent & { preventBaseUIHandler(): void }) {
            if (event.key !== "Enter") return;
            event.preventBaseUIHandler();
            if (event.defaultPrevented) return;
            event.preventDefault();
            const ownerForm = inputRef.current?.form;
            queueMicrotask(() => {
              if (ownerForm) ownerForm.requestSubmit();
            });
          },
        }
      : {}),
  };
  const inputProps = {
    type: "checkbox" as const,
    checked,
    disabled,
    readOnly,
    required,
    name,
    form,
    id: field || item ? hiddenInputId : nativeButton ? undefined : idProp,
    ...(role === "checkbox" && field ? { value: value ?? name } : value === undefined ? {} : { value }),
    ref: mergedInputRef,
    style: { ...visuallyHidden, ...(name ? { clipPath: "inset(50%)" } : {}) },
    tabIndex: -1,
    "aria-hidden": true as const,
    onChange(event: Event) {
      const input = inputRef.current;
      if (!input) return;
      const next = input.checked;
      const accepted = change(next, event);
      // Controlled and canceled changes must restore the native input as well.
      if (!accepted || checkedProp !== undefined) input.checked = checked;
    },
    onFocus() {
      controlRef.current?.focus();
    },
  };
  return { state, rootProps, inputProps, controlRef, buttonRef, getButtonProps };
}