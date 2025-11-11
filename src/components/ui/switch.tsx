import type { ButtonHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";
import { useControlledState } from "./share/useControlledState";

export type SwitchProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  defaultChecked?: boolean;

  checked?: boolean;

  onCheckedChange?: (checked: boolean) => void;
};

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const [checked, setChecked] = useControlledState({
      defaultValue: Boolean(props.defaultChecked),
      controlledValue: props.checked,
      onChange: props.onCheckedChange,
    });

    return (
      <button
        data-state={checked ? "checked" : "unchecked"}
        onClick={() => {
          setChecked((prev) => !prev);
        }}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          className,
          classNative
        )}
        type={"button"}
        role={"switch"}
        {...props}
        ref={forwardedRef}
      >
        <span
          data-state={checked ? "checked" : "unchecked"}
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";
