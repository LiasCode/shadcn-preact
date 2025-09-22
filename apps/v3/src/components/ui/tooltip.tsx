import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import type { ButtonHTMLAttributes, CSSProperties } from "preact";
import {
  type HTMLAttributes,
  type MutableRefObject,
  type PropsWithChildren,
  createContext,
  forwardRef,
} from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { debounce } from "./share/debounce";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

type TooltipContextT = {
  ref: {
    reference: MutableRefObject<HTMLButtonElement | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLButtonElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };

  floatingStyles: CSSProperties;

  open: boolean;

  openTooltip: () => void;

  closeTooltip: () => void;

  delayDuration?: number;

  skipDelayDuration?: number;

  side?: "top" | "right" | "bottom" | "left";

  alignment?: "start" | "end";

  alignOffset?: number;
};

const TooltipContext = createContext<TooltipContextT | null>(null);

export type TooltipProviderProps = PropsWithChildren<{
  /**
   * The duration from when the mouse enters a tooltip trigger until the tooltip opens.
   **/
  delayDuration?: number;
  /**
   * How much time a user has to enter another trigger without incurring a delay again.
   **/
  skipDelayDuration?: number;

  defaultOpen?: boolean;

  open?: boolean;

  onOpenChange?: (open: boolean) => void;

  side?: "top" | "right" | "bottom" | "left";

  alignment?: "start" | "end";

  alignOffset?: number;
}>;

export const Tooltip = ({ children, ...props }: TooltipProviderProps) => {
  const [open, setIsOpen] = useControlledState<boolean>({
    defaultValue: props.defaultOpen,
    controlledValue: props.open,
    onChange: props.onOpenChange,
  });

  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    open: open,
    strategy: "fixed",
    placement: props.side,
    middleware: [
      autoPlacement({
        allowedPlacements: props.side ? [props.side, `${props.side}-start`, `${props.side}-end`] : undefined,
        alignment: props.alignment,
      }),
      shift(),
      offset(props.alignOffset || 4),
    ],
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  const openTooltip = useCallback(() => setIsOpen(true), [setIsOpen]);
  const closeTooltip = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <TooltipContext.Provider
      value={{
        ref: refs,
        open,
        openTooltip,
        closeTooltip,
        floatingStyles,
        delayDuration: props.delayDuration,
        skipDelayDuration: props.skipDelayDuration,
        alignment: props.alignment,
        alignOffset: props.alignOffset,
        side: props.side,
      }}
    >
      {children}
    </TooltipContext.Provider>
  );
};

export function useTooltip() {
  const c = useContext(TooltipContext);
  if (!c) throw new Error("useTooltip should be used within TooltipProvider");
  return c;
}

export type TooltipTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

export const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ children, asChild, className, class: classNative, ...props }, forwardedRef) => {
    const { open, openTooltip, closeTooltip, ref: floatingRef, delayDuration = 0 } = useTooltip();

    const composed_refs = useComposedRefs(forwardedRef, floatingRef.setReference);

    const data_state: "closed" | "delayed-open" | "instant-open" = useMemo(() => {
      return open ? (delayDuration > 0 ? "instant-open" : "delayed-open") : "closed";
    }, [open, delayDuration]);

    const Comp = asChild ? Slot : "button";

    const openDebounced = debounce(openTooltip, delayDuration);
    const closeDebounced = debounce(closeTooltip, delayDuration);

    return (
      <Comp
        ref={composed_refs}
        onMouseEnter={openDebounced}
        onMouseLeave={closeDebounced}
        onFocus={openDebounced}
        onBlur={closeDebounced}
        data-state={data_state}
        className={cn(className, classNative)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

export type TooltipContentProps = PropsWithChildren & HTMLAttributes<HTMLDivElement> & { asChild?: boolean };

export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ children, className, class: classNative, asChild, ...props }, forwardedRef) => {
    const { open, side, alignment, ref: floatingRef, floatingStyles } = useTooltip();

    const compose_refs = useComposedRefs(forwardedRef, floatingRef.setFloating);

    const Comp = asChild ? Slot : "div";

    return (
      <Show when={open}>
        <Comp
          ref={compose_refs}
          style={floatingStyles}
          data-side={side}
          data-align={alignment}
          data-state={open ? "open" : "closed"}
          className={cn(
            "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 z-50 animate-in overflow-hidden rounded-md bg-primary px-3 py-1 text-primary-foreground text-sm data-[state=closed]:animate-out",
            className,
            classNative
          )}
          {...props}
        >
          {children}
        </Comp>
      </Show>
    );
  }
);
