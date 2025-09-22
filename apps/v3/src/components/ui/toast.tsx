import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-preact";
import type { ButtonHTMLAttributes, VNode } from "preact";
import { type HTMLAttributes, forwardRef } from "preact/compat";
import * as ReactHotToast from "react-hot-toast";
import { cn } from "./share/cn";

export const Toaster = (props: typeof ReactHotToast.Toaster.defaultProps) => (
  <ReactHotToast.Toaster
    position="bottom-right"
    reverseOrder={false}
    gutter={6}
    {...props}
  />
);

export const toastVariants = cva(
  "group pointer-events-auto relative flex flex-row gap-6 w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-4 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive: "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const ToastCard = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, class: classNative, variant, ...props }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      data-state="open"
      className={cn(toastVariants({ variant }), className, classNative)}
      {...props}
    />
  );
});
ToastCard.displayName = "ToastCard";

export const ToastAction = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { altText: string }>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <button
      ref={forwardedRef}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 font-medium text-sm transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:focus:ring-destructive group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground",
        className,
        classNative
      )}
      {...props}
    />
  )
);
ToastAction.displayName = "ToastAction";

export const ToastClose = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <button
      ref={forwardedRef}
      className={cn(
        "absolute top-1 right-1 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 group-[.destructive]:hover:text-red-50",
        className,
        classNative
      )}
      toast-close=""
      {...props}
    >
      <X className="h-4 w-4" />
    </button>
  )
);
ToastClose.displayName = "ToastClose";

export const ToastTitle = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <span
      ref={forwardedRef}
      className={cn("font-semibold text-sm [&+div]:text-xs", className, classNative)}
      {...props}
    />
  )
);
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <p
      ref={forwardedRef}
      className={cn("text-sm opacity-90", className, classNative)}
      {...props}
    />
  )
);
ToastDescription.displayName = "ToastDescription";

export interface ToastProps extends VariantProps<typeof toastVariants> {
  title?: string;
  description: string;
  action?: VNode<typeof ToastAction>;
}

export const toast = (props: ToastProps) => {
  const toastId = ReactHotToast.toast.custom(
    <ToastCard
      variant={props.variant}
      className="w-fit min-w-[20rem] pr-8"
    >
      <div>
        {props.title && <ToastTitle>{props.title}</ToastTitle>}
        <ToastDescription>{props.description}</ToastDescription>
      </div>

      {props.action}

      <ToastClose onClick={() => ReactHotToast.toast.remove(toastId)} />
    </ToastCard>
  );

  return toastId;
};
