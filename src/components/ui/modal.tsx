import { type HTMLAttributes, type PropsWithChildren, createPortal, forwardRef, useEffect } from "preact/compat";
import { cn } from "./share/cn";
import { getScrollBarWidth } from "./share/getScrollBarWidth";
import { Show } from "./show";

type ModalProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    show: boolean;
  }
>;

const Modal = forwardRef<HTMLDivElement, ModalProps>(({ show, ...props }, ref) => {
  return createPortal(
    <Show when={show}>
      <ModalContent {...props} ref={ref} />
    </Show>,
    document.body
  );
});
Modal.displayName = "Modal";

type ModalContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  }
>;

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(({ className, ...props }, ref) => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    const scrollbarWidth = getScrollBarWidth(document.body);
    document.body.classList.add(`mr-[${scrollbarWidth}px]`);

    return () => {
      document.body.classList.remove("overflow-hidden");
      const scrollbarWidth = getScrollBarWidth(document.body);
      document.body.classList.remove(`mr-[${scrollbarWidth}px]`);
    };
  }, []);

  return (
    <div
      ref={ref}
      onClick={props.onClose}
      data-state="open"
      className={cn("fixed inset-0 z-50 bg-black/80 animate-in fade-in-0", className)}
      {...props}
    >
      {props.children}
    </div>
  );
});

export { Modal };
