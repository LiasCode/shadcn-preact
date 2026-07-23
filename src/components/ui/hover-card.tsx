import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useMemo, useRef } from "preact/compat";

import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { type FloatingAlign, type FloatingSide, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";

type HoverCardContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
};

const HoverCardContext = createContext<HoverCardContextType | null>(null);

function useHoverCard() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard components must be used within a <HoverCard>");
  return ctx;
}

type HoverCardProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
}>;

function HoverCard({
  open: openProp,
  defaultOpen,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  children,
}: HoverCardProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });
  const [trigger, setTrigger] = useControlledState<HTMLElement | null>({ defaultValue: null });

  const value = useMemo(
    () => ({ open, setOpen, openDelay, closeDelay, trigger, setTrigger }),
    [closeDelay, open, openDelay, setOpen, setTrigger, trigger],
  );

  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>;
}

type HoverCardTriggerProps = ComponentProps<"button"> & { asChild?: boolean };

const HoverCardTrigger = forwardRef<HTMLButtonElement, HoverCardTriggerProps>(
  ({ asChild = false, onBlur, onFocus, onPointerEnter, onPointerLeave, ...props }, forwardedRef) => {
    const { open, setOpen, openDelay, closeDelay, setTrigger } = useHoverCard();
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const composedRef = useComposedRefs(forwardedRef, setTrigger);
    const Comp = asChild ? Slot : "button";

    const schedule = (nextOpen: boolean) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setOpen(nextOpen), nextOpen ? openDelay : closeDelay);
    };

    return (
      <Comp
        ref={composedRef}
        type={asChild ? undefined : "button"}
        data-slot="hover-card-trigger"
        data-state={open ? "open" : "closed"}
        onPointerEnter={(e: PointerEvent) => {
          (onPointerEnter as ((e: PointerEvent) => void) | undefined)?.(e);
          schedule(true);
        }}
        onPointerLeave={(e: PointerEvent) => {
          (onPointerLeave as ((e: PointerEvent) => void) | undefined)?.(e);
          schedule(false);
        }}
        onFocus={(e: FocusEvent) => {
          (onFocus as ((e: FocusEvent) => void) | undefined)?.(e);
          schedule(true);
        }}
        onBlur={(e: FocusEvent) => {
          (onBlur as ((e: FocusEvent) => void) | undefined)?.(e);
          schedule(false);
        }}
        {...props}
      />
    );
  },
);
HoverCardTrigger.displayName = "HoverCardTrigger";

type HoverCardContentProps = ComponentProps<"div"> & {
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  container?: Element | DocumentFragment | null;
};

const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  ({ className, side = "bottom", align = "center", sideOffset = 4, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, trigger } = useHoverCard();
    const floating = useFloatingContent({ open, side, align, sideOffset, reference: trigger });
    const composedRef = useComposedRefs(forwardedRef, floating.refs.setFloating);

    if (!floating.present) return null;

    return (
      <Portal container={container}>
        <div
          ref={composedRef}
          data-slot="hover-card-content"
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
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 w-64 origin-(--radix-popper-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
          )}
          {...props}
        />
      </Portal>
    );
  },
);
HoverCardContent.displayName = "HoverCardContent";

export { HoverCard, HoverCardContent, HoverCardTrigger };