import { createContext } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { useDirection } from "../direction-provider";
import { createChangeEventDetails } from "../internals/createBaseUIEventDetails";
import { FloatingFocusManager } from "../internals/FloatingFocusManager";
import { getElementProps } from "../internals/popups/getElementProps";
import {
  useOverlayContext,
  popupStateMapping,
  type OverlayRootProps,
  type OverlayContextValue,
  type OverlayChangeDetails,
  type OverlayReason,
} from "../internals/popups/OverlayContext";
import {
  OverlayPortal,
  OverlayPositioner,
  OverlayArrow,
  OverlayBackdrop,
  usePositionContext,
  type OverlayPopupProps,
} from "../internals/popups/OverlayParts";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { OverlayTrigger, type OverlayTriggerProps } from "../internals/popups/OverlayTrigger";
import { PopupHandle } from "../internals/popups/PopupHandle";
import { transitionStatusMapping } from "../internals/stateAttributesMapping";
import type { BaseUIComponentProps, NonNativeButtonProps } from "../internals/types";
import type { Side, Align } from "../internals/useAnchorPositioning";
import { useButton } from "../internals/useButton";
import { useControlled } from "../internals/useControlled";
import { useHoverFloatingInteraction } from "../internals/useHoverFloatingInteraction";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useListNavigation, itemLabels } from "../internals/useListNavigation";
import { useOpenChangeComplete } from "../internals/useOpenChangeComplete";
import { usePopupTabExit } from "../internals/usePopupTabExit";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { useTransitionStatus, type TransitionStatus } from "../internals/useTransitionStatus";
import { MenubarContext, getMenubarMenus } from "../menubar/MenubarContext";
export { OverlayPortal as Portal, OverlayArrow as Arrow, OverlayBackdrop as Backdrop };
export { Separator } from "../separator";
interface MenuContextValue {
  overlay: OverlayContextValue;
  parent: MenuContextValue | null;
  loopFocus: boolean;
  highlightItemOnHover: boolean;
  orientation: "vertical" | "horizontal";
  closeAll(event: Event): boolean;
  children: Map<string, OverlayContextValue>;
  closeSiblings(id: string, event: Event): void;
}
export const MenuContext = createContext<MenuContextValue | null>(null);
export function useMenuContext() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("Base UI: Menu parts must be within Root.");
  return ctx;
}
export interface MenuRootProps<Payload = unknown> extends Omit<
  OverlayRootProps<Payload>,
  "modal" | "disableHoverablePopup"
