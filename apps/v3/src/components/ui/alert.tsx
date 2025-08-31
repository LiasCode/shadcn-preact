import { type VariantProps, cva } from "class-variance-authority";
import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type AlertProps = HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, class: classNative, variant, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      role="alert"
      className={cn(alertVariants({ variant }), className, classNative)}
      {...props}
    />
  )
);
Alert.displayName = "Alert";

export type AlertTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const AlertTitle = forwardRef<HTMLParagraphElement, AlertTitleProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <h5
      ref={forwardedRef}
      className={cn("mb-1 font-medium leading-none tracking-tight", className, classNative)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

export type AlertDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("text-sm [&_p]:leading-relaxed", className, classNative)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";
