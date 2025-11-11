import type { ButtonHTMLAttributes } from "preact";
import { type HTMLAttributes, type PropsWithChildren, createContext, forwardRef } from "preact/compat";
import { useContext } from "preact/hooks";
import { Button } from "./button";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

export const AlertContext = createContext<{
  open: boolean;
  defaultOpen?: boolean;
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

export type AlertDialogProviderProps = PropsWithChildren & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function AlertDialog({ open: controlledOpen, defaultOpen, children, onOpenChange }: AlertDialogProviderProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: Boolean(defaultOpen),
    controlledValue: controlledOpen,
    onChange: onOpenChange,
  });

  return (
    <AlertContext.Provider
      value={{
        open,
        defaultOpen,
        openDialog: () => setOpen(true),
        closeDialog: () => setOpen(false),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
}
AlertDialog.displayName = "AlertDialog";

export function useAlertDialog() {
  const c = useContext(AlertContext);
  if (!c) throw new Error("useAlertDialog should be used inside of an AlertDialogProvider");
  return c;
}

export type AlertDialogTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{ asChild?: boolean }>;

export const AlertDialogTrigger = forwardRef<HTMLButtonElement, AlertDialogTriggerProps>(
  ({ children, asChild, className, class: classNative, ...props }, forwardedRef) => {
    const { openDialog, open } = useAlertDialog();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        onClick={openDialog}
        data-state={open ? "open" : "closed"}
        className={cn(className, classNative)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
AlertDialogTrigger.displayName = "AlertDialogTrigger";

export type AlertDialogContentProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    const { open } = useAlertDialog();

    return (
      <Show when={open}>
        <Modal>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              ref={forwardedRef}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                className,
                classNative
              )}
              {...props}
            >
              {children}
            </div>
          </div>
        </Modal>
      </Show>
    );
  }
);
AlertDialogContent.displayName = "AlertDialogContent";

export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const AlertDialogHeader = forwardRef<HTMLDivElement, AlertDialogHeaderProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("flex flex-col space-y-2 text-center sm:text-left", className, classNative)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AlertDialogHeader.displayName = "AlertDialogHeader";

export type AlertDialogFooterProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const AlertDialogFooter = forwardRef<HTMLDivElement, AlertDialogFooterProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className, classNative)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AlertDialogFooter.displayName = "AlertDialogFooter";

export type AlertDialogTitleProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const AlertDialogTitle = forwardRef<HTMLDivElement, AlertDialogTitleProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("font-semibold text-lg", className, classNative)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AlertDialogTitle.displayName = "AlertDialogTitle";

export type AlertDialogDescriptionProps = HTMLAttributes<HTMLDivElement> & PropsWithChildren;

export const AlertDialogDescription = forwardRef<HTMLDivElement, AlertDialogDescriptionProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("text-muted-foreground text-sm", className, classNative)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AlertDialogDescription.displayName = "AlertDialogDescription";

export type AlertDialogCancelProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{ onCancel?: () => void; asChild?: boolean }>;

export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  ({ children, className, onCancel, ...props }, forwardedRef) => {
    const { closeDialog } = useAlertDialog();

    return (
      <Button
        ref={forwardedRef}
        variant="outline"
        onClick={() => {
          closeDialog();
          onCancel?.();
        }}
        className={cn("mt-2 sm:mt-0", className)}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export type AlertDialogActionProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren<{ onConfirm?: () => void; asChild?: boolean }>;

export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  ({ children, className, class: classNative, onConfirm, ...props }, forwardedRef) => {
    const { closeDialog } = useAlertDialog();

    return (
      <Button
        ref={forwardedRef}
        onClick={() => {
          closeDialog();
          onConfirm?.();
        }}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
AlertDialogAction.displayName = "AlertDialogAction";
