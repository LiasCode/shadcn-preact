import type { RefObject } from "preact";
import { useContext, useRef, useState } from "preact/hooks";

import {
  FieldRootContext,
  isFieldFilled,
  type FieldControlRegistration,
  emptyValidity,
  fieldValidityMapping,
  type FieldValidityData,
} from "../../internals/FieldRootContext";
import { FieldsetRootContext } from "../../internals/FieldsetRootContext";
import { FormContext, type ValidationMode } from "../../internals/FormContext";
import { LabelableContext } from "../../internals/LabelableContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import type { FieldControlState } from "../control/FieldControl";

export interface FieldRootProps extends BaseUIComponentProps<"div", FieldControlState> {
  disabled?: boolean;
  name?: string;
  invalid?: boolean;
  dirty?: boolean;
  touched?: boolean;
  validationMode?: ValidationMode;
  validationDebounceTime?: number;
  validate?: (
    value: unknown,
    formValues: Record<string, unknown>,
  ) => string | string[] | null | Promise<string | string[] | null>;
  actionsRef?: RefObject<FieldRoot.Actions | null>;
}

export function FieldRoot(props: FieldRootProps) {
  const {
    ref,
    name: nameProp,
    disabled: ownDisabled = false,
    invalid,
    dirty: dirtyProp,
    touched: touchedProp,
    validationMode: modeProp,
    validationDebounceTime = 0,
    validate: validator,
    actionsRef,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = props;
  const form = useContext(FormContext);
  const fieldset = useContext(FieldsetRootContext);
  const disabled = Boolean(fieldset?.disabled || ownDisabled);
  const mode = modeProp ?? form?.validationMode ?? "onSubmit";
  const key = useRef(Symbol()).current;
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const initialValue = useRef<unknown>("");
  const registration = useRef<FieldControlRegistration | undefined>(undefined);
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [control, setControl] = useState<{ id: string; name?: string }>();
  const [labelId, setLabelId] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const [validity, setValidity] = useState(emptyValidity);
  const validityRef = useRef(validity);
  const [dirty, setDirty] = useState(false);
  const markedDirty = useRef(dirtyProp ?? false);
  const dirtyOverride = useRef(dirtyProp);
  dirtyOverride.current = dirtyProp;
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const name = nameProp ?? control?.name;
  const serverError = name ? form?.errors[name] : undefined;
  const hasServerError = Array.isArray(serverError) ? serverError.length > 0 : Boolean(serverError);
  const state: FieldControlState = {
    disabled,
    valid: disabled ? null : invalid || hasServerError ? false : validity.state.valid,
    dirty: dirtyProp ?? dirty,
    touched: touchedProp ?? touched,
    focused,
    filled,
  };
  const publish = useStableCallback((result: FieldValidityData) => {
    validityRef.current = result;
    setValidity(result);
  });
  const shouldValidateOnChange = useStableCallback(
    () => mode === "onChange" || Boolean(mode === "onSubmit" && form?.submitted.current),
  );
  const commit = useStableCallback((revalidate = false) => {
    clearTimeout(timer.current);
    const current = registration.current?.getInput?.() ?? input.current;

    if (!current || disabled) {
      return;
    }

    const request = ++generation.current;
    const value = registration.current ? registration.current.getValue() : current.value;
    const nativeState = { ...emptyValidity().state };

    for (const flag of Object.keys(nativeState) as (keyof typeof nativeState)[]) {
      nativeState[flag] = current.validity[flag];
    }

    const onlyValueMissing =
      nativeState.valueMissing &&
      Object.entries(nativeState).every(
        ([flag, present]) => flag === "valid" || flag === "valueMissing" || !present,
      );

    if (revalidate) {
      if (state.valid !== false) {
        return;
      }

      if (!nativeState.valueMissing) {
        // Editing clears an old error; new constraints wait for blur or submission.
        current.setCustomValidity("");

        publish({
          ...emptyValidity(),
          state: { ...emptyValidity().state, valid: true },
          value,
          initialValue: initialValue.current,
        });
        return;
      }

      if (!nativeState.valid && !onlyValueMissing) {
        return;
      }
    }

    if (onlyValueMissing && !markedDirty.current) {
      nativeState.valueMissing = false;
      nativeState.valid = true;
    }

    const onChange = shouldValidateOnChange();

    if (current.validationMessage && !onChange) {
      const error = current.validationMessage;
      publish({
        state: nativeState,
        error,
        errors: [error],
        value,
        initialValue: initialValue.current,
      });
      return;
    }

    const finish = (custom: string | string[] | null) => {
      if (
        request !== generation.current ||
        (registration.current?.getInput?.() ?? input.current) !== current
      ) {
        return;
      }

      let errors: string[] = [];
      let error = "";

      if (custom !== null) {
        nativeState.valid = false;
        nativeState.customError = true;
        errors = Array.isArray(custom) ? custom : custom ? [custom] : [];
        error = errors[0] ?? "";

        if (Array.isArray(custom) || custom) {
          current.setCustomValidity(errors.join("\n"));
        }
      } else if (onChange) {
        current.setCustomValidity("");
        nativeState.customError = false;

        if (current.validationMessage) {
          error = current.validationMessage;
          errors = [error];
        } else if (current.validity.valid) {
          nativeState.valid = true;
        }
      }

      publish({ state: nativeState, error, errors, value, initialValue: initialValue.current });
    };

    const values: Record<string, unknown> = {};

    for (const field of form?.fields.values() ?? []) {
      if (field.name) {
        values[field.name] = field.getValue();
      }
    }

    const result = validator?.(value, values) ?? null;

    if (typeof result === "object" && result !== null && "then" in result) {
      void Promise.resolve(result).then(finish);
    } else {
      finish(result);
    }
  });
  const validate = useStableCallback(() => {
    markedDirty.current = true;
    commit();
  });
  useIsoLayoutEffect(() => {
    if (dirtyProp !== undefined) {
      markedDirty.current = dirtyProp;
    }
  }, [dirtyProp]);
  const register = useStableCallback(
    (
      element: HTMLInputElement | HTMLTextAreaElement,
      id: string,
      fallbackName?: string,
      options?: FieldControlRegistration,
    ) => {
      input.current = element;
      registration.current = options;
      const value = options ? options.getValue() : element.value;
      initialValue.current = value;
      setControl({ id, name: fallbackName });

      setFilled(options?.isFilled ? options.isFilled(value) : isFieldFilled(value));

      publish({ ...emptyValidity(), value, initialValue: value });
      const owner = element.form;
      // Run after dispatch/default actions: browsers may flush microtasks between reset listeners.
      const reset = (event: Event) =>
        setTimeout(() => {
          if (event.defaultPrevented || input.current !== element) {
            return;
          }

          generation.current++;
          clearTimeout(timer.current);
          const current = options?.getInput?.() ?? element;
          const resetValue = options ? options.getValue() : current.value;
          current.setCustomValidity("");
          markedDirty.current = dirtyOverride.current ?? false;
          setDirty(false);

          setTouched(false);

          setFilled(options?.isFilled ? options.isFilled(resetValue) : isFieldFilled(resetValue));

          publish({ ...emptyValidity(), value: resetValue, initialValue: initialValue.current });
        }, 0);

      owner?.addEventListener("reset", reset);
      return () => {
        owner?.removeEventListener("reset", reset);

        if (input.current === element) {
          input.current = null;
          registration.current = undefined;
          generation.current++;
          clearTimeout(timer.current);

          setControl(undefined);
        }
      };
    },
  );
  const change = useStableCallback((value: unknown) => {
    generation.current++;
    clearTimeout(timer.current);
    const nextDirty = registration.current?.isEqual
      ? !registration.current.isEqual(value, initialValue.current)
      : value !== initialValue.current;

    if (dirtyProp === undefined) {
      if (nextDirty) {
        markedDirty.current = true;
      }

      setDirty(nextDirty);
    }

    setFilled(
      registration.current?.isFilled ? registration.current.isFilled(value) : isFieldFilled(value),
    );

    publish({ ...validityRef.current, value });

    if (name) {
      form?.clearError(name);
    }

    if (shouldValidateOnChange()) {
      if (validationDebounceTime > 0 && value !== "") {
        timer.current = setTimeout(() => commit(), validationDebounceTime);
      } else {
        commit();
      }
    } else {
      commit(true);
    }
  });
  const focus = useStableCallback((next: boolean) => {
    setFocused(next);

    if (!next) {
      setTouched(true);

      if (mode === "onBlur") {
        commit();
      }
    }
  });
  const label = useStableCallback((id: string) => {
    setLabelId(id);
    return () => setLabelId((previous) => (previous === id ? undefined : previous));
  });
  const message = useStableCallback((id: string) => {
    setMessages((previous) => (previous.includes(id) ? previous : [...previous, id]));
    return () => setMessages((previous) => previous.filter((value) => value !== id));
  });
  const focusControl = useStableCallback(() => {
    if (registration.current?.focus) {
      registration.current.focus();
    } else {
      input.current?.focus();

      input.current?.select();
    }
  });
  useIsoLayoutEffect(() => {
    if (!form || !control || disabled) {
      return;
    }

    form.fields.set(key, {
      name,
      getValue: () =>
        registration.current
          ? (registration.current.getFormValue ?? registration.current.getValue)()
          : (input.current?.value ?? ""),
      validate,
      isInvalid: () =>
        Boolean(
          invalid ||
          (name && form.errors[name]?.length) ||
          validityRef.current.state.valid === false,
        ),
      focus: focusControl,
    });
    return () => {
      form.fields.delete(key);
    };
  }, [form, control, disabled, name, key, invalid, validate, focusControl]);

  useIsoLayoutEffect(() => {
    if (!actionsRef) {
      return;
    }

    actionsRef.current = { validate };
    return () => {
      actionsRef.current = null;
    };
  }, [actionsRef, validate]);
  const element = useRenderElement("div", props, {
    ref,
    state,
    props: elementProps,
    stateAttributesMapping: fieldValidityMapping,
  });
  const errors = serverError
    ? typeof serverError === "string"
      ? [serverError]
      : serverError
    : validity.errors;
  return (
    <LabelableContext.Provider value={null}>
      <FieldRootContext.Provider
        value={{
          state,
          name,
          controlId: control?.id,
          labelId,
          messages,
          validity: {
            ...validity,
            state: { ...validity.state, valid: state.valid },
            errors,
            error: errors[0] ?? validity.error,
          },
          register,
          label,
          message,
          change,
          focus,
          focusControl,
        }}
      >
        {element}
      </FieldRootContext.Provider>
    </LabelableContext.Provider>
  );
}

export declare namespace FieldRoot {
  type Props = FieldRootProps;

  type State = FieldControlState;

  type Actions = { validate: () => void };
}
export type { FieldValidityData };
