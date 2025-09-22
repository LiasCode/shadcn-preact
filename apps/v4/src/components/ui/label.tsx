import type { LabelHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export type LabelProps = LabelHTMLAttributes;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <label
      ref={forwardedRef}
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className,
        classNative
      )}
      {...props}
      htmlFor={props.htmlFor}
      aria-labelledby={props["aria-labelledby"]}
    />
  )
);
Label.displayName = "Label";
