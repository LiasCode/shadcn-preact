import { type VariantProps, cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, class: classNative, variant, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className, classNative)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn("col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight", className, classNative)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-muted-foreground text-sm [&_p]:leading-relaxed",
        className,
        classNative
      )}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";
