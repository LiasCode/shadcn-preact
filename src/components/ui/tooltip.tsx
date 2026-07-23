import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useId, useMemo, useRef } from "preact/compat";

import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { type FloatingAlign, type FloatingSide, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";

type TooltipContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  delayDuration: number;
  triggerId: string;
  contentId: string;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);
const TooltipProviderContext = createContext({ delayDuration: 0 });

function useTooltip() {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("Tooltip components must be used within a <Tooltip>");
  return ctx;
}

type TooltipProviderProps = PropsWithChildren<{ delayDuration?: number }>;

function TooltipProvider({ delayDuration = 0, children }: TooltipProviderProps) {
  return <TooltipProviderContext.Provider value={{ delayDuration }}>{children}</TooltipProviderContext.Provider>;
}

type TooltipProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  delayDuration?: number;
}>;

function Tooltip({ open: openProp, defaultOpen, onOpenChange, delayDuration, children }: TooltipProps) {
  const provider = useContext(TooltipProviderContext);
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });
  const reactId = useId();
  const [trigger, setTrigger] = useControlledState<HTMLElement | null>({
    defaultValue: null,
  });

  const value = useMemo(
    () => ({
      open,
      setOpen,
      delayDuration: delayDuration ?? provider.delayDuration,
      triggerId: `tooltip-trigger-${reactId}`,
      contentId: `tooltip-content-${reactId}`,
      trigger,
      setTrigger,
    }),
    [delayDuration, open, provider.delayDuration, reactId, setOpen, setTrigger, trigger],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}

type TooltipTriggerProps = ComponentProps<"button"> & { asChild?: boolean };

const TooltipTrigger = forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  ({ asChild = false, onBlur, onFocus, onPointerEnter, onPointerLeave, ...props }, forwardedRef) => {
    const { open, setOpen, delayDuration, setTrigger, triggerId, contentId } = useTooltip();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const composedRef = useComposedRefs(forwardedRef, setTrigger);
    const Comp = asChild ? Slot : "button";

    const clearTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };

    const show = () => {
      clearTimer();
      timeoutRef.current = setTimeout(() => setOpen(true), delayDuration);
    };

    const hide = () => {
      clearTimer();
      setOpen(false);
    };

    return (
      <Comp
        ref={composedRef}
        id={triggerId}
        type={asChild ? undefined : "button"}
        data-slot="tooltip-trigger"
        data-state={open ? "open" : "closed"}
        aria-describedby={open ? contentId : undefined}
        onPointerEnter={(e: PointerEvent) => {
          (onPointerEnter as ((e: PointerEvent) => void) | undefined)?.(e);
          show();
        }}
        onPointerLeave={(e: PointerEvent) => {
          (onPointerLeave as ((e: PointerEvent) => void) | undefined)?.(e);
          hide();
        }}
        onFocus={(e: FocusEvent) => {
          (onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
          show();
        }}
        onBlur={(e: FocusEvent) => {
          (onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
          hide();
        }}
        {...props}
      />
    );
  },
);
TooltipTrigger.displayName = "TooltipTrigger";

type TooltipContentProps = ComponentProps<"div"> & {
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  container?: Element | DocumentFragment | null;
};

const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, side = "top", align = "center", sideOffset = 0, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, trigger, contentId } = useTooltip();
    const floating = useFloatingContent({ open, side, align, sideOffset, reference: trigger });
    const composedRef = useComposedRefs(forwardedRef, floating.refs.setFloating);

    if (!floating.present) return null;

    return (
      <Portal container={container}>
        <div
          ref={composedRef}
          id={contentId}
          role="tooltip"
          data-slot="tooltip-content"
          data-state={!open ? "closed" : floating.isPositioned ? "open" : undefined}
          data-side={floating.resolvedSide}
          data-align={floating.resolvedAlign}
          style={{ ...(floating.style as object), ...(style && typeof style === "object" ? style : {}) }}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget && !open) floating.setPresent(false);
          }}
          onPointerEnter={() => setOpen(true)}
          onPointerLeave={() => setOpen(false)}
          className={cn(
            "fade-in-0 zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-popper-transform-origin) text-balance rounded-md bg-primary px-3 py-1.5 text-primary-foreground text-xs data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
          )}
          {...props}
        />
      </Portal>
    );
  },
);
TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };