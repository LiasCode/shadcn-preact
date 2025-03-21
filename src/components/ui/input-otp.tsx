import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-preact";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useContext } from "preact/compat";
import { cn } from "./share/cn";

const InputOTP = forwardRef<ElementRef<typeof OTPInput>, ComponentPropsWithoutRef<typeof OTPInput>>(
  ({ className, class: classNative, containerClassName, render, ...props }, ref) => (
    // @ts-expect-error
    <OTPInput
      ref={ref}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className, classNative)}
      {...props}
    />
  )
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(
  ({ className, class: classNative, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center", className, classNative)} {...props} />
  )
);
InputOTPGroup.displayName = "InputOTPGroup";

const InputOTPSlot = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div"> & { index: number }>(
  ({ index, className, class: classNative, ...props }, ref) => {
    const inputOTPContext = useContext(OTPInputContext);

    if (!inputOTPContext.slots[index]) {
      return null;
    }

    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-9 w-9 items-center justify-center border-input border-y border-r text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
          isActive && "z-10 ring-1 ring-ring",
          className,
          classNative
        )}
        {...props}
      >
        {char}
        {hasFakeCaret && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
          </div>
        )}
      </div>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = forwardRef<ElementRef<"div">, ComponentPropsWithoutRef<"div">>(({ ...props }, ref) => (
  // biome-ignore lint/a11y/useSemanticElements: <explanation>
  // biome-ignore lint/a11y/useFocusableInteractive: <explanation>
  <div ref={ref} role="separator" {...props}>
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";

export { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot };
