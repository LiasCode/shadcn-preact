import { cva, type VariantProps } from "class-variance-authority";
import {
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
} from "./dialog";
import { cn } from "./share/cn";

const Sheet = Dialog;
const SheetTrigger = DialogTrigger;
const SheetClose = DialogClose;
const SheetPortal = DialogPortal;
const SheetOverlay = DialogOverlay;
const SheetHeader = DialogHeader;
const SheetFooter = DialogFooter;
const SheetTitle = DialogTitle;
const SheetDescription = DialogDescription;

const sheetVariants = cva(
  "fixed z-50 gap-4 rounded-none bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 bottom-auto left-0 max-w-none translate-x-0 translate-y-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom:
          "inset-x-0 top-auto bottom-0 left-0 max-w-none translate-x-0 translate-y-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 top-0 right-auto left-0 h-full w-3/4 max-w-none translate-x-0 translate-y-0 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right:
          "inset-y-0 top-0 right-0 left-auto h-full w-3/4 max-w-none translate-x-0 translate-y-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right",
    },
  }
);

type SheetContentProps = Parameters<typeof Dialog>[0] &
  Parameters<typeof DialogContent>[0] &
  VariantProps<typeof sheetVariants> & {
    className?: string;
  };

function SheetContent({
  side = "right",
  className,
  children,
  showCloseButton = true,
  container,
  ...props
}: SheetContentProps) {
  return (
    <>
      <SheetOverlay container={container} />
      <DialogContent
        container={container}
        data-slot="sheet-content"
        showCloseButton={showCloseButton}
        className={cn(sheetVariants({ side }), className)}
        {...props}
      >
        {children}
      </DialogContent>
    </>
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
  sheetVariants,
};
