import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  type Middleware,
  type MiddlewareState,
  type Padding,
  type Placement,
  type Rect,
  type VirtualElement,
} from "@floating-ui/react-dom";
import type { CSSProperties, RefObject } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";

import { arrow } from "./arrow";
import { useDirection } from "./direction-context";
import type { FloatingRootContext } from "./useFloatingRootContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

export type Side = "top" | "bottom" | "left" | "right" | "inline-start" | "inline-end";

export type Align = "start" | "center" | "end";

export type Boundary = "clipping-ancestors" | Element | Element[] | Rect;

export type OffsetFunction = (data: {
  side: Side;
  align: Align;
  anchor: { width: number; height: number };
  positioner: { width: number; height: number };
}) => number;

export type CollisionAvoidance =
  | {
      side?: "flip" | "none";
      align?: "flip" | "shift" | "none";
      fallbackAxisSide?: "start" | "end" | "none";
    }
  | { side: "shift"; align?: "shift" | "none"; fallbackAxisSide?: "start" | "end" | "none" };

export interface UseAnchorPositioningSharedParameters {
  anchor?:
    | Element
    | VirtualElement
    | null
    | RefObject<Element | null>
    | (() => Element | VirtualElement | null);
  positionMethod?: "absolute" | "fixed";
  side?: Side;
  sideOffset?: number | OffsetFunction;
  align?: Align;
  alignOffset?: number | OffsetFunction;
  collisionBoundary?: Boundary;
  collisionPadding?: Padding;
  sticky?: boolean;
  arrowPadding?: number;
  disableAnchorTracking?: boolean;
  collisionAvoidance?: CollisionAvoidance;
}

export interface UseAnchorPositioningParameters extends UseAnchorPositioningSharedParameters {
  mounted: boolean;
  keepMounted?: boolean;
  floatingRootContext?: FloatingRootContext;
  shiftCrossAxis?: boolean;
  lazyFlip?: boolean;
  inline?: Middleware;
  adaptiveOrigin?: Middleware;
}