> {
  modal?: boolean;
  loopFocus?: boolean;
  highlightItemOnHover?: boolean;
  orientation?: "vertical" | "horizontal";
  closeParentOnEsc?: boolean;
}
export function Root<Payload = unknown>({
  loopFocus = true,
  highlightItemOnHover = true,
  orientation = "vertical",
  closeParentOnEsc = false,
  ...props
}: MenuRootProps<Payload>) {
  const parent = useContext(MenuContext);
  const bar = useContext(MenubarContext);
  return (
    <OverlayRoot kind="menu" modal={props.modal ?? (parent ? false : (bar?.modal ?? true))} {...props}>
      <MenuBridge
        parent={parent}
        loopFocus={loopFocus}
        highlightItemOnHover={highlightItemOnHover}
        orientation={orientation}
        closeParentOnEsc={closeParentOnEsc}
      >
        {props.children}
      </MenuBridge>
    </OverlayRoot>
  );
}
function MenuBridge({
  children,
  parent,
  loopFocus,
  highlightItemOnHover,
  orientation,
  closeParentOnEsc,
}: {
  children: OverlayRootProps["children"];
  parent: MenuContextValue | null;
  loopFocus: boolean;
  highlightItemOnHover: boolean;
  orientation: "vertical" | "horizontal";
  closeParentOnEsc: boolean;
}) {
  const overlay = useOverlayContext();
  const submenus = useRef(new Map<string, OverlayContextValue>());
  const closeAll = useStableCallback((event: Event) => {
    let node: MenuContextValue | null = context;
    let accepted = true;
    while (node) {
      if (node.overlay.change(false, event, "item-press").isCanceled) accepted = false;
      node = node.parent;
    }
    return accepted;
  });
  const closeSiblings = useStableCallback((id: string, event: Event) => {
    for (const [key, child] of submenus.current)
      if (key !== id && child.open) child.change(false, event, "sibling-open");
  });
  const context: MenuContextValue = {
    overlay,
    parent,
    loopFocus,
    highlightItemOnHover,
    orientation,
    closeAll,
    children: submenus.current,
    closeSiblings,
  };
  useIsoLayoutEffect(() => {
    if (!parent) return;
    parent.children.set(overlay.id, overlay);
    return () => {
      parent.children.delete(overlay.id);
    };
  }, [parent?.children, overlay]);
  useEffect(() => {
    if (!parent?.overlay.open && parent && overlay.open) overlay.change(false, new Event("base-ui"), "cancel-open");
  }, [parent?.overlay.open, overlay.open]);
  useEffect(() => {
    if (
      !closeParentOnEsc ||
      !parent ||
      overlay.open ||
      overlay.floatingContext.dataRef.current.closeReason !== "escape-key"
    )
      return;
    parent.overlay.change(false, new Event("base-ui"), "escape-key");
  }, [overlay.open, closeParentOnEsc]);
  const content =
    typeof children === "function"
      ? children(overlay.handle.triggers.get(overlay.activeTriggerId ?? "")?.payload)
      : children;
  return <MenuContext.Provider value={context}>{content}</MenuContext.Provider>;
}
export namespace Root {
  export type Props<Payload = unknown> = MenuRootProps<Payload>;
  export type ChangeEventDetails = OverlayChangeDetails;
  export type ChangeEventReason = OverlayReason;
  export type Actions = { close(): void; unmount(): void };
}
export function SubmenuRoot(props: Omit<MenuRootProps, "modal">) {
  return <Root {...props} modal={false} />;
}
export namespace SubmenuRoot {
  export type Props = Omit<MenuRootProps, "modal">;
  export type ChangeEventDetails = OverlayChangeDetails;
}
export function createHandle<Payload = unknown>() {
  return new PopupHandle<Payload>();
}
export function Trigger<Payload = unknown>(props: OverlayTriggerProps<Payload>) {
  const [, update] = useState(0);
  useIsoLayoutEffect(() => props.handle?.subscribe(() => update((n) => n + 1)), [props.handle]);
  const menu = useContext(MenuContext);
  const bar = useContext(MenubarContext);
  const ctx = menu?.overlay ?? props.handle?.context ?? null;
  const element = useRef<HTMLElement | null>(null);
  useIsoLayoutEffect(() => {
    if (!bar || !ctx || !element.current) return;
    return bar.register(ctx.id, {
      element: element.current,
      open: ctx.open,
      change: (open, event) => ctx.change(open, event, "sibling-open", element.current ?? undefined),
    });
  }, [bar?.register, ctx?.id, ctx?.open, ctx?.change]);
  const first = bar
    ? getMenubarMenus(bar.menus).find(([, m]) => !m.element.hasAttribute("disabled"))?.[1].element
    : null;
  return (
    <OverlayTrigger
      {...props}
      ref={(node: HTMLElement | null) => {
        element.current = node;
        if (typeof props.ref === "function") props.ref(node as HTMLButtonElement);
        else if (props.ref) props.ref.current = node as HTMLButtonElement;
      }}
      disabled={props.disabled || bar?.disabled || ctx?.disabled}
      aria-haspopup="menu"
      data-popup-open={ctx?.open ? "" : undefined}
      tabIndex={
        bar
          ? bar.highlighted
            ? bar.highlighted === ctx?.id
              ? 0
              : -1
            : first == null || first === element.current
              ? 0
              : -1
          : props.tabIndex
      }
      onFocus={(event) => {
        props.onFocus?.(event);
        if (!event.baseUIHandlerPrevented && ctx) bar?.setHighlighted(ctx.id);
      }}
      onPointerEnter={(event) => {
        props.onPointerEnter?.(event);
        if (event.baseUIHandlerPrevented) return;
        if (bar && [...bar.menus.values()].some((m) => m.open) && ctx && !props.disabled) bar.switchTo(ctx.id, event);
        else if (props.openOnHover && ctx)
          ctx.schedule(true, event, "trigger-hover", props.delay ?? 100, element.current ?? undefined, props.payload);
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.baseUIHandlerPrevented || !ctx || props.disabled) return;
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
          event.preventDefault();
          bar?.switchTo(ctx.id, event);
          ctx.change(true, event, "list-navigation", element.current ?? undefined, props.payload);
          ctx.floatingContext.dataRef.current.openEvent = event;
          queueMicrotask(() => {
            const popup = ctx.popupRef.current;
            const items = popup
              ? [...popup.querySelectorAll<HTMLElement>('[role^="menuitem"]')].filter(
                  (e) => e.getAttribute("aria-disabled") !== "true" && e.closest("[role=menu]") === popup,
                )
              : [];
            (event.key === "ArrowUp" ? items.at(-1) : items[0])?.focus();
          });
        }
      }}
    />
  );
}
export namespace Trigger {
  export type Props<Payload = unknown> = OverlayTriggerProps<Payload>;
}
export function Positioner(props: OverlayPositioner.Props) {
  return <OverlayPositioner side={useMenuContext().parent ? "inline-end" : "bottom"} align="start" {...props} />;
}
export namespace Positioner {
  export type Props = OverlayPositioner.Props;
}
export interface MenuPopupState {
  open: boolean;
  transitionStatus: TransitionStatus;
  nested: boolean;
  side: Side;
  align: Align;
  instant: "dismiss" | "click" | "group" | "trigger-change" | undefined;
}
export interface MenuPopupProps extends BaseUIComponentProps<"div", MenuPopupState> {
  finalFocus?: OverlayPopupProps["finalFocus"];
}
export function Popup(props: MenuPopupProps) {
  const menu = useMenuContext(),
    ctx = menu.overlay,
    position = usePositionContext(),
    bar = useContext(MenubarContext),
    direction = useDirection();
  const ownItems = () =>
    ctx.popupRef.current
      ? [...ctx.popupRef.current.querySelectorAll<HTMLElement>('[role^="menuitem"]')].filter(
          (e) => e.closest("[role=menu]") === ctx.popupRef.current,
        )
      : [];
  const { navigate, focusEdge } = useListNavigation(ownItems, {
    orientation: menu.orientation,
    loopFocus: menu.loopFocus,
  });
  const tabExit = usePopupTabExit(
    () => {
      let root = menu;
      while (root.parent) root = root.parent;
      return root.overlay.reference;
    },
    (event) => menu.closeAll(event),
  );
  const leave = useHoverFloatingInteraction(ctx, () => ctx.closeDelay.current, true);
  const node = useRenderElement("div", props, {
    state: {
      open: ctx.open,
      transitionStatus: ctx.transitionStatus,
      nested: !!menu.parent,
      side: position?.side ?? "bottom",
      align: position?.align ?? "start",
      instant: undefined,
    },
    ref: [props.ref ?? null, ctx.setPopup],
    stateAttributesMapping: { ...popupStateMapping, ...transitionStatusMapping },
    props: [
      {
        id: ctx.popupId,
        role: "menu",
        tabIndex: -1,
        "aria-orientation": menu.orientation,
        "aria-labelledby": ctx.reference?.id,
        hidden: !ctx.mounted,
        inert: !ctx.open ? "" : undefined,
        onPointerEnter() {
          ctx.cancelTimers();
        },
        onPointerLeave(event: PointerEvent) {
          if (menu.parent) leave(event);
        },
        onKeyDown(event: KeyboardEvent) {
          if (navigate(event)) return;
          if (event.key === (direction === "rtl" ? "ArrowRight" : "ArrowLeft") && menu.parent) {
            event.preventDefault();
            event.stopPropagation();
            ctx.change(false, event, "list-navigation");
            ctx.reference?.focus();
            return;
          }
          if (bar && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
            const list = getMenubarMenus(bar.menus);
            const i = list.findIndex(([id]) => id === ctx.id);
            const step = (event.key === "ArrowRight") !== (direction === "rtl") ? 1 : -1;
            const next = list[(i + step + list.length) % list.length];
            if (next) {
              event.preventDefault();
              event.stopPropagation();
              next[1].element.focus();
              bar.switchTo(next[0], event);
            }
            return;
          }
          if (tabExit(event)) return;
          if ((event.key === "Enter" || event.key === " ") && !event.defaultPrevented) {
            const active = ctx.popupRef.current?.ownerDocument.activeElement as HTMLElement;
            if (active && ownItems().includes(active)) {
              event.preventDefault();
              active.click();
            }
          }
        },
      },
      getElementProps(props),
    ],
  });
  return (
    <FloatingFocusManager
      context={ctx.floatingContext}
      disabled={!ctx.mounted}
      modal={ctx.modal !== false}
      initialFocus={() => {
        const event = ctx.floatingContext.dataRef.current.openEvent;
        if (event?.type === "keydown") {
          queueMicrotask(() => focusEdge((event as KeyboardEvent).key === "ArrowUp"));
          return false;
        }
        return ctx.popupRef.current;
      }}
      returnFocus={props.finalFocus}
      closeOnFocusOut
      getInsideElements={() => [bar?.element]}
    >
      {node!}
    </FloatingFocusManager>
  );
}
export namespace Popup {
  export type Props = MenuPopupProps;
  export type State = MenuPopupState;
}
interface ItemState {
  disabled: boolean;
  highlighted: boolean;
}
export interface ItemProps extends BaseUIComponentProps<"div", ItemState>, NonNativeButtonProps {
  disabled?: boolean;
  label?: string;
  closeOnClick?: boolean;
}
interface ItemOptions {
  role?: "menuitem" | "menuitemcheckbox" | "menuitemradio";
  checked?: boolean;
  open?: boolean;
  select?(event: MouseEvent): boolean | void;
  menu?: MenuContextValue;
  extra?: Record<string, unknown>;
}
function useItem(props: ItemProps, options: ItemOptions = {}) {
  const inherited = useMenuContext(),
    menu = options.menu ?? inherited,
    ctx = menu.overlay;
  const { disabled = ctx.disabled, label, nativeButton = false, closeOnClick = true, ...native } = props;
  const [highlighted, setHighlighted] = useState(false);
  const el = useRef<HTMLElement | null>(null);
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled, focusableWhenDisabled: true });
  const setElement = useStableCallback((node: HTMLElement | null) => {
    el.current = node;
    if (node && label) itemLabels.set(node, label);
  });
  const id = useBaseUiId(native.id);
  const handlers = getButtonProps({
    id,
    role: options.role ?? "menuitem",
    tabIndex: -1,
    "aria-disabled": disabled || undefined,
    "aria-checked": options.checked,
    onFocus() {
      setHighlighted(true);
    },
    onBlur() {
      setHighlighted(false);
    },
    onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "touch" && menu.highlightItemOnHover && !disabled) {
        el.current?.focus({ preventScroll: true });
        menu.closeSiblings("", event);
      }
    },
    onClick(event: MouseEvent) {
      if (disabled) return;
      if (options.select?.(event) === false) return;
      if (closeOnClick) menu.closeAll(event);
    },
    ...options.extra,
  });
  return {
    node: useRenderElement("div", props, {
      state: {
        disabled,
        highlighted,
        ...(options.checked === undefined ? {} : { checked: options.checked }),
        ...(options.open === undefined ? {} : { open: options.open }),
      },
      ref: [props.ref ?? null, buttonRef, setElement],
      props: [handlers, getElementProps(native)],
      stateAttributesMapping: {
        open: (v: boolean | undefined) => (v === undefined ? null : popupStateMapping.open(v)),
        checked: (v: boolean | undefined): Record<string, string> | null =>
          v === undefined ? null : v ? { "data-checked": "" } : { "data-unchecked": "" },
      },
    }),
    highlighted,
    disabled,
  };
}
export function Item(props: ItemProps) {
  return useItem(props).node;
}
export namespace Item {
  export type Props = ItemProps;
  export type State = ItemState;
}
const CheckedContext = createContext({ checked: false, highlighted: false, disabled: false });
export interface CheckboxItemProps
  extends
    Omit<ItemProps, "className" | "style" | "render">,
    BaseUIComponentProps<"div", ItemState & { checked: boolean }> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean, details: OverlayChangeDetails) => void;
}
export function CheckboxItem({
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: CheckboxItemProps) {
  const [checked, setChecked] = useControlled({ controlled, default: defaultChecked, name: "Menu.CheckboxItem" });
  const item = useItem({ ...props, closeOnClick: props.closeOnClick ?? false } as ItemProps, {
    role: "menuitemcheckbox",
    checked,
    select(event) {
      const details = createChangeEventDetails("item-press", event, undefined, { preventUnmountOnClose() {} });
      onCheckedChange?.(!checked, details);
      if (details.isCanceled) return false;
      setChecked(!checked);
      return true;
    },
  });
  return (
    <CheckedContext.Provider value={{ checked, highlighted: item.highlighted, disabled: item.disabled }}>
      {item.node}
    </CheckedContext.Provider>
  );
}
export namespace CheckboxItem {
  export type Props = CheckboxItemProps;
  export type ChangeEventDetails = OverlayChangeDetails;
}
export function CheckboxItemIndicator({
  keepMounted = false,
  ...props
}: BaseUIComponentProps<"span", ItemState & { checked: boolean; transitionStatus: TransitionStatus }> & {
  keepMounted?: boolean;
}) {
  const checkedState = useContext(CheckedContext);
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(checkedState.checked);
  const ref = useRef<HTMLElement | null>(null);
  useOpenChangeComplete({
    open: checkedState.checked,
    ref,
    onComplete() {
      if (!checkedState.checked) setMounted(false);
    },
  });
  const state = { ...checkedState, transitionStatus };
  return useRenderElement("span", props, {
    enabled: mounted || keepMounted,
    state,
    ref: [props.ref ?? null, ref],
    props: [{ "aria-hidden": true, hidden: !mounted }, getElementProps(props)],
    stateAttributesMapping: {
      ...transitionStatusMapping,
      checked: (v: boolean | undefined): Record<string, string> | null =>
        v === undefined ? null : v ? { "data-checked": "" } : { "data-unchecked": "" },
    },
  });
}
export namespace CheckboxItemIndicator {
  export type Props = Parameters<typeof CheckboxItemIndicator>[0];
}
const RadioContext = createContext<{ value: any; disabled: boolean; change(value: any, event: MouseEvent): boolean }>({
  value: null,
  disabled: false,
  change: () => false,
});
export interface RadioGroupProps extends BaseUIComponentProps<"div", { disabled: boolean }> {
  value?: any;
  defaultValue?: any;
  disabled?: boolean;
  onValueChange?: (value: any, details: OverlayChangeDetails) => void;
}
export function RadioGroup({
  value: controlled,
  defaultValue,
  disabled = false,
  onValueChange,
  ...props
}: RadioGroupProps) {
  const [value, setValue] = useControlled({ controlled, default: defaultValue, name: "Menu.RadioGroup" });
  return (
    <RadioContext.Provider
      value={{
        value,
        disabled,
        change(next, event) {
          const details = createChangeEventDetails("item-press", event, undefined, { preventUnmountOnClose() {} });
          onValueChange?.(next, details);
          if (details.isCanceled) return false;
          setValue(next);
          return true;
        },
      }}
    >
      {useRenderElement("div", props, {
        state: { disabled },
        ref: props.ref,
        props: [{ role: "group" }, getElementProps(props)],
      })}
    </RadioContext.Provider>
  );
}
export namespace RadioGroup {
  export type Props = RadioGroupProps;
  export type ChangeEventDetails = OverlayChangeDetails;
}
export function RadioItem({ value, ...props }: CheckboxItemProps & { value: any }) {
  const group = useContext(RadioContext);
  const checked = group.value === value;
  const item = useItem(
    { ...props, disabled: props.disabled || group.disabled, closeOnClick: props.closeOnClick ?? false } as ItemProps,
    { role: "menuitemradio", checked, select: (event) => group.change(value, event) },
  );
  return (
    <CheckedContext.Provider value={{ checked, disabled: item.disabled, highlighted: item.highlighted }}>
      {item.node}
    </CheckedContext.Provider>
  );
}
export namespace RadioItem {
  export type Props = CheckboxItemProps & { value: any };
}
export const RadioItemIndicator = CheckboxItemIndicator;
export namespace RadioItemIndicator {
  export type Props = CheckboxItemIndicator.Props;
}
const GroupContext = createContext<{ id: string | undefined; setId(id: string | undefined): void }>({
  id: undefined,
  setId() {},
});
export function Group(props: BaseUIComponentProps<"div", {}>) {
  const [id, setId] = useState<string>();
  return (
    <GroupContext.Provider value={{ id, setId }}>
      {useRenderElement("div", props, {
        ref: props.ref,
        props: [{ role: "group", "aria-labelledby": id }, getElementProps(props)],
      })}
    </GroupContext.Provider>
  );
}
export namespace Group {
  export type Props = Parameters<typeof Group>[0];
}
export function GroupLabel(props: BaseUIComponentProps<"div", {}>) {
  const group = useContext(GroupContext);
  const id = useBaseUiId(props.id);
  useIsoLayoutEffect(() => {
    group.setId(id);
    return () => group.setId(undefined);
  }, [id, group.setId]);
  return useRenderElement("div", props, { ref: props.ref, props: [{ id }, getElementProps(props)] });
}
export namespace GroupLabel {
  export type Props = Parameters<typeof GroupLabel>[0];
}
export interface SubmenuTriggerProps
  extends
    Omit<ItemProps, "className" | "style" | "render">,
    BaseUIComponentProps<"div", ItemState & { open: boolean }> {
  delay?: number;
  closeDelay?: number;
  openOnHover?: boolean;
}
export function SubmenuTrigger({ delay = 100, closeDelay = 0, openOnHover = true, ...props }: SubmenuTriggerProps) {
  const menu = useMenuContext(),
    ctx = menu.overlay,
    direction = useDirection();
  const el = useRef<HTMLElement | null>(null);
  const leave = useHoverFloatingInteraction(ctx, () => closeDelay);
  const ref = useStableCallback((e: HTMLElement | null) => {
    el.current = e;
    ctx.setReference(e);
    if (typeof props.ref === "function") props.ref(e as HTMLDivElement);
    else if (props.ref) props.ref.current = e as HTMLDivElement;
  });
  const open = (event: Event) => {
    if (props.disabled) return;
    menu.parent?.closeSiblings(ctx.id, event);
    ctx.change(true, event, "list-navigation", el.current ?? undefined);
  };
  return useItem({ ...props, ref, closeOnClick: false } as ItemProps, {
    open: ctx.open,
    menu: menu.parent ?? menu,
    select: () => false,
    extra: {
      "aria-haspopup": "menu",
      "aria-expanded": ctx.open,
      "aria-controls": ctx.mounted ? ctx.popupId : undefined,
      "data-open": ctx.open ? "" : undefined,
      "data-popup-open": ctx.open ? "" : undefined,
      onPointerMove(event: PointerEvent) {
        if (event.pointerType === "touch" || props.disabled) return;
        el.current?.focus({ preventScroll: true });
        menu.parent?.closeSiblings(ctx.id, event);
        if (openOnHover) ctx.schedule(true, event, "trigger-hover", delay, el.current ?? undefined);
      },
      onPointerLeave: leave,
      onClick: open,
      onKeyDown(event: KeyboardEvent) {
        if (
          event.key === (direction === "rtl" ? "ArrowLeft" : "ArrowRight") ||
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          event.stopPropagation();
          open(event);
        }
      },
    },
  }).node;
}
export namespace SubmenuTrigger {
  export type Props = SubmenuTriggerProps;
}