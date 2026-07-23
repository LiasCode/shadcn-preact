import { XIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import {
  forwardRef,
  type PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "preact/compat";

import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { useFocusTrap } from "./share/useFocusTrap";

type DialogContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  modal: boolean;
};

const DialogContext = createContext<DialogContextType | null>(null);

function useDialog() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used within a <Dialog>");
  return ctx;
}

type DialogProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}>;

function Dialog({ open: openProp, defaultOpen, onOpenChange, modal = true, children }: DialogProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });

  const reactId = useId();
  const titleId = `dialog-title-${reactId}`;
  const descriptionId = `dialog-description-${reactId}`;
  const value = useMemo(
    () => ({
      open,
      setOpen,
      titleId,
      descriptionId,
      modal,
    }),
    [descriptionId, modal, open, reactId, setOpen, titleId],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
}

function DialogPortal({ container, ...props }: ComponentProps<typeof Portal>) {
  return <Portal container={container} {...props} />;
}

type DialogTriggerProps = ComponentProps<"button"> & { asChild?: boolean };

const DialogTrigger = forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { open, setOpen } = useDialog();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        type={asChild ? undefined : "button"}
        data-slot="dialog-trigger"
        data-state={open ? "open" : "closed"}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          if (!e.defaultPrevented) setOpen(true);
        }}
        {...props}
      />
    );
  },
);
DialogTrigger.displayName = "DialogTrigger";

type DialogOverlayProps = ComponentProps<"div"> & {
  container?: Element | DocumentFragment | null;
};

const DialogOverlay = forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, container, ...props }, forwardedRef) => {
    const { open } = useDialog();
    const [present, setPresent] = useState(open);

    useEffect(() => {
      if (open) setPresent(true);
    }, [open]);

    if (!present) return null;

    return (
      <Portal container={container}>
        <div
          ref={forwardedRef}
          data-slot="dialog-overlay"
          data-state={open ? "open" : "closed"}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget && !open) setPresent(false);
          }}
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
          )}
          {...props}
        />
      </Portal>
    );
  },
);
DialogOverlay.displayName = "DialogOverlay";

type DialogContentProps = ComponentProps<"div"> & {
  container?: Element | DocumentFragment | null;
  showCloseButton?: boolean;
  role?: "dialog" | "alertdialog";
};

let lockCounter = 0;
let previousBodyOverflow = "";
let previousBodyMarginRight = "";

function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, container, showCloseButton = true, role = "dialog", onMouseDown, onKeyDown, ...props },
    forwardedRef,
  ) => {
    const { open, setOpen, titleId, descriptionId, modal } = useDialog();
    const [present, setPresent] = useState(open);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs(forwardedRef, contentRef);

    useFocusTrap(contentRef, open && modal);

    useEffect(() => {
      if (open) setPresent(true);
    }, [open]);

    useEffect(() => {
      if (!open || !modal) return;

      lockCounter += 1;
      if (lockCounter === 1) {
        previousBodyOverflow = document.body.style.overflow;
        previousBodyMarginRight = document.body.style.marginRight;
        document.body.style.overflow = "hidden";
        document.body.style.marginRight = `${getScrollbarWidth()}px`;
      }

      return () => {
        lockCounter -= 1;
        if (lockCounter === 0) {
          document.body.style.overflow = previousBodyOverflow;
          document.body.style.marginRight = previousBodyMarginRight;
        }
      };
    }, [modal, open]);

    useEffect(() => {
      if (!open) return;

      const onDocumentKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };

      document.addEventListener("keydown", onDocumentKeyDown);
      return () => document.removeEventListener("keydown", onDocumentKeyDown);
    }, [open, setOpen]);

    if (!present) return null;

    return (
      <Portal container={container}>
        <div
          data-slot="dialog-content-wrapper"
          className="fixed inset-0 z-50 flex items-center justify-center"
          onMouseDown={(e: MouseEvent) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          {/* biome-ignore lint/a11y/useAriaPropsSupportedByRole: `role` is constrained to dialog or alertdialog. */}
          <div
            ref={composedRef}
            role={role}
            aria-modal={modal}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            data-slot="dialog-content"
            data-state={open ? "open" : "closed"}
            tabIndex={-1}
            onAnimationEnd={(e: AnimationEvent) => {
              if (e.target === e.currentTarget && !open) setPresent(false);
            }}
            onMouseDown={(e: MouseEvent) => {
              (onMouseDown as ((e: MouseEvent) => void) | undefined)?.(e);
              e.stopPropagation();
            }}
            onKeyDown={onKeyDown}
            className={cn(
              "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-lg",
              className,
            )}
            {...props}
          >
            {children}
            {showCloseButton && (
              <DialogClose className="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            )}
          </div>
        </div>
      </Portal>
    );
  },
);
DialogContent.displayName = "DialogContent";

type DialogCloseProps = ComponentProps<"button"> & { asChild?: boolean };

const DialogClose = forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { setOpen } = useDialog();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={forwardedRef}
        type={asChild ? undefined : "button"}
        data-slot="dialog-close"
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        {...props}
      />
    );
  },
);
DialogClose.displayName = "DialogClose";

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

const DialogTitle = forwardRef<HTMLHeadingElement, ComponentProps<"h2">>(({ className, ...props }, forwardedRef) => {
  const { titleId } = useDialog();
  return (
    <h2
      ref={forwardedRef}
      id={titleId}
      data-slot="dialog-title"
      className={cn("font-semibold text-lg leading-none", className)}
      {...props}
    />
  );
});
DialogTitle.displayName = "DialogTitle";

const DialogDescription = forwardRef<HTMLParagraphElement, ComponentProps<"p">>(
  ({ className, ...props }, forwardedRef) => {
    const { descriptionId } = useDialog();
    return (
      <p
        ref={forwardedRef}
        id={descriptionId}
        data-slot="dialog-description"
        className={cn("text-muted-foreground text-sm", className)}
        {...props}
      />
    );
  },
);
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};