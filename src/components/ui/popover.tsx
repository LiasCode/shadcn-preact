import { autoUpdate, flip, offset, type Placement, shift, useFloating } from "@floating-ui/react-dom";
import { type ComponentProps, createContext } from "preact";
import {
  forwardRef,
  type PropsWithChildren,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "preact/compat";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { useFocusTrap } from "./share/useFocusTrap";

type PopoverContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  reference: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
  setAnchor: (el: HTMLElement | null) => void;
};

const PopoverContext = createContext<PopoverContextType | null>(null);

function usePopover() {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("Popover components must be used within a <Popover>");
  return ctx;
}

export type PopoverProps = PropsWithChildren<{
  /** The controlled open state of the popover. */
  open?: boolean;
  /** The open state of the popover when it is initially rendered, when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
}>;

function Popover({ open: openProp, defaultOpen, onOpenChange, children }: PopoverProps) {
  const [open, setOpen] = useControlledState<boolean>({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });

  const reactId = useId();
  const triggerId = `popover-trigger-${reactId}`;
  const contentId = `popover-content-${reactId}`;

  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const value = useMemo<PopoverContextType>(
    () => ({
      open,
      setOpen,
      triggerId,
      contentId,
      // An explicit <PopoverAnchor> takes precedence over the trigger for positioning.
      reference: anchor ?? trigger,
      setTrigger,
      setAnchor,
    }),
    [open, setOpen, triggerId, contentId, anchor, trigger]
  );

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>;
}

export type PopoverTriggerProps = ComponentProps<"button"> & {
  asChild?: boolean;
};

const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { open, setOpen, setTrigger, triggerId, contentId } = usePopover();
    const composedRef = useComposedRefs(forwardedRef, setTrigger);

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={composedRef}
        type={asChild ? undefined : "button"}
        id={triggerId}
        data-slot="popover-trigger"
        data-state={open ? "open" : "closed"}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? contentId : undefined}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setOpen(!open);
        }}
        {...props}
      />
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

export type PopoverAnchorProps = ComponentProps<"div"> & {
  asChild?: boolean;
};

const PopoverAnchor = forwardRef<HTMLDivElement, PopoverAnchorProps>(({ asChild = false, ...props }, forwardedRef) => {
  const { setAnchor } = usePopover();
  const composedRef = useComposedRefs(forwardedRef, setAnchor);

  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      ref={composedRef}
      data-slot="popover-anchor"
      {...props}
    />
  );
});
PopoverAnchor.displayName = "PopoverAnchor";

export type PopoverContentProps = ComponentProps<"div"> & {
  /** The preferred side of the trigger to render against. @defaultValue "bottom" */
  side?: "top" | "right" | "bottom" | "left";
  /** The preferred alignment against the trigger. @defaultValue "center" */
  align?: "start" | "center" | "end";
  /** The distance in pixels from the trigger. @defaultValue 4 */
  sideOffset?: number;
  /** An optional container where the popover should be portaled. */
  container?: Element | DocumentFragment | null;
};

// Mirrors Radix's `--radix-popover-content-transform-origin`: the zoom/fade animation
// should originate from the edge of the content nearest the trigger.
function getTransformOrigin(side: string, align: string): string {
  if (side === "top" || side === "bottom") {
    const y = side === "bottom" ? "top" : "bottom";
    const x = align === "start" ? "left" : align === "end" ? "right" : "center";
    return `${x} ${y}`;
  }
  const x = side === "right" ? "left" : "right";
  const y = align === "start" ? "top" : align === "end" ? "bottom" : "center";
  return `${x} ${y}`;
}

const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(
  (
    { className, side = "bottom", align = "center", sideOffset = 4, container, style, children, ...props },
    forwardedRef
  ) => {
    const { open, setOpen, reference, triggerId, contentId } = usePopover();

    // Keep the content mounted while it animates out so `data-[state=closed]` animations can play.
    const [present, setPresent] = useState(open);
    useEffect(() => {
      if (open) setPresent(true);
    }, [open]);

    const placement: Placement = align === "center" ? side : `${side}-${align}`;

    const {
      refs,
      floatingStyles,
      placement: resolvedPlacement,
      isPositioned,
    } = useFloating({
      open,
      placement,
      strategy: "fixed",
      // Position with top/left instead of `transform` so the enter/exit animations (which animate
      // `transform`) don't override the placement and make the content fly in from the corner.
      transform: false,
      whileElementsMounted: autoUpdate,
      elements: { reference },
      middleware: [offset(sideOffset), flip({ padding: 8 }), shift({ padding: 8 })],
    });

    const floatingRef = useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs(forwardedRef, refs.setFloating, floatingRef);

    // Focus trap: active only once floating-ui has placed the element, so focus
    // moves in-place rather than to the invisible top-left position.
    useFocusTrap(floatingRef, open && isPositioned);

    // Close on Escape and on a pointer press outside both the content and the trigger.
    useEffect(() => {
      if (!open) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      const onPointerDown = (e: PointerEvent) => {
        const target = e.target as Node | null;
        const floatingEl = refs.floating.current;
        const referenceEl = refs.reference.current as HTMLElement | null;
        if (floatingEl?.contains(target ?? null)) return;
        if (referenceEl?.contains(target ?? null)) return;
        setOpen(false);
      };

      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("pointerdown", onPointerDown);
      return () => {
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("pointerdown", onPointerDown);
      };
    }, [open, setOpen, refs.floating, refs.reference]);

    if (!present) return null;

    const [resolvedSide = side, resolvedAlign = "center"] = resolvedPlacement.split("-");

    const mergedStyle = {
      ...floatingStyles,
      "--radix-popover-content-transform-origin": getTransformOrigin(resolvedSide, resolvedAlign),
      // Stay invisible at the default top-left position until floating-ui has computed the real
      // placement, so the open animation plays in-place instead of flying in from the corner.
      ...(open && !isPositioned ? { opacity: 0, pointerEvents: "none" } : {}),
      ...(style && typeof style === "object" ? style : {}),
    } as ComponentProps<"div">["style"];

    return (
      <Portal container={container}>
        <div
          ref={composedRef}
          id={contentId}
          role="dialog"
          aria-labelledby={triggerId}
          data-slot="popover-content"
          data-state={!open ? "closed" : isPositioned ? "open" : undefined}
          data-side={resolvedSide}
          data-align={resolvedAlign}
          style={mergedStyle}
          onAnimationEnd={(e: AnimationEvent) => {
            // Unmount only after the close animation of the content itself finishes.
            if (e.target === e.currentTarget && !open) setPresent(false);
          }}
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </Portal>
    );
  }
);
PopoverContent.displayName = "PopoverContent";

export type PopoverHeaderProps = ComponentProps<"div">;

const PopoverHeader = forwardRef<HTMLDivElement, PopoverHeaderProps>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  );
});
PopoverHeader.displayName = "PopoverHeader";

export type PopoverTitleProps = ComponentProps<"div">;

const PopoverTitle = forwardRef<HTMLDivElement, PopoverTitleProps>(({ className, ...props }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      data-slot="popover-title"
      className={cn("font-medium", className)}
      {...props}
    />
  );
});
PopoverTitle.displayName = "PopoverTitle";

export type PopoverDescriptionProps = ComponentProps<"p">;

const PopoverDescription = forwardRef<HTMLParagraphElement, PopoverDescriptionProps>(
  ({ className, ...props }, forwardedRef) => {
    return (
      <p
        ref={forwardedRef}
        data-slot="popover-description"
        className={cn("text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
PopoverDescription.displayName = "PopoverDescription";

export { Popover, PopoverAnchor, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
