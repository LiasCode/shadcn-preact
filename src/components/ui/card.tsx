import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("rounded-xl border bg-card text-card-foreground shadow", className, classNative)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex flex-col space-y-1.5 p-6", className, classNative)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

export type CardTitleProps = HTMLAttributes<HTMLDivElement>;

export const CardTitle = forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("font-semibold leading-none tracking-tight", className, classNative)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

export type CardDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const CardDescription = forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("text-muted-foreground text-sm", className, classNative)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("p-6 pt-0", className, classNative)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex items-center p-6 pt-0", className, classNative)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";
