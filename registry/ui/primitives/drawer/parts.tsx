import { createContext } from "preact";
import { useContext, useEffect, useMemo, useRef, useState } from "preact/hooks";

import { createChangeEventDetails } from "../internals/createBaseUIEventDetails";
import { FloatingFocusManager } from "../internals/FloatingFocusManager";
import { getElementProps } from "../internals/popups/getElementProps";
import {
  useOverlayContext,
  popupStateMapping,
  type OverlayRootProps,
  type OverlayChangeDetails,
  type OverlayReason,
} from "../internals/popups/OverlayContext";
import { OverlayBackdrop, type OverlayPopupProps } from "../internals/popups/OverlayParts";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { PopupHandle } from "../internals/popups/PopupHandle";
import { transitionStatusMapping } from "../internals/stateAttributesMapping";
import type { BaseUIComponentProps } from "../internals/types";
import { useControlled } from "../internals/useControlled";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
export { OverlayTrigger as Trigger } from "../internals/popups/OverlayTrigger";
export {
  OverlayPortal as Portal,
  OverlayClose as Close,
  OverlayTitle as Title,
  OverlayDescription as Description,
} from "../internals/popups/OverlayParts";
export type SnapPoint = number | string;
type SwipeDirection = "down" | "up" | "left" | "right";
export interface DrawerRootProps<Payload = unknown> extends Omit<
  OverlayRootProps<Payload>,
  "disabled" | "disableHoverablePopup"
> {
  swipeDirection?: SwipeDirection;
  snapPoints?: SnapPoint[];
  snapPoint?: SnapPoint | null;
  defaultSnapPoint?: SnapPoint | null;
  snapToSequentialPoints?: boolean;
  onSnapPointChange?: (point: SnapPoint | null, details: OverlayChangeDetails) => void;
}
interface DrawerConfig {
  direction: SwipeDirection;
  points: SnapPoint[];
  point: SnapPoint | null;
  sequential: boolean;
  change(point: SnapPoint | null, event: Event): void;
  height: number;
  setHeight(height: number): void;
  swiping: boolean;
  setSwiping(value: boolean): void;
  progress: number;
  setProgress(value: number): void;
}
const DrawerContext = createContext<DrawerConfig | null>(null);
function useDrawer() {
  const value = useContext(DrawerContext);
  if (!value) throw new Error("Base UI: Drawer parts must be within Root.");
  return value;
}
export function Root<Payload = unknown>({
  swipeDirection = "down",
  snapPoints = [],
  snapPoint,
  defaultSnapPoint,
  snapToSequentialPoints = false,
  onSnapPointChange,
  ...props
}: DrawerRootProps<Payload>) {
  const [point, setPoint] = useControlled({
    controlled: snapPoint,
    default: defaultSnapPoint === undefined ? (snapPoints[0] ?? null) : defaultSnapPoint,
    name: "Drawer",
  });
  const [height, setHeight] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [progress, setProgress] = useState(0);
  const change = useStableCallback((next: SnapPoint | null, event: Event) => {
    const details = createChangeEventDetails("swipe", event, undefined, { preventUnmountOnClose() {} });
    onSnapPointChange?.(next, details);
    if (!details.isCanceled) setPoint(next);
  });
  const context = useMemo(
    () => ({
      direction: swipeDirection,
      points: snapPoints,
      point,
      sequential: snapToSequentialPoints,
      change,
      height,
      setHeight,
      swiping,
      setSwiping,
      progress,
      setProgress,
    }),
    [swipeDirection, snapPoints, point, snapToSequentialPoints, change, height, swiping, progress],
  );
  return (
    <DrawerContext.Provider value={context}>
      <OverlayRoot kind="drawer" {...props} />
    </DrawerContext.Provider>
  );
}
export namespace Root {
  export type Props<Payload = unknown> = DrawerRootProps<Payload>;
  export type ChangeEventDetails = OverlayChangeDetails;
  export type ChangeEventReason = OverlayReason;
  export type Actions = { close(): void; unmount(): void };
  export type SnapPoint = number | string;
}
export function createHandle<Payload = unknown>() {
  return new PopupHandle<Payload>();
}
export function Viewport(props: BaseUIComponentProps<"div", { open: boolean }>) {
  const context = useOverlayContext();
  return useRenderElement("div", props, {
    state: { open: context.open },
    ref: [props.ref ?? null, context.setViewport],
    props: [{ role: "presentation", hidden: !context.mounted }, getElementProps(props)],
    stateAttributesMapping: popupStateMapping,
  });
}
export namespace Viewport {
  export type Props = Parameters<typeof Viewport>[0];
}
export function Content(props: BaseUIComponentProps<"div", {}>) {
  return useRenderElement("div", props, { ref: props.ref, props: getElementProps(props) });
}
export namespace Content {
  export type Props = Parameters<typeof Content>[0];
}
export function Backdrop(props: OverlayBackdrop.Props) {
  const drawer = useDrawer();
  return (
    <OverlayBackdrop
      {...props}
      data-swiping={drawer.swiping ? "" : undefined}
      style={(state) => ({
        "--drawer-swipe-progress": drawer.progress,
        "--drawer-swipe-strength": 1,
        ...(typeof props.style === "function" ? props.style(state) : props.style),
      })}
    />
  );
}
export namespace Backdrop {
  export type Props = OverlayBackdrop.Props;
}
function snapHeight(point: SnapPoint, viewport: number, fontSize: number) {
  if (typeof point === "number") return point <= 1 ? Math.max(0, point) * viewport : point;
  const value = parseFloat(point);
  return Number.isFinite(value) ? (point.endsWith("rem") ? value * fontSize : point.endsWith("px") ? value : 0) : 0;
}
export interface DrawerPopupState {
  open: boolean;
  transitionStatus: ReturnType<typeof useOverlayContext>["transitionStatus"];
  expanded: boolean;
  nested: boolean;
  nestedDrawerOpen: boolean;
  nestedDrawerSwiping: boolean;
  swipeDirection: SwipeDirection;
  swiping: boolean;
}
export interface DrawerPopupProps
  extends Omit<OverlayPopupProps, "className" | "style" | "render">, BaseUIComponentProps<"div", DrawerPopupState> {}
