import { useCallback, useRef, useState } from "preact/hooks";

export interface UseControlledProps<T> {
  /** The value when controlled; `undefined` makes the state uncontrolled. */
  controlled: T | undefined;
  /** The initial value when uncontrolled. */
  default: T | undefined;
  /** The component name, for messages. */
  name: string;
  /** The name of the state, for messages. */
  state?: string;
}

/**
 * Supports controlled and uncontrolled state with one API. Whether the state is controlled is decided on the first
 * render and kept for the lifetime of the component.
 */
export function useControlled<T>({
  controlled,
  default: defaultProp,
}: UseControlledProps<T>): [T, (newValue: T | ((prevValue: T) => T)) => void] {
  const { current: isControlled } = useRef(controlled !== undefined);
  const [valueState, setValue] = useState(defaultProp);
  const value = isControlled ? controlled : valueState;

  const setValueIfUncontrolled = useCallback((newValue: T | ((prevValue: T) => T)) => {
    if (!isControlled) {
      setValue(newValue as T);
    }
  }, []);

  return [value as T, setValueIfUncontrolled];
}
