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

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, class: classNative, ...props }, ref) => {
    useEffect(() => {
      modal_counter += 1;

      const scrollbarWidth = getScrollBarWidth(document.body);
      // TODO: future use for remember previous body margin
      // const marginRigthComputed = document.body.computedStyleMap().get("margin-right")
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
        onMouseDown={props.onClose}
        data-state="open"
        className={cn("fade-in-0 fixed inset-0 z-50 animate-in bg-black/80", className, classNative)}
        {...props}
      >
        {props.children}
      </div>
    );
  }
);
