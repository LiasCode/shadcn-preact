/** biome-ignore-all lint/a11y/useSemanticElements: <> */
/** biome-ignore-all lint/a11y/useAriaPropsForRole: <> */
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "lucide-preact";
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useContext } from "preact/compat";
import { cn } from "./share/cn";

export type InputOTPProps = ComponentPropsWithoutRef<typeof OTPInput>;

export const InputOTP = forwardRef<ElementRef<typeof OTPInput>, InputOTPProps>(
  ({ className, class: classNative, containerClassName, render, ...props }, forwardedRef) => (
    // @ts-expect-error
    <OTPInput
      ref={forwardedRef}
      containerClassName={cn("flex items-center gap-2 has-[:disabled]:opacity-50", containerClassName)}
      className={cn("disabled:cursor-not-allowed", className, classNative)}
      {...props}
    />
  )
);
InputOTP.displayName = "InputOTP";

export type InputOTPGroupProps = ComponentPropsWithoutRef<"div">;

export const InputOTPGroup = forwardRef<ElementRef<"div">, InputOTPGroupProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex items-center", className, classNative)}
      {...props}
    />
  )
);
InputOTPGroup.displayName = "InputOTPGroup";

export type InputOTPSlotProps = ComponentPropsWithoutRef<"div"> & {
  index: number;
};

export const InputOTPSlot = forwardRef<ElementRef<"div">, InputOTPSlotProps>(
  ({ index, className, class: classNative, ...props }, forwardedRef) => {
    const inputOTPContext = useContext(OTPInputContext);

    if (!inputOTPContext.slots[index]) {
      return null;
    }

    const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];

    return (
      <div
        ref={forwardedRef}
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

export type InputOTPSeparatorProps = ComponentPropsWithoutRef<"div">;

export const InputOTPSeparator = forwardRef<ElementRef<"div">, InputOTPSeparatorProps>(({ ...props }, forwardedRef) => (
  <div
    ref={forwardedRef}
    role="separator"
    tabIndex={-1}
    {...props}
  >
    <Minus />
  </div>
));
InputOTPSeparator.displayName = "InputOTPSeparator";
