import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import {
  type CSSProperties,
  type HTMLAttributes,
  type MutableRefObject,
  type PropsWithChildren,
  createContext,
  forwardRef,
} from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { debounce } from "./share/debounce";

type PopoverContextT = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  id: string;
  ref: {
    reference: MutableRefObject<HTMLDivElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLDivElement) => void;
    setFloating: (node: HTMLElement) => void;
  };
  floatingStyles: CSSProperties;
  delay?: number;
  side?: "top" | "right" | "bottom" | "left";
};

const PopoverContext = createContext<PopoverContextT | null>(null);

export type PopoverProps = PropsWithChildren & {
  delay?: number;
  side?: "top" | "right" | "bottom" | "left";
  alignOffset?: number;
  onOpenChange?: (o: boolean) => void;
  open?: boolean;
  alignment?: "start" | "end";
};

export function Popover({ children, open: controlledOpen, onOpenChange, ...props }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(controlledOpen !== undefined ? controlledOpen : false);
  const [popover_id] = useState(Math.random().toString());

  const { refs, floatingStyles } = useFloating<HTMLDivElement>({
    open: isOpen,
    strategy: "fixed",
    middleware: [
      autoPlacement({
        allowedPlacements: props.side
          ? props.alignment
            ? [`${props.side}-end`, `${props.side}-start`, props.side]
            : [props.side]
          : undefined,
        alignment: props.alignment,
      }),
      shift(),
      offset(props.alignOffset || 4),
    ],
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (onOpenChange && isOpen !== controlledOpen) {
      onOpenChange(isOpen);
    }
  }, [isOpen]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsOpen(controlledOpen);
    }
  }, [controlledOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <PopoverContext.Provider
      value={{ isOpen, open, close, id: popover_id, ref: refs, floatingStyles, delay: props.delay, side: props.side }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export function usePopover() {
  const c = useContext(PopoverContext);
  if (!c) throw new Error("usePopover should be used within PopoverProvider");
  return c;
}

export type PopoverTriggerProps = PropsWithChildren & { asChild?: boolean };

export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const { open, isOpen, ref, delay } = usePopover();

  const openDebounced = debounce(open, delay || 50);

  return (
    <div
      // @ts-expect-error
      ref={ref.setReference}
      onClick={openDebounced}
      onFocus={openDebounced}
      data-state={isOpen ? "open" : "closed"}
      className="relative m-0 w-fit border-0 border-none bg-transparent p-0 outline-none"
    >
      {children}
    </div>
  );
}

export type PopoverContentProps = HTMLAttributes<HTMLDivElement>;

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className, class: classNative, ...props }) => {
    const { isOpen, ref, floatingStyles, side, close, id } = usePopover();

    useEffect(() => {
      if (isOpen) {
        ref.floating?.current?.querySelectorAll("input")[0]?.select();
      }
    }, [isOpen, ref.floating]);

    return (
      <Modal onClose={close} show={isOpen} className="bg-transparent">
        <div
          data-popover-id={id}
          // @ts-expect-error
          ref={ref.setFloating}
          onMouseDown={(e) => e.stopPropagation()}
          style={floatingStyles}
          data-state={isOpen ? "open" : "closed"}
          data-side={side || "bottom"}
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
            classNative
          )}
          {...props}
        >
          {children}
        </div>
      </Modal>
    );
  }
);
