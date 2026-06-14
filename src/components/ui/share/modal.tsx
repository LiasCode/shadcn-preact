import { type HTMLAttributes, type PropsWithChildren, forwardRef, useEffect } from "preact/compat";
import { cn } from "./cn";
import { getScrollBarWidth } from "./getScrollBarWidth";
import { Portal } from "./portal";

export type ModalProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
  }
>;

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({ ...props }, ref) => {
  return (
    <Portal>
      <ModalContent
        {...props}
        ref={ref}
      />
    </Portal>
  );
});
Modal.displayName = "Modal";

export type ModalContentProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement> & {
    onClose?: () => void;
  }
>;

let modal_counter = 0;
// Remembered body styles, captured when the first modal opens and restored when the last one closes.
let previous_overflow_hidden = false;
let previous_margin_right = "";

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, class: classNative, onClose, ...props }, ref) => {
    useEffect(() => {
      modal_counter += 1;

      if (modal_counter === 1) {
        const scrollbarWidth = getScrollBarWidth(document.body);
        previous_overflow_hidden = document.body.classList.contains("overflow-hidden");
        previous_margin_right = document.body.style.marginRight;

        document.body.classList.add("overflow-hidden");
        document.body.style.marginRight = `${scrollbarWidth}px`;
      }

      return () => {
        modal_counter -= 1;
        if (modal_counter === 0) {
          if (!previous_overflow_hidden) document.body.classList.remove("overflow-hidden");
          document.body.style.marginRight = previous_margin_right;
        }
      };
    }, []);

    useEffect(() => {
      if (!onClose) return;
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", onKeyDown);
      return () => document.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    return (
      <div
        ref={ref}
        // Only close when the backdrop itself is pressed, not when interacting with its children.
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose?.();
        }}
        role="dialog"
        aria-modal="true"
        data-state="open"
        className={cn("fade-in-0 fixed inset-0 z-50 animate-in bg-black/80", className, classNative)}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
