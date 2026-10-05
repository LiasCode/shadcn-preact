import type { HTMLAttributes } from "preact";
import { useMemo } from "preact/hooks";

export interface UseFocusableWhenDisabledParameters {
  focusableWhenDisabled?: boolean;
  disabled?: boolean;
  composite?: boolean;
  tabIndex?: number;
  isNativeButton?: boolean;
}

export function useFocusableWhenDisabled(parameters: UseFocusableWhenDisabledParameters) {
  const {
    focusableWhenDisabled,
    disabled,
    composite = false,
    tabIndex = 0,
    isNativeButton,
  } = parameters;
  const isFocusableComposite = composite && focusableWhenDisabled !== false;
  const isNonFocusableComposite = composite && focusableWhenDisabled === false;
  const props = useMemo(() => {
    const additionalProps: HTMLAttributes<HTMLElement> & { disabled?: boolean } = {
      onKeyDown(event) {
        if (disabled && focusableWhenDisabled && event.key !== "Tab") {
          event.preventDefault();
        }
      },
    };

    if (!composite) {
      additionalProps.tabIndex = tabIndex;

      if (!isNativeButton && disabled) {
        additionalProps.tabIndex = focusableWhenDisabled ? tabIndex : -1;
      }
    }

    if (
      (isNativeButton && (focusableWhenDisabled || isFocusableComposite)) ||
      (!isNativeButton && disabled)
    ) {
      additionalProps["aria-disabled"] = disabled;
    }

    if (isNativeButton && (!focusableWhenDisabled || isNonFocusableComposite)) {
      additionalProps.disabled = disabled;
    }

    return additionalProps;
  }, [
    composite,
    disabled,
    focusableWhenDisabled,
    isFocusableComposite,
    isNonFocusableComposite,
    isNativeButton,
    tabIndex,
  ]);
  return { props };
}
