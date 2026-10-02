import { createContext } from "preact";
import { createPortal } from "preact/compat";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { useDirection } from "../direction-provider";
import { createChangeEventDetails } from "../internals/createBaseUIEventDetails";
import { getElementProps } from "../internals/popups/getElementProps";
import { useOverlayContext, popupStateMapping, type OverlayChangeDetails } from "../internals/popups/OverlayContext";
import { OverlayPortal, OverlayPositioner, OverlayPopup } from "../internals/popups/OverlayParts";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { transitionStatusMapping } from "../internals/stateAttributesMapping";
import type { BaseUIComponentProps, NativeButtonProps } from "../internals/types";
import { useButton } from "../internals/useButton";
import { useControlled } from "../internals/useControlled";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useListNavigation } from "../internals/useListNavigation";
import { useOpenChangeComplete } from "../internals/useOpenChangeComplete";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { useTransitionStatus } from "../internals/useTransitionStatus";
export { OverlayPortal as Portal };
type Value = any;
interface ContextValue {
  value: Value;
  change(
    value: Value,
    event: Event,
    reason: "trigger-press" | "trigger-hover" | "list-navigation" | "link-press",
  ): boolean;
  viewport: HTMLElement | null;
  setViewport(node: HTMLElement | null): void;
  list: HTMLElement | null;
  setList(node: HTMLElement | null): void;
  triggers: Map<Value, HTMLElement>;
  direction: "left" | "right" | "up" | "down" | null;
  size: { width: number; height: number };
  setSize(
    size:
      | { width: number; height: number }
      | ((previous: { width: number; height: number }) => { width: number; height: number }),
  ): void;
  delay: number;
  closeDelay: number;
  orientation: "horizontal" | "vertical";
}
const Context = createContext<ContextValue | null>(null);
const ItemContext = createContext<Value>(null);
function useNav() {
  const c = useContext(Context);
  if (!c) throw new Error("Base UI: NavigationMenu parts require Root.");
  return c;
}
interface RootProps<V = any> extends BaseUIComponentProps<"nav", { open: boolean; nested: boolean }> {
  value?: V | null;
  defaultValue?: V | null;
  onValueChange?: (value: V | null, details: OverlayChangeDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  actionsRef?: { current: { unmount(): void } | null };
  delay?: number;
  closeDelay?: number;
  orientation?: "horizontal" | "vertical";
}
export function Root<V = any>({
  value: controlled,
  defaultValue = null,
  onValueChange,
  onOpenChangeComplete,
  actionsRef,
  delay = 300,
  closeDelay = 500,
  orientation = "horizontal",
  ...props
}: RootProps<V>) {
  const parent = useContext(Context);
  const [value, setValue] = useControlled({ controlled, default: defaultValue, name: "NavigationMenu" });
  const [viewport, setViewport] = useState<HTMLElement | null>(null),
    [list, setList] = useState<HTMLElement | null>(null),
    [size, setSize] = useState({ width: 0, height: 0 });
  const [activationDirection, setActivationDirection] = useState<ContextValue["direction"]>(null);
  const triggers = useRef(new Map<Value, HTMLElement>());
  const rtl = useDirection() === "rtl";
  const change = useStableCallback(
    (next: Value, event: Event, reason: "trigger-press" | "trigger-hover" | "list-navigation" | "link-press") => {
      const details = createChangeEventDetails(reason, event, triggers.current.get(next), {
        preventUnmountOnClose() {},
      });
      onValueChange?.(next, details);
      if (details.isCanceled) return false;
      const nodes = [...triggers.current.entries()].sort((a, b) => (a[1].compareDocumentPosition(b[1]) & 4 ? -1 : 1));
      const before = nodes.findIndex(([key]) => key === value),
        after = nodes.findIndex(([key]) => key === next);
      setActivationDirection(
        before < 0 || after < 0
          ? null
          : orientation === "vertical"
            ? after > before
              ? "down"
              : "up"
            : after > before !== rtl
              ? "right"
              : "left",
      );
      setValue(next);
      return true;
    },
  );
  const context: ContextValue = {
    value,
    change,
    viewport,
    setViewport,
    list,
    setList,
    triggers: triggers.current,
    direction: activationDirection,
    size,
    setSize,
    delay,
    closeDelay,
    orientation,
  };
  const node = useRenderElement("nav", props, {
    state: { open: value != null, nested: !!parent },
    ref: props.ref,
    props: getElementProps(props),
  });
  return (
    <Context.Provider value={context}>
      <OverlayRoot
        kind="navigation-menu"
        open={value != null}
        modal={false}
        onOpenChange={(open, details) => {
          if (open) return;
          onValueChange?.(null, details);
          if (!details.isCanceled) setValue(null);
        }}
        onOpenChangeComplete={onOpenChangeComplete}
        actionsRef={actionsRef as any}
      >
        {node}
      </OverlayRoot>
    </Context.Provider>
  );
}
export namespace Root {
  export type Props<V = any> = RootProps<V>;
  export type ChangeEventDetails = OverlayChangeDetails;
}
export function List(props: BaseUIComponentProps<"ul", {}>) {
  const nav = useNav();
  const { navigate } = useListNavigation(
    () =>
      nav.list
        ? [...nav.list.querySelectorAll<HTMLElement>("button,a")].filter(
            (e) => !e.closest("[data-slot=navigation-menu-content]"),
          )
        : [],
    { orientation: nav.orientation },
  );
  return useRenderElement("ul", props, {
    ref: [props.ref ?? null, nav.setList],
    props: [{ onKeyDown: navigate }, getElementProps(props)],
  });
}
export namespace List {
  export type Props = Parameters<typeof List>[0];
}
export function Item({ value: explicit, ...props }: BaseUIComponentProps<"li", {}> & { value?: Value }) {
  const id = useBaseUiId();
  return (
    <ItemContext.Provider value={explicit ?? id}>
      {useRenderElement("li", props, { ref: props.ref, props: getElementProps(props) })}
    </ItemContext.Provider>
  );
}
export namespace Item {
  export type Props = Parameters<typeof Item>[0];
}
export function Trigger({
  nativeButton = true,
  ...props
}: BaseUIComponentProps<"button", { open: boolean }> & NativeButtonProps) {
  const nav = useNav(),
    value = useContext(ItemContext),
    ctx = useOverlayContext(),
    element = useRef<HTMLElement | null>(null);
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled: props.disabled });
  const open = nav.value === value;
  const id = useBaseUiId(props.id);
  const setElement = useStableCallback((node: HTMLElement | null) => {
    element.current = node;
    if (node) nav.triggers.set(value, node);
    else nav.triggers.delete(value);
  });
  useIsoLayoutEffect(() => {
    if (open && element.current) ctx.setReference(element.current);
  }, [open, ctx.setReference]);
  const activate = (event: Event, hover = false) => {
    if (props.disabled) return;
    ctx.cancelTimers();
    if (nav.change(value, event, hover ? "trigger-hover" : "trigger-press"))
      ctx.change(true, event, hover ? "trigger-hover" : "trigger-press", element.current ?? undefined);
  };
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return useRenderElement("button", props, {
    state: { open },
    ref: [props.ref ?? null, buttonRef, setElement],
    stateAttributesMapping: popupStateMapping,
    props: [
      getButtonProps({
        id,
        "aria-expanded": open,
        "aria-controls": open ? ctx.popupId : undefined,
        onClick(event: MouseEvent) {
          if (open) {
            nav.change(null, event, "trigger-press");
            ctx.change(false, event, "trigger-press");
          } else activate(event);
        },
        onPointerEnter(event: PointerEvent) {
          if (event.pointerType === "touch") return;
          ctx.cancelTimers();
          clearTimeout(timer.current);
          timer.current = setTimeout(() => activate(event, true), nav.value == null ? nav.delay : 0);
        },
        onPointerLeave(event: PointerEvent) {
          clearTimeout(timer.current);
          if (!ctx.popupRef.current?.contains(event.relatedTarget as Node))
            ctx.schedule(false, event, "trigger-hover", nav.closeDelay);
        },
        onKeyDown(event: KeyboardEvent) {
          if (event.key === (nav.orientation === "vertical" ? "ArrowRight" : "ArrowDown")) {
            event.preventDefault();
            event.stopPropagation();
            activate(event);
            setTimeout(() => ctx.popupRef.current?.querySelector<HTMLElement>("a,button")?.focus(), 0);
          }
        },
      }),
      getElementProps(props),
    ],
  });
}
export namespace Trigger {
  export type Props = Parameters<typeof Trigger>[0];
}
export function Content({
  keepMounted = false,
  ...props
}: BaseUIComponentProps<
  "div",
  { open: boolean; transitionStatus: any; activationDirection: ContextValue["direction"] }
> & { keepMounted?: boolean }) {
  const nav = useNav(),
    value = useContext(ItemContext),
    ctx = useOverlayContext(),
    open = nav.value === value;
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
  const ref = useRef<HTMLElement | null>(null);
  const { navigate } = useListNavigation(
    () => (ref.current ? [...ref.current.querySelectorAll<HTMLElement>("a,button")] : []),
    { orientation: "both" },
  );
  useOpenChangeComplete({
    open,
    ref,
    enabled: mounted,
    onComplete() {
      if (!open) setMounted(false);
    },
  });
  useIsoLayoutEffect(() => {
    const e = ref.current;
    if (!open || !e) return;
    const popup = ctx.popupRef.current;
    const positioner = popup?.parentElement;
    if (!popup || !positioner) return;
    const measure = () => {
      const properties = ["--popup-width", "--popup-height"];
      const previous = properties.map((key) => popup.style.getPropertyValue(key));
      const oldWidth = positioner.style.width;
      const oldHeight = positioner.style.height;
      popup.style.setProperty("--popup-width", "auto");
      popup.style.setProperty("--popup-height", "auto");
      positioner.style.width = "max-content";
      positioner.style.height = "auto";
      const size = { width: popup.offsetWidth, height: popup.offsetHeight };
      properties.forEach((key, index) => popup.style.setProperty(key, previous[index]!));
      positioner.style.width = oldWidth;
      positioner.style.height = oldHeight;
      nav.setSize((current) => previousSize(current, size));
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(e);
    ro?.observe(positioner);
    const mo = typeof MutationObserver !== "undefined" ? new MutationObserver(measure) : null;
    mo?.observe(e, { childList: true, subtree: true, characterData: true });
    const win = e.ownerDocument.defaultView;
    win?.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      mo?.disconnect();
      win?.removeEventListener("resize", measure);
    };
  }, [open, nav.viewport]);
  const node = useRenderElement("div", props, {
    enabled: mounted || keepMounted,
    state: { open, transitionStatus, activationDirection: nav.direction },
    ref: [props.ref ?? null, ref],
    stateAttributesMapping: {
      ...popupStateMapping,
      ...transitionStatusMapping,
      activationDirection: (v: ContextValue["direction"]) => (v ? { "data-activation-direction": v } : null),
    },
    props: [
      {
        hidden: !mounted,
        style: !open && mounted ? { position: "absolute", top: 0, left: 0 } : undefined,
        inert: !open ? "" : undefined,
        "aria-labelledby": nav.triggers.get(value)?.id,
        onKeyDown(event: KeyboardEvent) {
          if (navigate(event)) return;
          if (event.key === "Escape") {
            event.preventDefault();
            ctx.change(false, event, "escape-key");
            nav.triggers.get(value)?.focus();
          }
        },
        onPointerEnter() {
          ctx.cancelTimers();
        },
      },
      getElementProps(props),
    ],
  });
  return nav.viewport && node ? createPortal(node, nav.viewport) : null;
}
function previousSize(previous: { width: number; height: number }, next: { width: number; height: number }) {
  return previous.width === next.width && previous.height === next.height ? previous : next;
}
export namespace Content {
  export type Props = Parameters<typeof Content>[0];
}
export function Positioner(props: OverlayPositioner.Props) {
  const nav = useNav();
  return (
    <OverlayPositioner
      {...props}
      anchor={props.anchor ?? nav.list}
      style={(state) => ({
        "--positioner-width": `${nav.size.width}px`,
        "--positioner-height": `${nav.size.height}px`,
        ...(typeof props.style === "function" ? props.style(state) : props.style),
      })}
    />
  );
}
export namespace Positioner {
  export type Props = OverlayPositioner.Props;
}
export function Popup(props: OverlayPopup.Props) {
  const nav = useNav(),
    ctx = useOverlayContext();
  return (
    <OverlayPopup
      {...props}
      initialFocus={false}
      render={props.render ?? <nav />}
      role={undefined}
      aria-modal={undefined}
      aria-labelledby={ctx.reference?.id}
      style={(state) => ({
        "--popup-width": `min(${nav.size.width}px,var(--available-width,${nav.size.width}px))`,
        "--popup-height": `${nav.size.height}px`,
        ...(typeof props.style === "function" ? props.style(state) : props.style),
      })}
      onPointerEnter={() => ctx.cancelTimers()}
      onPointerLeave={(event) => {
        if (!nav.list?.contains(event.relatedTarget as Node))
          ctx.schedule(false, event, "trigger-hover", nav.closeDelay);
      }}
    />
  );
}
export namespace Popup {
  export type Props = OverlayPopup.Props;
}
export function Viewport(props: BaseUIComponentProps<"div", {}>) {
  const nav = useNav();
  return useRenderElement("div", props, { ref: [props.ref ?? null, nav.setViewport], props: getElementProps(props) });
}
export namespace Viewport {
  export type Props = Parameters<typeof Viewport>[0];
}
export function Link({
  active = false,
  closeOnClick = true,
  ...props
}: BaseUIComponentProps<"a", { active: boolean }> & { active?: boolean; closeOnClick?: boolean }) {
  const nav = useNav();
  return useRenderElement("a", props, {
    state: { active },
    ref: props.ref,
    props: [
      {
        "aria-current": active ? "page" : undefined,
        onClick(event: MouseEvent) {
          if (closeOnClick) nav.change(null, event, "link-press");
        },
      },
      getElementProps(props),
    ],
  });
}
export namespace Link {
  export type Props = Parameters<typeof Link>[0];
}
export function Icon(props: BaseUIComponentProps<"span", { open: boolean }>) {
  const nav = useNav();
  return useRenderElement("span", props, {
    state: { open: nav.value != null },
    stateAttributesMapping: popupStateMapping,
    ref: props.ref,
    props: [{ "aria-hidden": true }, getElementProps(props)],
  });
}
export namespace Icon {
  export type Props = Parameters<typeof Icon>[0];
}