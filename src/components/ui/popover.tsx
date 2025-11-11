import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import type { CSSProperties } from "preact";
import {
  type HTMLAttributes,
  type MutableRefObject,
  type PropsWithChildren,
  createContext,
  forwardRef,
} from "preact/compat";
import { useContext, useEffect } from "preact/hooks";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { debounce } from "./share/debounce";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

type PopoverContextT = {
  open: boolean;
  defaultOpen?: boolean;
  openPopover: () => void;
  closePopover: () => void;
  ref: {
    reference: MutableRefObject<HTMLButtonElement | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLButtonElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
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
  defaultOpen?: boolean;
  alignment?: "start" | "end";
};

export function Popover({ children, open: controlledOpen, defaultOpen, onOpenChange, ...props }: PopoverProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: Boolean(defaultOpen),
    controlledValue: controlledOpen,
    onChange: onOpenChange,
  });

  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    open: open,
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

  const openPopover = () => setOpen(true);
  const closePopover = () => setOpen(false);

  return (
    <PopoverContext.Provider
      value={{
        closePopover,
        openPopover,
        open,
        defaultOpen: defaultOpen,
        ref: refs,
        floatingStyles,
        delay: props.delay,
        side: props.side,
      }}
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

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const { openPopover, open, ref, delay } = usePopover();

  const openDebounced = debounce(openPopover, delay || 50);

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      ref={ref.setReference}
      onClick={openDebounced}
      onFocus={openDebounced}
      data-state={open ? "open" : "closed"}
    >
      {children}
    </Comp>
  );
}

export type PopoverContentProps = HTMLAttributes<HTMLDivElement>;

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  ({ children, className, class: classNative, ...props }) => {
    const { open, ref, floatingStyles, side, closePopover } = usePopover();

    useEffect(() => {
      if (open) {
        ref.floating?.current?.querySelectorAll("input")[0]?.select();
      }
    }, [open, ref.floating]);

    return (
      <Show when={open}>
        <Modal
          onClose={closePopover}
          className="bg-transparent"
        >
          <div
            ref={ref.setFloating}
            onMouseDown={(e) => e.stopPropagation()}
            style={floatingStyles}
            data-state={open ? "open" : "closed"}
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
      </Show>
    );
  }
);