export function Popup(props: DrawerPopupProps) {
  const { ref, initialFocus, finalFocus, ...elementProps } = props;
  const context = useOverlayContext();
  const drawer = useDrawer();
  const vertical = drawer.direction === "down" || drawer.direction === "up";
  const sign = drawer.direction === "down" || drawer.direction === "right" ? 1 : -1;
  const [movement, setMovement] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    time: number;
    startOffset: number;
    element: HTMLElement;
    movement: number;
    dragging: boolean;
  } | null>(null);
  const cleanupListeners = useRef<(() => void) | null>(null);
  const popup = context.popupRef.current;
  const nested = [...context.nestedPopups.values()].filter((child) => child.kind === "drawer" && child.open);
  const nestedCount = nested.reduce((sum, child) => sum + (child.count ?? 1), 0);
  const frontmost = nested.at(-1);
  const offsets = drawer.points
    .map((value) => ({ value, height: Math.min(drawer.height, snapHeight(value, viewportHeight, fontSize)) }))
    .filter((point) => point.height > 0);
  const currentPoint = offsets.find((point) => point.value === drawer.point);
  const offset = vertical && currentPoint ? Math.max(0, drawer.height - currentPoint.height) : 0;
  const reset = useStableCallback(() => {
    cleanupListeners.current?.();
    cleanupListeners.current = null;
    gesture.current = null;
    setMovement(0);
    drawer.setSwiping(false);
    drawer.setProgress(0);
  });
  const measure = useStableCallback(() => {
    const element = context.popupRef.current;
    if (!element) return;
    drawer.setHeight(element.offsetHeight);
    const view = element.ownerDocument.defaultView;
    setViewportHeight(
      context.viewport?.offsetHeight || element.ownerDocument.documentElement.clientHeight || view?.innerHeight || 0,
    );
    setFontSize(parseFloat(view?.getComputedStyle(element.ownerDocument.documentElement).fontSize ?? "16") || 16);
  });
  useIsoLayoutEffect(() => {
    measure();
    if (!popup || typeof window === "undefined") return undefined;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(popup);
    if (context.viewport) observer?.observe(context.viewport);
    popup.ownerDocument.defaultView?.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      popup.ownerDocument.defaultView?.removeEventListener("resize", measure);
    };
  }, [popup, context.viewport, measure]);
  useIsoLayoutEffect(
    () =>
      context.parent?.registerNested(context.id, {
        kind: "drawer",
        count: 1 + nestedCount,
        open: context.mounted,
        height: nested.at(-1)?.height || drawer.height,
        swiping: drawer.swiping || nested.some((child) => child.swiping),
        progress: frontmost?.progress ?? drawer.progress,
      }),
    [
      context.parent?.registerNested,
      context.id,
      context.mounted,
      drawer.height,
      drawer.swiping,
      drawer.progress,
      nestedCount,
      frontmost?.height,
      frontmost?.swiping,
      frontmost?.progress,
    ],
  );
  useEffect(() => () => reset(), [reset, popup]);
  useEffect(() => {
    if (!context.open) reset();
  }, [context.open, reset]);
  const start = (event: PointerEvent) => {
    if (
      !context.open ||
      nested.length ||
      event.button !== 0 ||
      event.defaultPrevented ||
      !(event.target instanceof Element)
    )
      return;
    const target = event.target as HTMLElement;
    if (target.closest("input,textarea,select,button,a,[contenteditable=true]")) return;
    const element = context.popupRef.current;
    if (!element) return;
    // A scrollable content region retains its native scrolling until it reaches the dismiss edge.
    for (let parent: HTMLElement | null = target; parent && parent !== element; parent = parent.parentElement) {
      if (vertical && parent.scrollHeight > parent.clientHeight && parent.scrollTop > 0) return;
    }
    reset();
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      time: event.timeStamp,
      startOffset: offset,
      element,
      movement: 0,
      dragging: false,
    };
    const doc = element.ownerDocument;
    const move = (next: PointerEvent) => {
      const active = gesture.current;
      if (!active || active.id !== next.pointerId) return;
      const delta = vertical ? next.clientY - active.y : next.clientX - active.x;
      const cross = vertical ? next.clientX - active.x : next.clientY - active.y;
      if (!active.dragging && Math.abs(cross) > Math.abs(delta) && Math.abs(cross) > 5) {
        reset();
        return;
      }
      if (!active.dragging && Math.abs(delta) < 5) return;
      active.dragging = true;
      drawer.setSwiping(true);
      next.preventDefault();
      try {
        element.setPointerCapture(next.pointerId);
      } catch {
        /* Synthetic events have no active pointer. */
      }
      const projected = sign * delta;
      const allowed = drawer.points.length && vertical ? projected : Math.max(0, projected);
      const nextOffset = active.startOffset + allowed;
      active.movement = nextOffset < 0 ? -Math.sqrt(-nextOffset) - active.startOffset : allowed;
      setMovement(sign * active.movement);
      drawer.setProgress(
        Math.max(
          0,
          Math.min(
            1,
            active.movement / Math.max(1, vertical ? drawer.height - active.startOffset : element.offsetWidth),
          ),
        ),
      );
    };
    const end = (next: PointerEvent) => {
      const active = gesture.current;
      if (!active || active.id !== next.pointerId) return;
      move(next);
      const distance = active.movement;
      const duration = Math.max(50, next.timeStamp - active.time);
      const velocity = distance / duration;
      if (active.dragging) {
        if (offsets.length && vertical) {
          const projectedOffset = active.startOffset + distance + (drawer.sequential ? 0 : velocity * 150);
          const visible = drawer.height - projectedOffset;
          const closest = offsets.reduce(
            (best, point) => (Math.abs(point.height - visible) < Math.abs(best.height - visible) ? point : best),
            offsets[0]!,
          );
          if (visible < Math.min(...offsets.map((point) => point.height)) / 2) context.change(false, next, "swipe");
          else drawer.change(closest.value, next);
        } else if (distance > 40 || velocity > 0.5) context.change(false, next, "swipe");
      }
      reset();
      try {
        element.releasePointerCapture(next.pointerId);
      } catch {
        /* Capture can already be released. */
      }
    };
    doc.addEventListener("pointermove", move, { passive: false });
    doc.addEventListener("pointerup", end);
    doc.addEventListener("pointercancel", reset);
    cleanupListeners.current = () => {
      doc.removeEventListener("pointermove", move);
      doc.removeEventListener("pointerup", end);
      doc.removeEventListener("pointercancel", reset);
    };
  };
  const state: DrawerPopupState = {
    open: context.open,
    transitionStatus: context.transitionStatus,
    expanded: drawer.point === 1,
    nested: context.nested,
    nestedDrawerOpen: nested.length > 0,
    nestedDrawerSwiping: nested.some((child) => child.swiping),
    swipeDirection: drawer.direction,
    swiping: drawer.swiping,
  };
  const node = useRenderElement("div", props, {
    state,
    ref: [ref ?? null, context.setPopup],
    props: [
      {
        id: context.popupId,
        role: "dialog",
        tabIndex: -1,
        "aria-modal": context.modal === true ? true : undefined,
        "aria-labelledby": context.titleId,
        "aria-describedby": context.descriptionId,
        hidden: !context.mounted,
        inert: !context.open ? "" : undefined,
        onPointerDown: start,
        style: {
          "--drawer-swipe-movement-x": `${vertical ? 0 : movement}px`,
          "--drawer-swipe-movement-y": `${vertical ? movement : 0}px`,
          "--drawer-swipe-progress": nested.at(-1)?.progress ?? drawer.progress,
          "--drawer-snap-point-offset": `${sign * offset}px`,
          "--drawer-swipe-strength": 1,
          "--nested-drawers": nestedCount,
          "--drawer-height": nested.length || context.transitionStatus === "ending" ? `${drawer.height}px` : undefined,
          "--drawer-frontmost-height": nested.at(-1)?.height ? `${nested.at(-1)!.height}px` : undefined,
          touchAction: vertical ? "pan-x" : "pan-y",
        },
      },
      getElementProps(elementProps),
    ],
    stateAttributesMapping: {
      ...popupStateMapping,
      ...transitionStatusMapping,
      swipeDirection(value: SwipeDirection) {
        return { "data-swipe-direction": value };
      },
      nestedDrawerOpen(value: boolean) {
        return value ? { "data-nested-drawer-open": "" } : null;
      },
      nestedDrawerSwiping(value: boolean) {
        return value ? { "data-nested-drawer-swiping": "" } : null;
      },
    },
  });
  return (
    <FloatingFocusManager
      context={context.floatingContext}
      disabled={!context.mounted}
      modal={context.modal !== false}
      outsideElementsInert={context.modal === true}
      initialFocus={initialFocus}
      returnFocus={finalFocus}
      restoreFocus="popup"
      closeOnFocusOut={!context.disablePointerDismissal}
      getInsideElements={() => [context.backdrop, context.viewport]}
    >
      {node!}
    </FloatingFocusManager>
  );
}
export namespace Popup {
  export type Props = DrawerPopupProps;
  export type State = DrawerPopupState;
}