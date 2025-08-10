import { type HTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-slot="card"
      className={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        className,
        classNative
      )}
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
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
        classNative
      )}
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
      data-slot="card-title"
      className={cn("font-semibold leading-none", className, classNative)}
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
      data-slot="card-description"
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
      data-slot="card-content"
      className={cn("px-6", className, classNative)}
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
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className, classNative)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export type CardActionProps = HTMLAttributes<HTMLDivElement>;

export const CardAction = forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className, classNative)}
      {...props}
    />
  )
);
CardAction.displayName = "CardAction";
