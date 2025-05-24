import { type HTMLAttributes, type PropsWithChildren, createContext, createRef, forwardRef } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";

import { X } from "lucide-preact";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { Slot } from "./share/slot";
import { Show } from "./show";

const DialogContext = createContext<{
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

export type DialogProviderProps = PropsWithChildren & { open?: boolean; onChange?: (open: boolean) => void };

export function Dialog({ open: controlledIsOpen = false, children, onChange }: DialogProviderProps) {
  const [open, setOpen] = useState(controlledIsOpen);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (onChange && open !== controlledIsOpen) {
      onChange(open);
    }
  }, [open]);

  useEffect(() => {
    setOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  return <DialogContext.Provider value={{ open, openDialog, closeDialog }}>{children}</DialogContext.Provider>;
}

export function useDialog() {
  const c = useContext(DialogContext);
  if (!c) throw new Error("useDialog should be used within DialogProvider");
  return c;
}

export type DialogTriggerProps = PropsWithChildren & { asChild?: boolean };

export function DialogTrigger({ children, asChild }: DialogTriggerProps) {
  const { openDialog } = useDialog();
  const Comp = asChild ? Slot : "button";

  return <Comp onClick={openDialog}>{children}</Comp>;
}

export type DialogContentProps = HTMLAttributes<HTMLDivElement> & { autoSelect?: boolean };

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, class: classNative, children, ...props }) => {
    const { open, closeDialog } = useDialog();
    const contentRef = createRef<HTMLDivElement>();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (open) {
        if (props.autoSelect) {
          contentRef.current?.parentElement?.querySelectorAll("input")[0]?.select();
        } else {
          contentRef.current?.parentElement?.querySelectorAll("input")[0]?.focus();
        }
      }
    }, [open, contentRef.current]);

    return (
      <Show when={open}>
        <Modal onClose={closeDialog}>
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              ref={contentRef}
              onMouseDown={(e) => e.stopPropagation()}
              className={cn(
                "relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg",
                className,
                classNative
              )}
              {...props}
            >
              <button
                onClick={closeDialog}
                type="button"
                className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
              {children}
            </div>
          </div>
        </Modal>
      </Show>
    );
  }
);
DialogContent.displayName = "DialogContent";

export type DialogHeaderProps = HTMLAttributes<HTMLDivElement>;

export const DialogHeader = forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className, classNative)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className, classNative)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

export type DialogTitleProps = HTMLAttributes<HTMLDivElement>;

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("font-semibold text-lg leading-none tracking-tight", className, classNative)}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const DialogDescription = forwardRef<HTMLDivElement, DialogDescriptionProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-muted-foreground text-sm", className, classNative)}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

export type DialogCloseProps = PropsWithChildren<{ onCancel?: () => void; asChild?: boolean }>;

export const DialogClose = ({ children, onCancel, asChild }: DialogCloseProps) => {
  const { closeDialog } = useDialog();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      onClick={() => {
        closeDialog();
        if (onCancel) onCancel();
      }}
    >
      {children}
    </Comp>
  );
};
DialogClose.displayName = "DialogClose";
