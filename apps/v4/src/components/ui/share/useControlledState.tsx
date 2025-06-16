import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef, useState } from "preact/compat";

type useControlledStateProps<T> = {
  defaultValue?: T;
  controlledValue?: T;
  onChange?: (value: T) => void;
};
/**
 * Hook for managing controlled/uncontrolled state with enhanced functionality
 * @param defaultValue - initial value when uncontrolled
 * @param controlledValue - controlled value from parent component
 * @param onChange - callback executed when state changes
 * @returns [current state, setter function, utilities]
 */
export function useControlledState<T>({
  onChange,
  defaultValue,
  controlledValue,
}: useControlledStateProps<T>): [T, Dispatch<SetStateAction<T>>, { isControlled: boolean; reset: () => void }] {
  const isControlled = controlledValue !== undefined;
  const initialValue = useRef(defaultValue);

  const [internalValue, setInternalValue] = useState<T>(() => {
    if (isControlled) return controlledValue;
    if (defaultValue !== undefined) return defaultValue;
    return undefined as T;
  });

  const value = isControlled ? controlledValue : internalValue;

  // Memoized setter to prevent unnecessary re-renders
  const setValue = useCallback<Dispatch<SetStateAction<T>>>(
    (newValue) => {
      const resolvedValue = typeof newValue === "function" ? (newValue as (prevState: T) => T)(value) : newValue;

      if (!isControlled) {
        setInternalValue(resolvedValue);
      }

      // Always call onChange, even in controlled mode
      onChange?.(resolvedValue);
    },
    [isControlled, onChange, value]
  );

  // Reset function to restore initial value
  const reset = useCallback(() => {
    const resetValue = initialValue.current;
    if (!isControlled && resetValue !== undefined) {
      setInternalValue(resetValue);
    }
    onChange?.(resetValue as T);
  }, [isControlled, onChange]);

  // Sync controlled value changes
  useEffect(() => {
    if (isControlled && controlledValue !== internalValue) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue, isControlled, internalValue]);

  return [
    value,
    setValue,
    {
      isControlled,
      reset,
    },
  ];
}
