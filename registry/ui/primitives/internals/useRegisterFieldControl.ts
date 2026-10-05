import { useContext, useRef } from "preact/hooks";

import { FieldRootContext, isFieldFilled } from "./FieldRootContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

interface Parameters {
  inputRef: { current: HTMLInputElement | null };
  controlRef: { current: HTMLElement | null };
  id: string;
  name?: string;
  disabled: boolean;
  value: unknown;
  getFormValue?: () => unknown;
  getInput?: () => HTMLInputElement | null;
  focus?: () => void;
  isFilled?: (value: unknown) => boolean;
  isEqual?: (value: unknown, initialValue: unknown) => boolean;
}
/** Register the visible control, native constraint bridge and unencoded form value separately. */
export function useRegisterFieldControl(parameters: Parameters) {
  const field = useContext(FieldRootContext);
  const { inputRef, controlRef, id, name, disabled, value } = parameters;
  const valueRef = useRef(value);
  valueRef.current = value;
  const getValue = useStableCallback(() => valueRef.current);
  const getFormValue = useStableCallback(() =>
    parameters.getFormValue ? parameters.getFormValue() : getValue(),
  );
  const getInput = useStableCallback(() =>
    parameters.getInput ? parameters.getInput() : inputRef.current,
  );
  const focus = useStableCallback(() =>
    parameters.focus ? parameters.focus() : controlRef.current?.focus(),
  );
  const isFilled = useStableCallback((value: unknown) =>
    parameters.isFilled ? parameters.isFilled(value) : isFieldFilled(value),
  );
  const isEqual = useStableCallback((value: unknown, initial: unknown) =>
    parameters.isEqual
      ? parameters.isEqual(value, initial)
      : Array.isArray(value) && Array.isArray(initial)
        ? value.length === initial.length &&
          value.every((entry, index) => Object.is(entry, initial[index]))
        : Object.is(value, initial),
  );
  const register = field?.register;
  const active = useRef<
    { register: typeof register; id: string; name?: string; cleanup: () => void } | undefined
  >(undefined);
  useIsoLayoutEffect(() => {
    const input = getInput();

    if (
      active.current &&
      (!register ||
        disabled ||
        !input ||
        active.current.register !== register ||
        active.current.id !== id ||
        active.current.name !== name)
    ) {
      active.current.cleanup();
      active.current = undefined;
    }

    if (!active.current && register && !disabled && input) {
      active.current = {
        register,
        id,
        name,
        cleanup: register(input, id, name, {
          getValue,
          getFormValue,
          getInput,
          focus,
          isFilled,
          isEqual,
        }),
      };
    }
  });

  useIsoLayoutEffect(
    () => () => {
      active.current?.cleanup();
      active.current = undefined;
    },
    [],
  );
  const previous = useRef(value);
  useIsoLayoutEffect(() => {
    if (Object.is(previous.current, value)) {
      return;
    }

    previous.current = value;

    if (!disabled) {
      field?.change(value);
    }
  }, [value, disabled, field]);
  return field;
}
