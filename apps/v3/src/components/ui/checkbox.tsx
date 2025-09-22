import { Check } from "lucide-preact";
import type { ButtonHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";
import { useControlledState } from "./share/useControlledState";

type CheckedState = boolean;

export type CheckboxProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  required?: boolean;
  onCheckedChange?(checked: CheckedState): void;
  disabled?: boolean;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      disabled,
      className,
      class: classNative,
      checked: controlledChecked,
      defaultChecked,
      required,
      onCheckedChange,
      ...props
    },
    forwardedRef
  ) => {
    const [checked, setChecked] = useControlledState({
      defaultValue: Boolean(defaultChecked),
      controlledValue: controlledChecked,
      onChange: onCheckedChange,
    });

    return (
      <>
        {/** biome-ignore lint/a11y/useSemanticElements: <> */}
        <button
          ref={forwardedRef}
          disabled={disabled}
          className={cn(
            "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
            className,
            classNative
          )}
          type="button"
          aria-checked={checked}
          data-state={checked ? "checked" : "unchecked"}
          data-disabled={disabled}
          role={"checkbox"}
          value={checked ? "on" : "off"}
          onClick={() => {
            if (disabled === true) return;
            setChecked((prev) => !prev);
          }}
          {...props}
        >
          <div className="flex items-center justify-center text-current">
            {checked ? <Check className="h-4 w-4" /> : null}
          </div>
        </button>

        <input
          name={props.name}
          form={props.form}
          type="checkbox"
          aria-hidden="true"
          data-state={checked ? "checked" : "unchecked"}
          data-disabled={disabled}
          style="transform: translateX(-100%); position: absolute; pointer-events: none; opacity: 0; margin: 0px; width: 25px; height: 25px;"
          tabIndex={-1}
          value={checked ? "on" : "off"}
          checked={checked}
        />
      </>
    );
  }
);
Checkbox.displayName = "Checkbox";
