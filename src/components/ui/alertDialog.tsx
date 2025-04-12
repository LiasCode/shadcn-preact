import { type PropsWithChildren, createContext } from "preact/compat";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";
import { Button } from "./button";
import { Modal } from "./modal";
import { Show } from "./show";

export const AlertContext = createContext<{
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
} | null>(null);

export type AlertDialogProviderProps = PropsWithChildren & {
  open?: boolean;
  onChange?: (open: boolean) => void;
};

export function AlertDialog({ open: controlledIsOpen = false, children, onChange }: AlertDialogProviderProps) {
  const [open, setOpen] = useState(controlledIsOpen);

  const openDialog = useCallback(() => setOpen(true), []);
  const closeDialog = useCallback(() => setOpen(false), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (onChange && open !== controlledIsOpen) {
      onChange(open);
    }
  }, [open]);

  useEffect(() => {
    setOpen(controlledIsOpen);
  }, [controlledIsOpen]);

  const contextValue = useMemo(() => ({ open, openDialog, closeDialog }), [open, openDialog, closeDialog]);

  return <AlertContext.Provider value={contextValue}>{children}</AlertContext.Provider>;
}
AlertDialog.displayName = "AlertDialog";

export function useAlertDialog() {
  const c = useContext(AlertContext);

  if (!c) throw new Error("useAlertDialog should be used inside of an AlertDialogProvider");

  return c;
}

export type AlertDialogTriggerProps = PropsWithChildren & { asChild?: boolean };

export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const { openDialog } = useAlertDialog();

  return (
    <div
      onClick={openDialog}
      className="m-0 h-fit max-h-fit w-fit max-w-fit border-none bg-transparent p-0 outline-none"
    >
      {children}
    </div>
  );
}
AlertDialogTrigger.displayName = "AlertDialogTrigger";

export type AlertDialogContentProps = PropsWithChildren;

export function AlertDialogContent({ children }: AlertDialogContentProps) {
  const { open } = useAlertDialog();

  return (
    <Show when={open}>
      <Modal
        onClose={() => {}}
        show={true}
      >
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg"
          >
            {children}
          </div>
        </div>
      </Modal>
    </Show>
  );
}
AlertDialogContent.displayName = "AlertDialogContent";

export type AlertDialogHeaderProps = PropsWithChildren;

export const AlertDialogHeader = ({ children }: AlertDialogHeaderProps) => {
  return <div className="flex flex-col space-y-2 text-center sm:text-left">{children}</div>;
};
AlertDialogHeader.displayName = "AlertDialogHeader";

export type AlertDialogFooterProps = PropsWithChildren;

export const AlertDialogFooter = ({ children }: AlertDialogFooterProps) => {
  return <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">{children}</div>;
};
AlertDialogFooter.displayName = "AlertDialogFooter";

export type AlertDialogTitleProps = PropsWithChildren;

export const AlertDialogTitle = ({ children }: AlertDialogTitleProps) => {
  return <div className="font-semibold text-lg">{children}</div>;
};
AlertDialogTitle.displayName = "AlertDialogTitle";

export type AlertDialogDescriptionProps = PropsWithChildren;

export const AlertDialogDescription = ({ children }: AlertDialogDescriptionProps) => {
  return <div className="text-muted-foreground text-sm">{children}</div>;
};
AlertDialogDescription.displayName = "AlertDialogDescription";

export type AlertDialogCancelProps = PropsWithChildren<{ onCancel?: () => void }>;

export const AlertDialogCancel = ({ children, onCancel }: AlertDialogCancelProps) => {
  const { closeDialog } = useAlertDialog();

  return (
    <Button
      variant="outline"
      onClick={() => {
        closeDialog();
        onCancel?.();
      }}
      className="mt-2 sm:mt-0"
    >
      {children}
    </Button>
  );
};
AlertDialogCancel.displayName = "AlertDialogCancel";

export type AlertDialogActionProps = PropsWithChildren<{ onConfirm?: () => void }>;

export function AlertDialogAction({ children, onConfirm }: AlertDialogActionProps) {
  const { closeDialog } = useAlertDialog();

  return (
    <Button
      onClick={() => {
        closeDialog();
        onConfirm?.();
      }}
    >
      {children}
    </Button>
  );
}
AlertDialogAction.displayName = "AlertDialogAction";
