import { type ComponentProps, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

const Label = forwardRef<HTMLLabelElement, ComponentProps<"label">>(({ className, ...props }, forwardedRef) => {
  return (
    <label
      ref={forwardedRef}
      data-slot="label"
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
        className
      )}
      {...props}
      htmlFor={props.htmlFor}
      aria-label={props["aria-label"]}
    />
  );
});

export { Label };
