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

const Drawer = Dialog;
const DrawerTrigger = DialogTrigger;
const DrawerClose = DialogClose;
const DrawerPortal = DialogPortal;
const DrawerOverlay = DialogOverlay;
const DrawerHeader = DialogHeader;
const DrawerFooter = DialogFooter;
const DrawerTitle = DialogTitle;
const DrawerDescription = DialogDescription;

type DrawerContentProps = Parameters<typeof DialogContent>[0];

function DrawerContent({ className, children, container, showCloseButton = false, ...props }: DrawerContentProps) {
  return (
    <>
      <DrawerOverlay container={container} />
      <DialogContent
        container={container}
        data-slot="drawer-content"
        showCloseButton={showCloseButton}
        className={cn(
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom top-auto right-0 bottom-0 left-0 mt-24 max-h-[80vh] max-w-none translate-x-0 translate-y-0 rounded-t-[10px] rounded-b-none border-b-0 p-0 sm:max-w-none",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DialogContent>
    </>
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};