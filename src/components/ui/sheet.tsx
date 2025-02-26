import { type VariantProps, cva } from "class-variance-authority";
import { X } from "lucide-preact";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  type HTMLAttributes,
  createRef,
  forwardRef,
  useEffect,
} from "preact/compat";
import {
  Dialog,
  DialogClose,
  type DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from "./dialog";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { Show } from "./show";

const Sheet = Dialog;

const SheetTrigger = DialogTrigger;

const SheetClose = DialogClose;

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom max-h-[50vh]",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

interface SheetContentProps
  extends ComponentPropsWithoutRef<typeof DialogContent>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = forwardRef<ElementRef<typeof DialogContent>, SheetContentProps>(
  ({ side = "right", className, children, ...props }, ref) => {
    const { open, closeDialog } = useDialog();
    const contentRef = createRef<HTMLDivElement>();

    useEffect(() => {
      if (open) {
        if (props.autoSelect) {
          contentRef.current?.parentElement?.querySelectorAll("input")[0]?.select();
        } else {
          contentRef.current?.parentElement?.querySelectorAll("input")[0]?.focus();
        }
      }
    }, [open]);

    return (
      <Show when={open}>
        <Modal onClose={closeDialog} show={true}>
          <div
            ref={contentRef}
            onClick={(e) => {
              e.stopPropagation();
            }}
            {...props}
          >
            <div
              data-state={open ? "open" : "closed"}
              className={cn("rounded-sm", sheetVariants({ side }), className)}
              ref={ref}
            >
              <button
                onClick={() => closeDialog()}
                data-state={open ? "open" : "closed"}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
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
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
SheetFooter.displayName = "SheetFooter";

const SheetTitle = forwardRef<ElementRef<typeof DialogTitle>, ComponentPropsWithoutRef<typeof DialogTitle>>(
  ({ className, ...props }, ref) => (
    <DialogTitle ref={ref} className={cn("text-lg font-semibold text-foreground", className)} {...props} />
  )
);
SheetTitle.displayName = DialogTitle.displayName;

const SheetDescription = forwardRef<
  ElementRef<typeof DialogDescription>,
  ComponentPropsWithoutRef<typeof DialogDescription>
>(({ className, ...props }, ref) => (
  <DialogDescription ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
SheetDescription.displayName = DialogDescription.displayName;

export { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger };
