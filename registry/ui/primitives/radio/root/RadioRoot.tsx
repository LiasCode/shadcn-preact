import { useContext, useRef, useState } from "preact/hooks";

import { CompositeItem } from "../../internals/composite/item/CompositeItem";
import { createChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import { FieldsetRootContext } from "../../internals/FieldsetRootContext";
import { useItemControl } from "../../internals/LabelableContext";
import type { BaseUIComponentProps, ElementRef, NonNativeButtonProps } from "../../internals/types";
import { useButton } from "../../internals/useButton";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useMergedRefs } from "../../internals/useMergedRefs";
import { useRenderElement } from "../../internals/useRenderElement";
import { visuallyHidden } from "../../internals/visuallyHidden";
import type { RadioGroupState } from "../../radio-group/RadioGroup";
import { RadioGroupContext } from "../../radio-group/RadioGroupContext";
import { stateAttributesMapping } from "../utils/stateAttributesMapping";
import { RadioRootContext } from "./RadioRootContext";

export interface RadioRootState extends RadioGroupState {
  checked: boolean;
}

export interface RadioRootProps<Value>
  extends
    NonNativeButtonProps,
    Omit<BaseUIComponentProps<"span", RadioRootState>, "value" | "ref"> {
  value: Value;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  inputRef?: ElementRef<HTMLInputElement>;
  ref?: ElementRef<HTMLElement>;
}

export function RadioRoot<Value>(componentProps: RadioRootProps<Value>) {
  const {
    ref,
    value,
    disabled: disabledProp = false,
    readOnly: readOnlyProp = false,
    required: requiredProp = false,
    inputRef: inputRefProp,
    nativeButton = false,
    id: idProp,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = componentProps;
  const group = useContext(RadioGroupContext);
  const fieldset = useContext(FieldsetRootContext);
  const readOnly = readOnlyProp || group?.readOnly || false;
  const required = requiredProp || group?.required || false;
  const checked = group ? group.value === value : value === "";
  const radioRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const mergedInputRef = useMergedRefs(inputRef, inputRefProp);
  const [labelledBy, setLabelledBy] = useState<string>();
  const id = useBaseUiId();
  const hiddenId = !nativeButton && idProp ? idProp : `${id}-input`;
  const item = useItemControl(hiddenId, radioRef);
  const disabled =
    disabledProp || group?.disabled || fieldset?.disabled || item?.state.disabled || false;
  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
    composite: false,
  });
  useIsoLayoutEffect(() => {
    const input = inputRef.current;

    if (!input) {
      return undefined;
    }

    input.checked = checked;
    group?.registerInput(input);

    setLabelledBy(
      [...(input.labels ?? [])]
        .map((label, index) => {
          if (!label.id) {
            label.id = `${id}-label-${index}`;
          }

          return label.id;
        })
        .join(" ") || undefined,
    );
    const ownerForm = input.form;

    const reset = (event: Event) =>
      setTimeout(() => {
        if (!event.defaultPrevented) {
          group?.reset();
        }
      });

    ownerForm?.addEventListener("reset", reset);
    return () => ownerForm?.removeEventListener("reset", reset);
  }, [checked, id, idProp, group?.reset, group?.registerInput, disabled]);
  const state = {
    checked,
    disabled,
    readOnly,
    required,
    touched: group?.state.touched ?? false,
    dirty: group?.state.dirty ?? false,
    filled: group?.state.filled ?? false,
    focused: group?.state.focused ?? false,
    valid: group?.state.valid ?? null,
  };
  const props = [
    {
      role: "radio",
      "aria-checked": checked,
      "aria-readonly": readOnly || undefined,
      "aria-required": required || undefined,
      "aria-labelledby": item?.labelId ?? labelledBy,
      "aria-describedby": item?.messages.join(" ") || undefined,
      "data-composite-item-active": checked ? "" : undefined,
      id: nativeButton ? idProp : id,
      onKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      },
      onClick(event: Event) {
        if (disabled || readOnly || event.defaultPrevented) {
          return;
        }

        event.preventDefault();

        inputRef.current?.click();
      },
      onFocus() {
        if (group?.keyboard.current && !disabled && !readOnly) {
          group.keyboard.current = false;
          inputRef.current?.click();
        }
      },
    },
    elementProps,
    getButtonProps,
  ];
  const refs = [ref ?? null, radioRef, buttonRef];
  const element = useRenderElement("span", componentProps, {
    enabled: !group,
    state,
    ref: refs,
    props,
    stateAttributesMapping,
  });
  return (
    <RadioRootContext.Provider value={state}>
      {group ? (
        <CompositeItem
          tag="span"
          render={componentProps.render}
          className={componentProps.className}
          style={componentProps.style}
          state={state}
          refs={refs}
          props={props}
          stateAttributesMapping={stateAttributesMapping}
        />
      ) : (
        element
      )}
      <input
        type="radio"
        ref={mergedInputRef}
        form={group?.form}
        id={item ? hiddenId : nativeButton ? undefined : idProp}
        name={group?.name}
        tabIndex={-1}
        style={visuallyHidden}
        aria-hidden={true}
        value={typeof value === "object" ? JSON.stringify(value) : String(value)}
        disabled={disabled}
        checked={checked}
        required={required}
        readOnly={readOnly}
        onChange={(event) => {
          const input = event.currentTarget;

          if (disabled || readOnly || event.defaultPrevented) {
            input.checked = checked;
            group?.registerInput(input);
            return;
          }

          const details = createChangeEventDetails("none", event);
          group?.setValue(value, details);

          if (details.isCanceled) {
            input.checked = checked;
          }
        }}
        onFocus={() => radioRef.current?.focus()}
      />
    </RadioRootContext.Provider>
  );
}

export declare namespace RadioRoot {
  type Props<Value = any> = RadioRootProps<Value>;

  type State = RadioRootState;
}
