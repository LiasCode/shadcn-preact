import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";
import { useControlledState } from "./share/useControlledState";

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors md:hover:bg-muted md:hover:text-muted-foreground md:focus-visible:outline-none md:focus-visible:ring-1 md:focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-sm md:hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?(pressed: boolean): void;
  };

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, class: classNative, variant, size, ...props }, forwardedRef) => {
    const [isOn, setIsOn] = useControlledState({
      defaultValue: Boolean(props.defaultPressed),
      controlledValue: props.pressed,
      onChange: props.onPressedChange,
    });

    return (
      <button
        ref={forwardedRef}
        data-state={isOn ? "on" : "off"}
        className={cn(toggleVariants({ variant, size, className }), classNative)}
        {...props}
        onClick={() => setIsOn(!isOn)}
      />
    );
  }
);
Toggle.displayName = "Toggle";
