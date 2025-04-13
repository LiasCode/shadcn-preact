import { type HTMLAttributes, type PropsWithChildren, createPortal, forwardRef, useEffect } from "preact/compat";
import { cn } from "./share/cn";
import { getScrollBarWidth } from "./share/getScrollBarWidth";
import { Show } from "./show";

export type ModalProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
    show: boolean;
  }
>;

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ show, ...props }, ref) => {
  if (typeof window !== "undefined") {
    return createPortal(
      <Show when={show}>
        <ModalContent {...props} ref={ref} />
      </Show>,
      document.body
    );
  }
  return null;
});
Modal.displayName = "Modal";

export type ModalContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose: () => void;
  }
>;

let modal_counter = 0;

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, class: classNative, ...props }, ref) => {
    useEffect(() => {
      modal_counter += 1;

      const scrollbarWidth = getScrollBarWidth(document.body);
      document.body.classList.add("overflow-hidden");
      document.body.style.marginRight = `${scrollbarWidth}px`;

      return () => {
        modal_counter -= 1;
        if (modal_counter === 0) {
          document.body.classList.remove("overflow-hidden");
          document.body.style.marginRight = `${0}px`;
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        onClick={props.onClose}
        data-state="open"
        className={cn("fade-in-0 fixed inset-0 z-50 animate-in bg-black/80", className, classNative)}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
