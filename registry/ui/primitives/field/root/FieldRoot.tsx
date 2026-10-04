import type { RefObject } from "preact";
import { useContext, useRef, useState } from "preact/hooks";

import {
  FieldRootContext,
  emptyValidity,
  fieldValidityMapping,
  type FieldValidityData,
} from "../../internals/FieldRootContext";
import { FormContext, type ValidationMode } from "../../internals/FormContext";
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
    disabled = false,
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
  const mode = modeProp ?? form?.validationMode ?? "onSubmit";
  const key = useRef(Symbol()).current;
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const initialValue = useRef("");
  const generation = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [control, setControl] = useState<{ id: string; name?: string }>();
  const [labelId, setLabelId] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const [validity, setValidity] = useState(emptyValidity);
  const validityRef = useRef(validity);
  const [dirty, setDirty] = useState(false);
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const name = nameProp ?? control?.name;
  const serverError = name ? form?.errors[name] : undefined;
  const hasServerError = Array.isArray(serverError) ? serverError.length > 0 : Boolean(serverError);
  const state: FieldControlState = {
    disabled,
    valid: invalid || hasServerError ? false : validity.state.valid,
    dirty: dirtyProp ?? dirty,
    touched: touchedProp ?? touched,
    focused,
    filled,
  };
  const publish = useStableCallback((result: FieldValidityData) => {
    validityRef.current = result;
    setValidity(result);
  });
  const commit = useStableCallback(() => {
    clearTimeout(timer.current);
    const current = input.current;
    if (!current || disabled) return;
    const request = ++generation.current;
    const value = current.value;
    current.setCustomValidity("");
    const nativeState = { ...emptyValidity().state };
    for (const flag of Object.keys(nativeState) as (keyof typeof nativeState)[])
      nativeState[flag] = current.validity[flag];
    const finish = (custom: string | string[] | null) => {
      if (request !== generation.current || input.current !== current) return;
      const errors = custom === null ? [] : typeof custom === "string" ? [custom] : custom;
      current.setCustomValidity(errors.join("\n"));
      publish({
        state: { ...nativeState, customError: custom !== null, valid: nativeState.valid === true && custom === null },
        error: errors[0] ?? current.validationMessage,
        errors,
        value,
        initialValue: initialValue.current,
      });
    };
    if (!nativeState.valid) {
      finish(null);
      return;
    }
    const values: Record<string, unknown> = {};
    for (const field of form?.fields.values() ?? []) if (field.name) values[field.name] = field.getValue();
    const result = validator?.(value, values) ?? null;
    if (result instanceof Promise) void result.then(finish);
    else finish(result);
  });
  const register = useStableCallback(
    (element: HTMLInputElement | HTMLTextAreaElement, id: string, fallbackName?: string) => {
      input.current = element;
      initialValue.current = element.value;
      setControl({ id, name: fallbackName });
      setFilled(element.value !== "");
      publish({ ...emptyValidity(), value: element.value, initialValue: element.value });
      const owner = element.form;
      // Run after dispatch/default actions: browsers may flush microtasks between reset listeners.
      const reset = (event: Event) =>
        setTimeout(() => {
          if (event.defaultPrevented || input.current !== element) return;
          generation.current++;
          clearTimeout(timer.current);
          element.setCustomValidity("");
          setDirty(false);
          setTouched(false);
          setFilled(element.value !== "");
          publish({ ...emptyValidity(), value: element.value, initialValue: initialValue.current });
        }, 0);
      owner?.addEventListener("reset", reset);
      return () => {
        owner?.removeEventListener("reset", reset);
        if (input.current === element) {
          input.current = null;
          generation.current++;
          clearTimeout(timer.current);
          setControl(undefined);
        }
      };
    },
  );
  const change = useStableCallback((value: string) => {
    generation.current++;
    clearTimeout(timer.current);
    setDirty(value !== initialValue.current);
    setFilled(value !== "");
    publish({ ...validityRef.current, value });
    if (name) form?.clearError(name);
    if (mode === "onChange" || (mode === "onSubmit" && form?.submitted.current)) {
      if (validationDebounceTime > 0 && value !== "") timer.current = setTimeout(commit, validationDebounceTime);
      else commit();
    }
  });
  const focus = useStableCallback((next: boolean) => {
    setFocused(next);
    if (!next) {
      setTouched(true);
      if (mode === "onBlur") commit();
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
  useIsoLayoutEffect(() => {
    if (!form || !control || disabled) return;
    form.fields.set(key, {
      name,
      getValue: () => input.current?.value ?? "",
      validate: commit,
      isInvalid: () =>
        Boolean(invalid || (name && form.errors[name]?.length) || validityRef.current.state.valid === false),
      focus: () => {
        input.current?.focus();
        input.current?.select();
      },
    });
    return () => {
      form.fields.delete(key);
    };
  }, [form, control, disabled, name, key, invalid, commit]);
  useIsoLayoutEffect(() => {
    if (!actionsRef) return;
    actionsRef.current = { validate: commit };
    return () => {
      actionsRef.current = null;
    };
  }, [actionsRef, commit]);
  const element = useRenderElement("div", props, {
    ref,
    state,
    props: elementProps,
    stateAttributesMapping: fieldValidityMapping,
  });
  const errors = serverError ? (typeof serverError === "string" ? [serverError] : serverError) : validity.errors;
  return (
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
      }}
    >
      {element}
    </FieldRootContext.Provider>
  );
}
export declare namespace FieldRoot {
  type Props = FieldRootProps;
  type State = FieldControlState;
  type Actions = { validate: () => void };
}
export type { FieldValidityData };