import type { BaseUIComponentProps, NativeButtonProps, ElementRef } from "../internals/types";
import { useButton } from "../internals/useButton";
import { useRenderElement } from "../internals/useRenderElement";

export interface ButtonState {
  disabled: boolean;
}

export interface ButtonProps
  extends NativeButtonProps, Omit<BaseUIComponentProps<"button", ButtonState>, "ref"> {
  ref?: ElementRef<HTMLElement>;
  focusableWhenDisabled?: boolean;
}

export function Button(componentProps: ButtonProps) {
  const {
    ref,
    render: _render,
    className: _className,
    disabled = false,
    focusableWhenDisabled = false,
    nativeButton = true,
    style: _style,
    ...elementProps
  } = componentProps;
  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled,
    native: nativeButton,
  });
  return useRenderElement("button", componentProps, {
    state: { disabled },
    ref: [ref ?? null, buttonRef],
    props: [elementProps, getButtonProps],
  });
}

export declare namespace Button {
  type State = ButtonState;

  type Props = ButtonProps;
}
