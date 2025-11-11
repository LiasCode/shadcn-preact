import { type VariantProps, cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-muted hover:text-muted-foreground disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-accent hover:text-accent-foreground",
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

type ToggleProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof toggleVariants> & {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?(pressed: boolean): void;
    asChild?: boolean;
  };

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(({ className, variant, size, ...props }, forwardedRef) => {
  const [isPressed, setIsPressed] = useControlledState({
    defaultValue: Boolean(props.defaultPressed),
    controlledValue: props.pressed,
    onChange: props.onPressedChange,
  });

  const Comp = props.asChild ? Slot : "button";

  return (
    <Comp
      type="button"
      data-slot="toggle"
      aria-pressed={isPressed}
      data-state={isPressed ? "on" : "off"}
      className={cn(toggleVariants({ variant, size, className }))}
      data-disabled={props.disabled ? "" : undefined}
      {...props}
      ref={forwardedRef}
      onClick={(e) => {
        //@ts-expect-error
        props.onClick?.(e);

        if (Boolean(props.disabled) !== true) {
          setIsPressed(!isPressed);
        }
      }}
    />
  );
});

export { Toggle, toggleVariants, type ToggleProps };
