import { useCallback, useRef } from "preact/hooks";

import { makeEventPreventable, mergeProps } from "../merge-props";
import type { HTMLProps } from "./types";
import { useFocusableWhenDisabled } from "./useFocusableWhenDisabled";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

export interface UseButtonParameters {
  disabled?: boolean;
  focusableWhenDisabled?: boolean;
  tabIndex?: number;
  native?: boolean;
  composite?: boolean;
}

export function useButton(parameters: UseButtonParameters = {}) {
  const {
    disabled = false,
    focusableWhenDisabled,
    tabIndex = 0,
    native: isNativeButton = true,
    composite = false,
  } = parameters;
  const elementRef = useRef<HTMLElement | null>(null);
  const { props: focusableProps } = useFocusableWhenDisabled({
    disabled,
    focusableWhenDisabled,
    tabIndex,
    isNativeButton,
    composite,
  });
  const updateDisabled = useCallback(() => {
    const element = elementRef.current;
    if (
      isButtonElement(element) &&
      composite &&
      disabled &&
      focusableProps.disabled === undefined &&
      element.disabled
    ) {
      element.disabled = false;
    }
  }, [composite, disabled, focusableProps.disabled]);
  useIsoLayoutEffect(updateDisabled, [updateDisabled]);
  const getButtonProps = useCallback(
    (externalProps: HTMLProps<HTMLElement> = {}) => {
      const { onClick, onMouseDown, onKeyDown, onKeyUp, onPointerDown, ...otherExternalProps } = externalProps;
      return mergeProps<"button">(
        {
          onClick(event) {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onClick?.(event);
          },
          onMouseDown(event) {
            if (!disabled) onMouseDown?.(event);
          },
          onPointerDown(event) {
            if (disabled) {
              event.preventDefault();
              return;
            }
            onPointerDown?.(event);
          },
          onKeyDown(event) {
            if (disabled) return;
            makeEventPreventable(event);
            onKeyDown?.(event);
            if (event.baseUIHandlerPrevented) return;
            const isCurrentTarget = event.target === event.currentTarget;
            const currentTarget = event.currentTarget;
            const isButton = isButtonElement(currentTarget);
            const isLink = !isNativeButton && isValidLinkElement(currentTarget);
            const shouldClick = isCurrentTarget && (isNativeButton ? isButton : !isLink);
            const isEnterKey = event.key === "Enter";
            const isSpaceKey = event.key === " ";
            const role = currentTarget.getAttribute("role");
            const isTextNavigationRole = role?.startsWith("menuitem") || role === "option" || role === "gridcell";
            if (isCurrentTarget && composite && isSpaceKey) {
              if (event.defaultPrevented && isTextNavigationRole) return;
              event.preventDefault();
              if (isLink || (isNativeButton && isButton)) {
                currentTarget.click();
                event.preventBaseUIHandler();
              } else if (shouldClick) {
                onClick?.(event as never);
                event.preventBaseUIHandler();
              }
              return;
            }
            if (shouldClick && !isNativeButton) {
              if (isSpaceKey || isEnterKey) event.preventDefault();
              if (isEnterKey) onClick?.(event as never);
            }
          },
          onKeyUp(event) {
            if (disabled) return;
            makeEventPreventable(event);
            onKeyUp?.(event);
            if (
              event.target === event.currentTarget &&
              isNativeButton &&
              composite &&
              isButtonElement(event.currentTarget) &&
              event.key === " "
            ) {
              event.preventDefault();
              return;
            }
            if (event.baseUIHandlerPrevented) return;
            if (event.target === event.currentTarget && !isNativeButton && !composite && event.key === " ")
              onClick?.(event as never);
          },
        },
        isNativeButton ? { type: "button" } : { role: "button" },
        focusableProps as never,
        otherExternalProps as never,
      );
    },
    [disabled, focusableProps, composite, isNativeButton],
  );
  const buttonRef = useStableCallback((element: HTMLElement | null) => {
    elementRef.current = element;
    updateDisabled();
  });
  return { getButtonProps, buttonRef };
}

function isButtonElement(element: HTMLElement | null): element is HTMLButtonElement {
  return element?.tagName === "BUTTON";
}
function isValidLinkElement(element: HTMLElement) {
  return element.tagName === "A" && Boolean((element as HTMLAnchorElement).href);
}