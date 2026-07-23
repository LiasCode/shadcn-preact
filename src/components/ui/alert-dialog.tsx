import { Button, buttonVariants } from "./button";
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

const AlertDialog = Dialog;
const AlertDialogTrigger = DialogTrigger;
const AlertDialogPortal = DialogPortal;
const AlertDialogOverlay = DialogOverlay;
const AlertDialogHeader = DialogHeader;
const AlertDialogFooter = DialogFooter;
const AlertDialogTitle = DialogTitle;
const AlertDialogDescription = DialogDescription;

type AlertDialogContentProps = Parameters<typeof DialogContent>[0];

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <>
      <AlertDialogOverlay />
      <DialogContent
        role="alertdialog"
        showCloseButton={false}
        className={cn("sm:max-w-[425px]", className)}
        {...props}
      />
    </>
  );
}

type AlertDialogActionProps = Parameters<typeof Button>[0];

function AlertDialogAction({ className, ...props }: AlertDialogActionProps) {
  return (
    <DialogClose asChild>
      <Button className={className} {...props} />
    </DialogClose>
  );
}

type AlertDialogCancelProps = Parameters<typeof Button>[0];

function AlertDialogCancel({ className, ...props }: AlertDialogCancelProps) {
  return (
    <DialogClose asChild>
      <Button variant="outline" className={cn(buttonVariants({ variant: "outline" }), className)} {...props} />
    </DialogClose>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};