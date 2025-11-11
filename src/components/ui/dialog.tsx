import { X } from "lucide-preact";
import type { ButtonHTMLAttributes } from "preact";
import { type HTMLAttributes, type PropsWithChildren, createContext, createRef, forwardRef } from "preact/compat";
import { useContext, useEffect } from "preact/hooks";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

const DialogContext = createContext<{
  open: boolean;
  defaultOpen?: boolean;
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

export type DialogProviderProps = PropsWithChildren & {
  open?: boolean;
  defaultOpen?: boolean;
  onChange?: (open: boolean) => void;
};

export const Dialog = ({ open: controlledOpen, defaultOpen, children, onChange }: DialogProviderProps) => {
  const [open, setOpen] = useControlledState({
    defaultValue: Boolean(defaultOpen),
    controlledValue: controlledOpen,
    onChange: onChange,
  });

  return (
    <DialogContext.Provider
      value={{
        open,
        closeDialog: () => {
          setOpen(false);
        },
        openDialog: () => {
          setOpen(true);
        },
        defaultOpen,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export function useDialog() {
  const c = useContext(DialogContext);
  if (!c) throw new Error("useDialog should be used within DialogProvider");
  return c;
}

export type DialogTriggerProps = PropsWithChildren & { asChild?: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

export const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, asChild, ...props }, forwardedRef) => {
    const { openDialog } = useDialog();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        onClick={openDialog}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

export type DialogContentProps = HTMLAttributes<HTMLDivElement> & { autoSelect?: boolean };

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, class: classNative, children, ...props }, forwardedRef) => {
    const { open, closeDialog } = useDialog();
    const contentRef = createRef<HTMLDivElement>();

    const compose_refs = useComposedRefs(contentRef, forwardedRef);

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
              ref={compose_refs}
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
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className, classNative)}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className, classNative)}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

export type DialogTitleProps = HTMLAttributes<HTMLDivElement>;

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("font-semibold text-lg leading-none tracking-tight", className, classNative)}
      {...props}
    />
  )
);
DialogTitle.displayName = "DialogTitle";

export type DialogDescriptionProps = HTMLAttributes<HTMLDivElement>;

export const DialogDescription = forwardRef<HTMLDivElement, DialogDescriptionProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      className={cn("text-muted-foreground text-sm", className, classNative)}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";

export type DialogCloseProps = ButtonHTMLAttributes<HTMLButtonElement> &
  PropsWithChildren & { onCancel?: () => void; asChild?: boolean };

export const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, onCancel, asChild, ...props }, forwardedRef) => {
    const { closeDialog } = useDialog();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        onClick={() => {
          closeDialog();
          onCancel?.();
        }}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
DialogClose.displayName = "DialogClose";