type Position = {
  x: number;
  y: number;
  placement: Placement;
  arrowX?: number;
  arrowY?: number;
  arrowOffset?: number;
  hidden: boolean;
  positioned: boolean;
  sideX?: "left" | "right";
  sideY?: "top" | "bottom";
};
/** Base UI's positioning middleware, with Preact state and native Floating UI computation. */
export function useAnchorPositioning(params: UseAnchorPositioningParameters) {
  const direction = useDirection();
  const rtl = direction === "rtl";
  const {
    mounted,
    side: sideParam = "bottom",
    align = "center",
    positionMethod = "absolute",
    collisionAvoidance = {},
  } = params;
  const physical =
    sideParam === "inline-start"
      ? rtl
        ? "right"
        : "left"
      : sideParam === "inline-end"
        ? rtl
          ? "left"
          : "right"
        : sideParam;
  const [reference, setReference] = useState<Element | VirtualElement | null>(null);
  const [floating, setFloating] = useState<HTMLElement | null>(null);
  const referenceRef = useRef<Element | VirtualElement | null>(null);
  const floatingRef = useRef<HTMLElement | null>(null);
  const arrowRef = useRef<Element | null>(null);
  const lockedSide = useRef<string | null>(null);
  const [position, setPosition] = useState<Position>({
    x: 0,
    y: 0,
    placement: "bottom",
    hidden: false,
    positioned: false,
  });
  const generation = useRef(0);
  const getParams = useStableCallback(() => params);
  const setReferenceElement = useStableCallback((element: Element | VirtualElement | null) => {
    if (referenceRef.current !== element) {
      generation.current++;
    }

    referenceRef.current = element;
    setReference(element);
  });
  const setFloatingElement = useStableCallback((element: HTMLElement | null) => {
    if (floatingRef.current !== element) {
      generation.current++;
    }

    floatingRef.current = element;
    setFloating(element);
  });

  function logicalSide(side: string): Side {
    if (sideParam !== "inline-start" && sideParam !== "inline-end") {
      return side as Side;
    }

    return side === "left"
      ? rtl
        ? "inline-end"
        : "inline-start"
      : side === "right"
        ? rtl
          ? "inline-start"
          : "inline-end"
        : (side as Side);
  }

  const update = useStableCallback(async () => {
    const current = getParams();
    const anchor = referenceRef.current;
    const popup = floatingRef.current;

    if (!current.mounted || !anchor || !popup || typeof window === "undefined") {
      return;
    }

    const request = ++generation.current;
    const placement =
      `${lockedSide.current ?? physical}${align === "center" ? "" : `-${align}`}` as Placement;
    const paddingParam = current.collisionPadding ?? 5;
    const padding =
      typeof paddingParam === "number"
        ? { top: paddingParam, right: paddingParam, bottom: paddingParam, left: paddingParam }
        : { top: 0, right: 0, bottom: 0, left: 0, ...paddingParam };

    if (sideParam === "bottom") {
      padding.top++;
    }

    if (sideParam === "top") {
      padding.bottom++;
    }

    if (sideParam === "left") {
      padding.right++;
    }

    if (sideParam === "right") {
      padding.left++;
    }

    const common = {
      boundary:
        current.collisionBoundary === "clipping-ancestors"
          ? ("clippingAncestors" as const)
          : current.collisionBoundary,
      padding,
    };
    const avoidance = current.collisionAvoidance ?? {};
    const sideMode = avoidance.side ?? "flip";
    const alignMode = avoidance.align ?? "flip";
    const crossAxis = Boolean(current.sticky || current.shiftCrossAxis || sideMode === "shift");

    const offsetData = (state: MiddlewareState) => ({
      side: logicalSide(state.placement.split("-")[0]!),
      align: (state.placement.split("-")[1] ?? "center") as Align,
      anchor: { width: state.rects.reference.width, height: state.rects.reference.height },
      positioner: { width: state.rects.floating.width, height: state.rects.floating.height },
    });

    const sideOffset = (state: MiddlewareState) =>
      typeof current.sideOffset === "function"
        ? current.sideOffset(offsetData(state))
        : (current.sideOffset ?? 0);

    const middleware: Middleware[] = [];

    if (current.inline) {
      middleware.push(current.inline);
    }

    middleware.push(
      offset((state) => {
        const cross =
          typeof current.alignOffset === "function"
            ? current.alignOffset(offsetData(state))
            : (current.alignOffset ?? 0);
        return { mainAxis: sideOffset(state), crossAxis: cross, alignmentAxis: cross };
      }),
    );
    const flipMiddleware =
      sideMode === "none"
        ? null
        : flip({
            ...common,
            padding: {
              top: padding.top + 1,
              right: padding.right + 1,
              bottom: padding.bottom + 1,
              left: padding.left + 1,
            },
            mainAxis: !current.shiftCrossAxis && sideMode === "flip",
            crossAxis: alignMode === "flip" ? "alignment" : false,
            fallbackAxisSideDirection: avoidance.fallbackAxisSide ?? "end",
          });
    const shiftMiddleware =
      alignMode === "none" && sideMode !== "shift"
        ? null
        : shift({
            ...common,
            mainAxis: alignMode !== "none",
            crossAxis,
            limiter:
              current.sticky || current.shiftCrossAxis
                ? undefined
                : limitShift((state) => {
                    if (!arrowRef.current) {
                      return {};
                    }

                    const rect = arrowRef.current.getBoundingClientRect();
                    const vertical = /^(top|bottom)/.test(state.placement);
                    return {
                      offset:
                        (vertical ? rect.width : rect.height) / 2 +
                        (vertical ? padding.left + padding.right : padding.top + padding.bottom) /
                          2,
                    };
                  }),
          });

    if (sideMode === "shift" || alignMode === "shift" || align === "center") {
      middleware.push(
        ...[shiftMiddleware, flipMiddleware].filter((item): item is Middleware => Boolean(item)),
      );
    } else {
      middleware.push(
        ...[flipMiddleware, shiftMiddleware].filter((item): item is Middleware => Boolean(item)),
      );
    }

    middleware.push(
      size({
        ...common,
        apply({ availableWidth, availableHeight, rects }) {
          if (request !== generation.current) {
            return;
          }

          const dpr = popup.ownerDocument.defaultView?.devicePixelRatio || 1;
          const rect = rects.reference;
          const width = (Math.round((rect.x + rect.width) * dpr) - Math.round(rect.x * dpr)) / dpr;
          const height =
            (Math.round((rect.y + rect.height) * dpr) - Math.round(rect.y * dpr)) / dpr;
          popup.style.setProperty("--available-width", `${availableWidth}px`);

          popup.style.setProperty("--available-height", `${availableHeight}px`);

          popup.style.setProperty("--anchor-width", `${width}px`);

          popup.style.setProperty("--anchor-height", `${height}px`);
        },
      }),
      arrow(() => ({
        element: arrowRef.current ?? popup.ownerDocument.createElement("div"),
        padding: current.arrowPadding ?? 5,
      })),
      {
        name: "transformOrigin",
        fn(state) {
          if (request !== generation.current) {
            return {};
          }

          const renderedSide = state.placement.split("-")[0]!;
          const x = (state.middlewareData.arrow?.x ?? 0) + (arrowRef.current?.clientWidth ?? 0) / 2;
          const y =
            (state.middlewareData.arrow?.y ?? 0) + (arrowRef.current?.clientHeight ?? 0) / 2;
          const distance = sideOffset(state);
          let origin = {
            top: `${x}px calc(100% + ${distance}px)`,
            bottom: `${x}px ${-distance}px`,
            left: `calc(100% + ${distance}px) ${y}px`,
            right: `${-distance}px ${y}px`,
          }[renderedSide];

          if (
            crossAxis &&
            (renderedSide === "top" || renderedSide === "bottom") &&
            Math.abs(state.middlewareData.shift?.y ?? 0) > distance
          ) {
            origin = `${x}px ${state.rects.reference.y + state.rects.reference.height / 2 - state.y}px`;
          }

          popup.style.setProperty("--transform-origin", origin ?? "center");
          return {};
        },
      },
      hide(),
    );

    if (current.adaptiveOrigin) {
      middleware.push(current.adaptiveOrigin);
    }

    const result = await computePosition(anchor, popup, {
      placement,
      strategy: current.positionMethod ?? "absolute",
      middleware,
    });

    if (request !== generation.current || !getParams().mounted) {
      return;
    }

    if (current.lazyFlip) {
      lockedSide.current = result.placement.split("-")[0]!;
    }

    const rect = anchor.getBoundingClientRect();
    const next: Position = {
      x: result.x,
      y: result.y,
      placement: result.placement,
      arrowX: result.middlewareData.arrow?.x,
      arrowY: result.middlewareData.arrow?.y,
      arrowOffset: result.middlewareData.arrow?.centerOffset,
      sideX: result.middlewareData.adaptiveOrigin?.sideX,
      sideY: result.middlewareData.adaptiveOrigin?.sideY,
      hidden: Boolean(
        result.middlewareData.hide?.referenceHidden ||
        (!rect.width && !rect.height && !rect.x && !rect.y),
      ),
      positioned: true,
    };
    setPosition((previous) =>
      (Object.keys(next) as (keyof Position)[]).some((key) => next[key] !== previous[key])
        ? next
        : previous,
    );
  });
  const rootReference = params.floatingRootContext?.elements.reference;
  useIsoLayoutEffect(() => {
    if (!mounted) {
      generation.current++;
      lockedSide.current = null;
      setPosition((previous) => ({ ...previous, positioned: false }));
      return;
    }

    const value = typeof params.anchor === "function" ? params.anchor() : params.anchor;
    const anchor = value && "current" in value ? value.current : value;
    setReferenceElement(
      anchor ?? rootReference ?? (params.anchor === undefined ? referenceRef.current : null),
    );
  }, [mounted, params.anchor, rootReference, setReferenceElement]);

  useEffect(() => {
    if (
      !mounted ||
      !params.anchor ||
      typeof params.anchor !== "object" ||
      !("current" in params.anchor)
    ) {
      return;
    }

    if (params.anchor.current !== referenceRef.current) {
      setReferenceElement(params.anchor.current ?? rootReference ?? null);
    }
  }, [mounted, params.anchor, rootReference, setReferenceElement]);

  useIsoLayoutEffect(() => {
    if (!mounted || !reference || !floating || typeof window === "undefined") {
      return undefined;
    }

    const cleanup = autoUpdate(reference, floating, update, {
      elementResize: !params.disableAnchorTracking && typeof ResizeObserver !== "undefined",
      layoutShift: !params.disableAnchorTracking && typeof IntersectionObserver !== "undefined",
    });
    return () => {
      generation.current++;
      cleanup();
    };
  }, [mounted, reference, floating, params.disableAnchorTracking, update]);

  useIsoLayoutEffect(() => {
    void update();
  }, [
    mounted,
    physical,
    align,
    positionMethod,
    params.sideOffset,
    params.alignOffset,
    params.collisionBoundary,
    params.collisionPadding,
    collisionAvoidance.side,
    collisionAvoidance.align,
    collisionAvoidance.fallbackAxisSide,
    params.arrowPadding,
    params.sticky,
    params.shiftCrossAxis,
    params.inline,
    params.adaptiveOrigin,
    rtl,
    update,
  ]);
  const renderedSide = position.placement.split("-")[0]! as "top" | "right" | "bottom" | "left";
  const dpr = floating?.ownerDocument.defaultView?.devicePixelRatio || 1;
  const positionerStyles: CSSProperties = position.positioned
    ? {
        position: positionMethod,
        [position.sideX ?? "left"]: Math.round(position.x * dpr) / dpr,
        [position.sideY ?? "top"]: Math.round(position.y * dpr) / dpr,
      }
    : { position: "fixed", left: 0, top: 0, opacity: 0 };
  const arrowStyles: CSSProperties = {
    position: "absolute",
    left: position.arrowX,
    top: position.arrowY,
  };
  return {
    positionerStyles,
    arrowStyles,
    arrowRef,
    arrowUncentered: Boolean(position.arrowOffset),
    side: logicalSide(renderedSide),
    physicalSide: renderedSide,
    align: (position.placement.split("-")[1] ?? "center") as Align,
    anchorHidden: position.hidden,
    isPositioned: position.positioned,
    update,
    refs: {
      reference: referenceRef,
      floating: floatingRef,
      setReference: setReferenceElement,
      setPositionReference: setReferenceElement,
      setFloating: setFloatingElement,
    },
    context: params.floatingRootContext,
  };
}

export type UseAnchorPositioningReturnValue = ReturnType<typeof useAnchorPositioning>;
