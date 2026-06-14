import { autoUpdate, flip, offset, type Placement, shift, useFloating } from "@floating-ui/react-dom";
import type { ComponentProps, RefObject } from "preact/compat";
import { useEffect, useState } from "preact/compat";

export type FloatingSide = "top" | "right" | "bottom" | "left";
export type FloatingAlign = "start" | "center" | "end";

export function getPlacement(side: FloatingSide, align: FloatingAlign): Placement {
  return align === "center" ? side : `${side}-${align}`;
}

export function getFloatingTransformOrigin(side: string, align: string): string {
  if (side === "top" || side === "bottom") {
    const y = side === "bottom" ? "top" : "bottom";
    const x = align === "start" ? "left" : align === "end" ? "right" : "center";
    return `${x} ${y}`;
  }
  const x = side === "right" ? "left" : "right";
  const y = align === "start" ? "top" : align === "end" ? "bottom" : "center";
  return `${x} ${y}`;
}

export function useFloatingContent({
  open,
  side,
  align,
  sideOffset,
  reference,
}: {
  open: boolean;
  side: FloatingSide;
  align: FloatingAlign;
  sideOffset: number;
  reference: HTMLElement | null;
}) {
  const [present, setPresent] = useState(open);

  useEffect(() => {
    if (open) setPresent(true);
  }, [open]);

  const floating = useFloating({
    open,
    placement: getPlacement(side, align),
    strategy: "fixed",
    transform: false,
    whileElementsMounted: autoUpdate,
    elements: { reference },
    middleware: [offset(sideOffset), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const [resolvedSide = side, resolvedAlign = "center"] = floating.placement.split("-");
  const style = {
    ...floating.floatingStyles,
    "--radix-popper-transform-origin": getFloatingTransformOrigin(resolvedSide, resolvedAlign),
    "--radix-popover-content-transform-origin": getFloatingTransformOrigin(resolvedSide, resolvedAlign),
    ...(open && !floating.isPositioned ? { opacity: 0, pointerEvents: "none" } : {}),
  } as ComponentProps<"div">["style"];

  return {
    ...floating,
    present,
    setPresent,
    resolvedSide,
    resolvedAlign,
    style,
  };
}

export function useDismissableLayer({
  open,
  onOpenChange,
  contentRef,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contentRef: RefObject<HTMLElement | null>;
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (contentRef.current?.contains(target ?? null)) return;
      if (triggerRef?.current?.contains(target ?? null)) return;
      onOpenChange(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [contentRef, onOpenChange, open, triggerRef]);
}
