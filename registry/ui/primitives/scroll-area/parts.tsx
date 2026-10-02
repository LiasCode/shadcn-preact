import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { useDirection } from "../direction-provider";
import { getElementProps } from "../internals/popups/getElementProps";
import type { BaseUIComponentProps } from "../internals/types";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
interface ScrollAreaState {
  scrolling: boolean;
  hasOverflowX: boolean;
  hasOverflowY: boolean;
  overflowXStart: boolean;
  overflowXEnd: boolean;
  overflowYStart: boolean;
  overflowYEnd: boolean;
  cornerHidden: boolean;
}
interface Metrics {
  width: number;
  height: number;
  contentWidth: number;
  contentHeight: number;
  x: number;
  y: number;
  trackX: number;
  trackY: number;
  thumbX: number;
  thumbY: number;
  cornerWidth: number;
  cornerHeight: number;
}
const empty: Metrics = {
  width: 0,
  height: 0,
  contentWidth: 0,
  contentHeight: 0,
  x: 0,
  y: 0,
  trackX: 0,
  trackY: 0,
  thumbX: 0,
  thumbY: 0,
  cornerWidth: 0,
  cornerHeight: 0,
};
interface ContextValue {
  state: ScrollAreaState;
  metrics: Metrics;
  refs: {
    viewport: { current: HTMLElement | null };
    x: { current: HTMLElement | null };
    y: { current: HTMLElement | null };
  };
  measure(): void;
  scroll(): void;
  hovering: boolean;
  rtl: boolean;
  id: string;
}
const Context = createContext<ContextValue | null>(null);
const BarContext = createContext<"horizontal" | "vertical">("vertical");
function useArea() {
  const c = useContext(Context);
  if (!c) throw new Error("Base UI: ScrollArea parts require Root.");
  return c;
}
const mapping = {
  hasOverflowX: (v: boolean) => (v ? { "data-has-overflow-x": "" } : null),
  hasOverflowY: (v: boolean) => (v ? { "data-has-overflow-y": "" } : null),
  overflowXStart: (v: boolean) => (v ? { "data-overflow-x-start": "" } : null),
  overflowXEnd: (v: boolean) => (v ? { "data-overflow-x-end": "" } : null),
  overflowYStart: (v: boolean) => (v ? { "data-overflow-y-start": "" } : null),
  overflowYEnd: (v: boolean) => (v ? { "data-overflow-y-end": "" } : null),
  cornerHidden: () => null,
  orientation: (v: "vertical" | "horizontal"): Record<string, string> => ({
    [v === "vertical" ? "data-vertical" : "data-horizontal"]: "",
    "data-orientation": v,
  }),
};
export function Root({
  overflowEdgeThreshold = 0,
  ...props
}: BaseUIComponentProps<"div", ScrollAreaState> & {
  overflowEdgeThreshold?: number | Partial<Record<"xStart" | "xEnd" | "yStart" | "yEnd", number>>;
}) {
  const [metrics, setMetrics] = useState(empty),
    [scrolling, setScrolling] = useState(false),
    [hovering, setHovering] = useState(false);
  const viewport = useRef<HTMLElement | null>(null),
    x = useRef<HTMLElement | null>(null),
    y = useRef<HTMLElement | null>(null);
  const rtl = useDirection() === "rtl",
    id = useBaseUiId(props.id);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const threshold = (key: "xStart" | "xEnd" | "yStart" | "yEnd") =>
    typeof overflowEdgeThreshold === "number" ? overflowEdgeThreshold : (overflowEdgeThreshold[key] ?? 0);
  const measure = useStableCallback(() => {
    const e = viewport.current;
    if (!e) return;
    const next = {
      ...empty,
      width: e.clientWidth,
      height: e.clientHeight,
      contentWidth: e.scrollWidth,
      contentHeight: e.scrollHeight,
      x: Math.max(0, Math.min(Math.abs(e.scrollLeft), e.scrollWidth - e.clientWidth)),
      y: Math.max(0, Math.min(e.scrollTop, e.scrollHeight - e.clientHeight)),
    };
    const overflowX = next.contentWidth > next.width,
      overflowY = next.contentHeight > next.height;
    next.cornerWidth = overflowX && overflowY ? (y.current?.offsetWidth ?? 0) : 0;
    next.cornerHeight = overflowX && overflowY ? (x.current?.offsetHeight ?? 0) : 0;
    const extent = (bar: HTMLElement | null, horizontal: boolean, fallback: number) => {
      if (!bar) return fallback;
      const s = bar.ownerDocument.defaultView?.getComputedStyle(bar);
      return Math.max(
        0,
        (horizontal ? bar.clientWidth : bar.clientHeight) -
          (parseFloat(horizontal ? (s?.paddingLeft ?? "0") : (s?.paddingTop ?? "0")) || 0) -
          (parseFloat(horizontal ? (s?.paddingRight ?? "0") : (s?.paddingBottom ?? "0")) || 0),
      );
    };
    next.trackX = extent(x.current, true, next.width - next.cornerWidth);
    next.trackY = extent(y.current, false, next.height - next.cornerHeight);
    next.thumbX = Math.min(next.trackX, Math.max(16, (next.trackX * next.width) / (next.contentWidth || 1)));
    next.thumbY = Math.min(next.trackY, Math.max(16, (next.trackY * next.height) / (next.contentHeight || 1)));
    setMetrics((previous) =>
      Object.keys(next).every((key) => previous[key as keyof Metrics] === next[key as keyof Metrics]) ? previous : next,
    );
    for (const [key, value] of Object.entries({
      "x-start": next.x,
      "x-end": Math.max(0, next.contentWidth - next.width - next.x),
      "y-start": next.y,
      "y-end": Math.max(0, next.contentHeight - next.height - next.y),
    }))
      e.style.setProperty(`--scroll-area-overflow-${key}`, `${value}px`);
  });
  const scroll = useStableCallback(() => {
    measure();
    setScrolling(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setScrolling(false), 150);
  });
  useEffect(() => () => clearTimeout(timer.current), []);
  useIsoLayoutEffect(() => {
    measure();
  }, [rtl, overflowEdgeThreshold]);
  const state: ScrollAreaState = {
    scrolling,
    hasOverflowX: metrics.contentWidth > metrics.width,
    hasOverflowY: metrics.contentHeight > metrics.height,
    overflowXStart: metrics.x > threshold("xStart"),
    overflowXEnd: metrics.contentWidth - metrics.width - metrics.x > threshold("xEnd"),
    overflowYStart: metrics.y > threshold("yStart"),
    overflowYEnd: metrics.contentHeight - metrics.height - metrics.y > threshold("yEnd"),
    cornerHidden: !(metrics.contentWidth > metrics.width && metrics.contentHeight > metrics.height),
  };
  const node = useRenderElement("div", props, {
    state,
    ref: props.ref,
    stateAttributesMapping: mapping,
    props: [
      {
        id,
        style: {
          position: "relative",
          "--scroll-area-corner-width": `${metrics.cornerWidth}px`,
          "--scroll-area-corner-height": `${metrics.cornerHeight}px`,
        },
        onPointerEnter() {
          setHovering(true);
        },
        onPointerLeave() {
          setHovering(false);
        },
      },
      getElementProps(props),
    ],
  });
  return (
    <Context.Provider value={{ state, metrics, refs: { viewport, x, y }, measure, scroll, hovering, rtl, id }}>
      {node}
    </Context.Provider>
  );
}
export namespace Root {
  export type Props = Parameters<typeof Root>[0];
  export type State = ScrollAreaState;
}
export function Viewport(props: BaseUIComponentProps<"div", ScrollAreaState>) {
  const ctx = useArea();
  const setElement = useStableCallback((e: HTMLElement | null) => {
    ctx.refs.viewport.current = e;
    queueMicrotask(ctx.measure);
  });
  useIsoLayoutEffect(() => {
    const e = ctx.refs.viewport.current;
    if (!e) return;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(ctx.measure) : null;
    ro?.observe(e);
    const observeChildren = () => {
      for (const child of e.children) ro?.observe(child);
    };
    observeChildren();
    const mo =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => {
            observeChildren();
            ctx.measure();
          })
        : null;
    mo?.observe(e, { childList: true, subtree: true, characterData: true });
    const win = e.ownerDocument.defaultView;
    win?.addEventListener("resize", ctx.measure);
    return () => {
      ro?.disconnect();
      mo?.disconnect();
      win?.removeEventListener("resize", ctx.measure);
    };
  }, [ctx.measure]);
  const node = useRenderElement("div", props, {
    state: ctx.state,
    ref: [props.ref ?? null, setElement],
    stateAttributesMapping: mapping,
    props: [
      {
        role: "presentation",
        "data-id": `${ctx.id}-viewport`,
        tabIndex: ctx.state.hasOverflowX || ctx.state.hasOverflowY ? 0 : -1,
        style: { overflow: "scroll", scrollbarWidth: "none" },
        onScroll: ctx.scroll,
      },
      getElementProps(props),
    ],
  });
  return (
    <>
      <style>{`[data-id="${ctx.id}-viewport"]::-webkit-scrollbar{display:none}`}</style>
      {node}
    </>
  );
}
export namespace Viewport {
  export type Props = Parameters<typeof Viewport>[0];
}
function scrollTo(ctx: ContextValue, horizontal: boolean, position: number) {
  const e = ctx.refs.viewport.current;
  if (!e) return;
  const max = horizontal
    ? ctx.metrics.contentWidth - ctx.metrics.width
    : ctx.metrics.contentHeight - ctx.metrics.height;
  const value = Math.max(0, Math.min(max, position));
  if (horizontal) e.scrollLeft = ctx.rtl ? -value : value;
  else e.scrollTop = value;
  ctx.scroll();
}
function startScrollDrag(ctx: ContextValue, horizontal: boolean, event: PointerEvent) {
  const target = event.currentTarget as HTMLElement;
  const doc = target.ownerDocument;
  const viewport = ctx.refs.viewport.current!;
  const start = horizontal ? event.clientX : event.clientY;
  const position = horizontal ? Math.abs(viewport.scrollLeft) : viewport.scrollTop;
  const max = horizontal
    ? ctx.metrics.contentWidth - ctx.metrics.width
    : ctx.metrics.contentHeight - ctx.metrics.height;
  const travel = horizontal ? ctx.metrics.trackX - ctx.metrics.thumbX : ctx.metrics.trackY - ctx.metrics.thumbY;
  try {
    target.setPointerCapture?.(event.pointerId);
  } catch {
    /* The pointer may already be released. */
  }
  const move = (next: PointerEvent) => {
    if (next.pointerId !== event.pointerId) return;
    scrollTo(
      ctx,
      horizontal,
      position +
        (((horizontal ? next.clientX : next.clientY) - start) * (horizontal && ctx.rtl ? -1 : 1) * max) / (travel || 1),
    );
  };
  const end = (next: PointerEvent) => {
    if (next.pointerId === event.pointerId) cleanup();
  };
  const cleanup = () => {
    doc.removeEventListener("pointermove", move);
    doc.removeEventListener("pointerup", end);
    doc.removeEventListener("pointercancel", end);
    try {
      target.releasePointerCapture?.(event.pointerId);
    } catch {
      /* Capture may have been lost. */
    }
  };
  doc.addEventListener("pointermove", move);
  doc.addEventListener("pointerup", end);
  doc.addEventListener("pointercancel", end);
  return cleanup;
}
export function Scrollbar({
  orientation = "vertical",
  keepMounted = false,
  ...props
}: BaseUIComponentProps<"div", ScrollAreaState & { hovering: boolean; orientation: "vertical" | "horizontal" }> & {
  orientation?: "vertical" | "horizontal";
  keepMounted?: boolean;
}) {
  const ctx = useArea(),
    horizontal = orientation === "horizontal";
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);
  const ref = horizontal ? ctx.refs.x : ctx.refs.y;
  const setElement = useStableCallback((e: HTMLElement | null) => {
    ref.current = e;
    queueMicrotask(ctx.measure);
  });
  const visible = horizontal ? ctx.state.hasOverflowX : ctx.state.hasOverflowY;
  useIsoLayoutEffect(() => {
    const e = ref.current;
    if (!e) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const delta = horizontal ? event.deltaX : event.deltaY,
        max = horizontal
          ? ctx.metrics.contentWidth - ctx.metrics.width
          : ctx.metrics.contentHeight - ctx.metrics.height;
      const position = horizontal ? ctx.metrics.x : ctx.metrics.y;
      const change = horizontal && ctx.rtl ? -delta : delta;
      if ((position <= 0 && change < 0) || (position >= max && change > 0) || !delta) return;
      event.preventDefault();
      scrollTo(ctx, horizontal, position + change);
    };
    e.addEventListener("wheel", onWheel, { passive: false });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(ctx.measure) : null;
    ro?.observe(e);
    return () => {
      e.removeEventListener("wheel", onWheel);
      ro?.disconnect();
    };
  }, [visible, horizontal, ctx.metrics, ctx.measure]);
  const node = useRenderElement("div", props, {
    enabled: visible || keepMounted,
    state: { ...ctx.state, orientation, hovering: ctx.hovering },
    ref: [props.ref ?? null, setElement],
    stateAttributesMapping: mapping,
    props: [
      {
        "data-id": `${ctx.id}-scrollbar`,
        hidden: !visible,
        style: {
          position: "absolute",
          touchAction: "none",
          userSelect: "none",
          ...(horizontal
            ? {
                insetInlineStart: 0,
                insetInlineEnd: "var(--scroll-area-corner-width)",
                bottom: 0,
                "--scroll-area-thumb-width": `${ctx.metrics.thumbX}px`,
              }
            : {
                top: 0,
                bottom: "var(--scroll-area-corner-height)",
                insetInlineEnd: 0,
                height: "auto",
                "--scroll-area-thumb-height": `${ctx.metrics.thumbY}px`,
              }),
        },
        onPointerDown(event: PointerEvent) {
          if (event.button !== 0 || event.target !== ref.current) return;
          event.preventDefault();
          const r = ref.current!.getBoundingClientRect(),
            s = ref.current!.ownerDocument.defaultView?.getComputedStyle(ref.current!);
          const padding = parseFloat(horizontal ? (s?.paddingLeft ?? "0") : (s?.paddingTop ?? "0")) || 0,
            track = horizontal ? ctx.metrics.trackX : ctx.metrics.trackY,
            thumb = horizontal ? ctx.metrics.thumbX : ctx.metrics.thumbY;
          let ratio =
            ((horizontal ? event.clientX - r.left : event.clientY - r.top) - padding - thumb / 2) /
            (track - thumb || 1);
          if (horizontal && ctx.rtl) ratio = 1 - ratio;
          scrollTo(
            ctx,
            horizontal,
            ratio *
              (horizontal
                ? ctx.metrics.contentWidth - ctx.metrics.width
                : ctx.metrics.contentHeight - ctx.metrics.height),
          );
          cleanup.current?.();
          cleanup.current = startScrollDrag(ctx, horizontal, event);
        },
      },
      getElementProps(props),
    ],
  });
  return <BarContext.Provider value={orientation}>{node}</BarContext.Provider>;
}
export namespace Scrollbar {
  export type Props = Parameters<typeof Scrollbar>[0];
}
export function Thumb(
  props: BaseUIComponentProps<"div", { scrolling: boolean; orientation: "vertical" | "horizontal" }>,
) {
  const ctx = useArea(),
    orientation = useContext(BarContext),
    horizontal = orientation === "horizontal";
  const cleanup = useRef<(() => void) | null>(null);
  useEffect(() => () => cleanup.current?.(), []);
  const max = horizontal
    ? ctx.metrics.contentWidth - ctx.metrics.width
    : ctx.metrics.contentHeight - ctx.metrics.height;
  const travel = horizontal ? ctx.metrics.trackX - ctx.metrics.thumbX : ctx.metrics.trackY - ctx.metrics.thumbY;
  const offset = (travel * (horizontal ? ctx.metrics.x : ctx.metrics.y)) / (max || 1);
  return useRenderElement("div", props, {
    state: { scrolling: ctx.state.scrolling, orientation },
    ref: props.ref,
    stateAttributesMapping: { orientation: mapping.orientation },
    props: [
      {
        style: {
          ...(horizontal
            ? { width: "var(--scroll-area-thumb-width)", transform: `translate3d(${ctx.rtl ? -offset : offset}px,0,0)` }
            : { height: "var(--scroll-area-thumb-height)", transform: `translate3d(0,${offset}px,0)` }),
          flexShrink: 0,
        },
        onPointerDown(event: PointerEvent) {
          if (event.button !== 0) return;
          event.preventDefault();
          event.stopPropagation();
          cleanup.current?.();
          cleanup.current = startScrollDrag(ctx, horizontal, event);
        },
      },
      getElementProps(props),
    ],
  });
}
export namespace Thumb {
  export type Props = Parameters<typeof Thumb>[0];
}
export function Corner(props: BaseUIComponentProps<"div", {}>) {
  const ctx = useArea();
  return useRenderElement("div", props, {
    enabled: !ctx.state.cornerHidden,
    ref: props.ref,
    props: [
      {
        style: {
          position: "absolute",
          bottom: 0,
          insetInlineEnd: 0,
          width: "var(--scroll-area-corner-width)",
          height: "var(--scroll-area-corner-height)",
        },
      },
      getElementProps(props),
    ],
  });
}
export namespace Corner {
  export type Props = Parameters<typeof Corner>[0];
}