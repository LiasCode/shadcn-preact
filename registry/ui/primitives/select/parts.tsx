import { createContext, type ComponentChildren, type Ref } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { createChangeEventDetails } from "../internals/createBaseUIEventDetails";
import { FieldPopupLifecycle } from "../internals/FieldPopupLifecycle";
import { FieldRootContext, fieldValidityMapping } from "../internals/FieldRootContext";
import { FieldsetRootContext } from "../internals/FieldsetRootContext";
import { getElementProps } from "../internals/popups/getElementProps";
import {
  useOverlayContext,
  type OverlayChangeDetails,
  type OverlayRootProps,
  popupStateMapping,
} from "../internals/popups/OverlayContext";
import { OverlayPortal, OverlayPositioner, OverlayPopup, usePositionContext } from "../internals/popups/OverlayParts";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { stringifyAsValue } from "../internals/resolveValueLabel";
import type { BaseUIComponentProps, NativeButtonProps, NonNativeButtonProps } from "../internals/types";
import { useButton } from "../internals/useButton";
import { useControlled } from "../internals/useControlled";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useListNavigation, itemLabels } from "../internals/useListNavigation";
import { usePopupTabExit } from "../internals/usePopupTabExit";
import { useRegisterFieldControl } from "../internals/useRegisterFieldControl";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { visuallyHidden } from "../internals/visuallyHidden";
export { OverlayPortal as Portal };
export { Separator } from "../separator";
interface SelectContextValue {
  value: any;
  multiple: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  highlightItemOnHover: boolean;
  equal(a: any, b: any): boolean;
  choose(value: any, event: Event, reason?: "item-press" | "list-navigation"): boolean;
  triggerRef: { current: HTMLElement | null };
  items: Map<any, ComponentChildren>;
  register(value: any, label: ComponentChildren): void;
  inputId?: string;
  list: HTMLElement | null;
  setList(node: HTMLElement | null): void;
  placeholder: boolean;
}
const Context = createContext<SelectContextValue | null>(null);
function useSelect() {
  const c = useContext(Context);
  if (!c) throw new Error("Base UI: Select parts require Root.");
  return c;
}
type ValueType<V, M extends boolean | undefined> = M extends true ? V[] : V;
interface RootProps<V = any, M extends boolean | undefined = false> extends Omit<
  OverlayRootProps,
  "children" | "disabled" | "actionsRef"
> {
  children?: ComponentChildren;
  value?: ValueType<V, M> | null;
  defaultValue?: ValueType<V, M> | null;
  onValueChange?: (value: ValueType<V, M> | null, details: OverlayChangeDetails) => void;
  multiple?: M;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  form?: string;
  autoComplete?: string;
  id?: string;
  inputRef?: Ref<HTMLInputElement>;
  actionsRef?: { current: { unmount(): void } | null };
  items?:
    | Record<string, ComponentChildren>
    | readonly (
        | { label: ComponentChildren; value: any }
        | { items: readonly { label: ComponentChildren; value: any }[] }
      )[];
  itemToStringLabel?: (value: V) => string;
  itemToStringValue?: (value: V) => string;
  isItemEqualToValue?: (a: V, b: V) => boolean;
  highlightItemOnHover?: boolean;
}
export function Root<V = any, M extends boolean | undefined = false>({
  value: controlled,
  defaultValue,
  multiple = false as M,
  disabled: disabledProp = false,
  readOnly = false,
  required = false,
  name: nameProp,
  form,
  autoComplete,
  id: idProp,
  inputRef,
  items,
  itemToStringLabel,
  itemToStringValue,
  isItemEqualToValue = Object.is,
  highlightItemOnHover = true,
  onValueChange,
  children,
  actionsRef,
  ...overlay
}: RootProps<V, M>) {
  const field = useContext(FieldRootContext);
  const fieldset = useContext(FieldsetRootContext);
  const disabled = field?.state.disabled || fieldset?.disabled || disabledProp;
  const name = field?.name ?? nameProp;
  const id = useBaseUiId(idProp);
  const [value, setValue] = useControlled<any>({
    controlled,
    default: defaultValue ?? (multiple ? [] : null),
    name: "Select",
  });
  const [labels, setLabels] = useState(new Map<any, ComponentChildren>());
  const [list, setList] = useState<HTMLElement | null>(null);
  const input = useRef<HTMLInputElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const equal = isItemEqualToValue;
  const options = new Map(labels);
  if (Array.isArray(items)) {
    for (const item of items) {
      if ("items" in item) {
        for (const i of item.items) options.set(i.value, i.label);
      } else options.set(item.value, item.label);
    }
  } else if (items) {
    for (const [v, label] of Object.entries(items)) options.set(v, label);
  }
  const register = useStableCallback((v: any, label: ComponentChildren) => {
    setLabels((previous) => {
      if (previous.get(v) === label) return previous;
      const next = new Map(previous);
      next.set(v, label);
      return next;
    });
  });
  const choose = useStableCallback((v: any, event: Event, reason: "item-press" | "list-navigation" = "item-press") => {
    if (disabled || readOnly) return false;
    const next = multiple
      ? (value as any[]).some((x) => equal(x, v))
        ? (value as any[]).filter((x) => !equal(x, v))
        : [...(value as any[]), v]
      : v;
    const details = createChangeEventDetails(reason, event, undefined, { preventUnmountOnClose() {} });
    onValueChange?.(next, details);
    if (details.isCanceled) return false;
    setValue(next);
    return true;
  });
  const stringify = (v: any) => stringifyAsValue(v, itemToStringValue);
  const serialized = multiple ? (value as any[]).map(stringify) : [stringify(value)];
  const placeholder = multiple ? (value as any[]).length === 0 : value == null;
  const context: SelectContextValue = {
    value,
    multiple: !!multiple,
    disabled,
    readOnly,
    required,
    highlightItemOnHover,
    equal,
    choose,
    items: options,
    register,
    inputId: id,
    triggerRef,
    list,
    setList,
    placeholder,
  };
  useIsoLayoutEffect(() => {
    const node = input.current,
      owner = node?.form;
    if (!owner) return;
    const reset = (event: Event) => {
      setTimeout(() => {
        if (event.defaultPrevented) return;
        const next = defaultValue ?? (multiple ? [] : null);
        const details = createChangeEventDetails("none", event, undefined, { preventUnmountOnClose() {} });
        onValueChange?.(next as any, details);
        if (!details.isCanceled) setValue(next);
        const restoredValue = controlled !== undefined ? controlled : details.isCanceled ? value : next;
        if (node) node.value = stringify(multiple ? restoredValue?.[0] : restoredValue);
      });
    };
    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [form, defaultValue, controlled, value, multiple, onValueChange, setValue, itemToStringValue]);
  useRegisterFieldControl({
    inputRef: input,
    controlRef: triggerRef,
    id,
    name: nameProp,
    disabled,
    value,
    getFormValue: () => (multiple ? serialized : (serialized[0] ?? "")),
    isFilled: () => (multiple ? value.length > 0 : value != null && serialized[0] !== ""),
    isEqual: (next, initial) =>
      Object.is(next, initial) ||
      (next != null &&
        initial != null &&
        (Array.isArray(next) && Array.isArray(initial)
          ? next.length === initial.length &&
            next.every((entry, index) => Object.is(entry, initial[index]) || equal(entry, initial[index]))
          : equal(next as V, initial as V))),
  });
  const previous = useRef(value);
  useIsoLayoutEffect(() => {
    if (previous.current === value) return;
    previous.current = value;
    const node = input.current;
    if (node) {
      node.dispatchEvent(new Event("input", { bubbles: true }));
      node.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, [value]);
  const mapped = itemToStringLabel
    ? new Map([...context.items].map(([v]) => [v, v == null ? context.items.get(v) : itemToStringLabel(v)]))
    : context.items;
  context.items = mapped;
  return (
    <Context.Provider value={context}>
      <OverlayRoot kind="select" modal={true} disabled={disabled} actionsRef={actionsRef as any} {...overlay}>
        <FieldPopupLifecycle />
        {children}
        <input
          ref={(node) => {
            input.current = node;
            if (typeof inputRef === "function") inputRef(node);
            else if (inputRef) inputRef.current = node;
          }}
          type="text"
          name={multiple ? undefined : name}
          form={form}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          value={serialized[0] ?? ""}
          tabIndex={-1}
          aria-hidden="true"
          style={visuallyHidden}
          onFocus={() => triggerRef.current?.focus()}
        />
        {multiple &&
          name &&
          serialized.map((v: string, i: number) => (
            <input key={i} type="hidden" name={name} form={form} value={v} disabled={disabled} />
          ))}
      </OverlayRoot>
    </Context.Provider>
  );
}
export namespace Root {
  export type Props<V = any, M extends boolean | undefined = false> = RootProps<V, M>;
  export type ChangeEventDetails = OverlayChangeDetails;
}
interface TriggerState {
  open: boolean;
  readOnly: boolean;
  popupSide: string | null;
  value: any;
  placeholder: boolean;
  disabled: boolean;
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}
export function Trigger({
  nativeButton = true,
  disabled: ownDisabled = false,
  ...props
}: BaseUIComponentProps<"button", TriggerState> & NativeButtonProps) {
  const field = useContext(FieldRootContext);
  const select = useSelect(),
    ctx = useOverlayContext(),
    el = useRef<HTMLElement | null>(null);
  const { buttonRef, getButtonProps } = useButton({
    native: nativeButton,
    disabled: select.disabled || ownDisabled,
  });
  const id = useBaseUiId(props.id ?? select.inputId);
  const state = {
    open: ctx.open,
    readOnly: select.readOnly,
    popupSide: null,
    value: select.value,
    placeholder: select.placeholder,
    disabled: select.disabled || ownDisabled || false,
    valid: field?.state.valid ?? null,
    touched: field?.state.touched ?? false,
    dirty: field?.state.dirty ?? false,
    filled: field?.state.filled ?? false,
    focused: field?.state.focused ?? false,
  };
  const show = (event: Event) => {
    if (state.disabled || select.readOnly) return;
    ctx.change(true, event, "trigger-press", el.current ?? undefined);
  };
  const search = useRef("");
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  const { navigate } = useListNavigation(() =>
    select.list ? [...select.list.querySelectorAll<HTMLElement>("[role=option]")] : [],
  );
  return useRenderElement("button", props, {
    state,
    ref: [props.ref ?? null, el, buttonRef, ctx.setReference, select.triggerRef],
    stateAttributesMapping: {
      ...popupStateMapping,
      value: () => null,
      popupSide: () => null,
      valid: fieldValidityMapping.valid,
    },
    props: [
      getButtonProps({
        id,
        role: "combobox",
        "aria-haspopup": "listbox",
        "aria-expanded": ctx.open,
        "aria-controls": ctx.mounted ? ctx.popupId : undefined,
        "aria-required": select.required || undefined,
        "aria-labelledby": field?.labelId,
        "aria-describedby": field?.messages.join(" ") || undefined,
        "aria-invalid": (field?.state.valid === false && !state.disabled) || undefined,
        onFocus() {
          field?.focus(true);
        },
        onBlur(event: FocusEvent) {
          if (!ctx.open && !ctx.popupRef.current?.contains(event.relatedTarget as Node | null)) field?.focus(false);
        },
        "aria-readonly": select.readOnly || undefined,
        onClick(event: MouseEvent) {
          if (ctx.open) ctx.change(false, event, "trigger-press");
          else show(event);
        },
        onKeyDown(event: KeyboardEvent) {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
            event.preventDefault();
            show(event);
          } else if (ctx.open) navigate(event);
          else if (
            !state.disabled &&
            !select.readOnly &&
            !select.multiple &&
            event.key.length === 1 &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey &&
            !event.isComposing
          ) {
            clearTimeout(timeout.current);
            search.current += event.key.toLocaleLowerCase();
            timeout.current = setTimeout(() => {
              search.current = "";
            }, 500);
            const letters = [...search.current];
            const query = letters.every((c) => c === letters[0]) ? letters[0]! : search.current;
            const options = [...select.items];
            const selected = options.findIndex(([v]) => select.equal(v, select.value));
            const first = query.length > 1 ? Math.max(selected, 0) : selected + 1;
            for (let offset = 0; offset < options.length; offset++) {
              const option = options[(first + offset) % options.length]!;
              if (typeof option[1] === "string" && option[1].toLocaleLowerCase().startsWith(query)) {
                event.preventDefault();
                select.choose(option[0], event, "list-navigation");
                break;
              }
            }
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
export function Value({
  placeholder,
  children,
  ...props
}: Omit<BaseUIComponentProps<"span", { value: any; placeholder: boolean }>, "children"> & {
  placeholder?: ComponentChildren;
  children?: ComponentChildren | ((value: any) => ComponentChildren);
}) {
  const select = useSelect();
  const label = (value: any) =>
    [...select.items].find(([v]) => select.equal(v, value))?.[1] ?? (value == null ? placeholder : String(value));
  const content =
    typeof children === "function"
      ? children(select.value)
      : (children ??
        (select.placeholder
          ? (placeholder ?? label(null))
          : select.multiple
            ? (select.value as any[])
                .map(label)
                .reduce<ComponentChildren>((acc, v, i) => [acc, i ? ", " : null, v], null)
            : label(select.value)));
  return useRenderElement("span", props, {
    state: { value: select.value, placeholder: select.placeholder },
    stateAttributesMapping: { value: () => null },
    ref: props.ref,
    props: [{ children: content }, getElementProps(props)],
  });
}
export namespace Value {
  export type Props = Parameters<typeof Value>[0];
}
export function Positioner({
  alignItemWithTrigger = true,
  ...props
}: OverlayPositioner.Props & { alignItemWithTrigger?: boolean }) {
  return (
    <OverlayPositioner positionMethod="fixed" {...props}>
      <ItemAlignment enabled={alignItemWithTrigger} />
      {props.children}
    </OverlayPositioner>
  );
}
export namespace Positioner {
  export type Props = Parameters<typeof Positioner>[0];
}
function ItemAlignment({ enabled }: { enabled: boolean }) {
  const ctx = useOverlayContext(),
    select = useSelect(),
    position = usePositionContext();
  useIsoLayoutEffect(() => {
    if (!enabled || !ctx.open || !position?.isPositioned) return;
    const openEvent = ctx.floatingContext.dataRef.current.openEvent;
    if (openEvent && "pointerType" in openEvent && openEvent.pointerType === "touch") return;
    const e = position.refs.floating.current,
      trigger = ctx.reference,
      item =
        select.list?.querySelector<HTMLElement>("[aria-selected=true]") ??
        select.list?.querySelector<HTMLElement>("[role=option]");
    if (!e || !trigger || !item) return;
    const popup = ctx.popupRef.current;
    if (!popup) return;
    const measure = () => {
      const anchor = trigger.getBoundingClientRect(),
        r = item.getBoundingClientRect(),
        p = e.getBoundingClientRect();
      const h = trigger.ownerDocument.defaultView?.innerHeight ?? 0;
      const minHeight = parseFloat(trigger.ownerDocument.defaultView?.getComputedStyle(e).minHeight ?? "") || 80;
      if (anchor.top < 20 || anchor.bottom > h - 20 || h < minHeight + 40) return;
      const desired = anchor.top + anchor.height / 2 - (r.top - p.top + r.height / 2);
      const top = Math.max(8, Math.min(Math.max(8, h - p.height - 8), desired));
      e.style.top = `${top}px`;
      e.setAttribute("data-side", "none");
      popup.setAttribute("data-side", "none");
      popup.scrollTop += top - desired;
    };
    measure();
  }, [ctx.open, position?.isPositioned, enabled, select.list]);
  return null;
}
export function Popup(props: OverlayPopup.Props) {
  const select = useSelect(),
    ctx = useOverlayContext();
  useEffect(() => {
    if (!ctx.open) return;
    const win = ctx.popupRef.current?.ownerDocument.defaultView;
    const resize = (event: Event) => ctx.change(false, event, "window-resize");
    win?.addEventListener("resize", resize);
    return () => win?.removeEventListener("resize", resize);
  }, [ctx.open, ctx.change]);
  const tabExit = usePopupTabExit(
    () => ctx.reference,
    (event) => !ctx.change(false, event, "focus-out").isCanceled,
  );
  const { navigate } = useListNavigation(() =>
    select.list ? [...select.list.querySelectorAll<HTMLElement>("[role=option]")] : [],
  );
  return (
    <OverlayPopup
      {...props}
      role="listbox"
      aria-modal={undefined}
      aria-labelledby={ctx.reference?.id}
      aria-multiselectable={select.multiple || undefined}
      initialFocus={(type) =>
        select.list?.querySelector<HTMLElement>("[aria-selected=true]:not([aria-disabled=true])") ??
        (type === "keyboard"
          ? select.list?.querySelector<HTMLElement>("[role=option]:not([aria-disabled=true])")
          : null) ??
        ctx.popupRef.current
      }
      onKeyDown={(event) => {
        props.onKeyDown?.(event);
        if (event.baseUIHandlerPrevented) return;
        if (navigate(event)) return;
        if ((event.key === "Enter" || event.key === " ") && !event.defaultPrevented) {
          event.preventDefault();
          (ctx.popupRef.current?.ownerDocument.activeElement as HTMLElement)?.click();
        } else tabExit(event);
      }}
    />
  );
}
export namespace Popup {
  export type Props = OverlayPopup.Props;
}
export function List(props: BaseUIComponentProps<"div", {}>) {
  const select = useSelect();
  return useRenderElement("div", props, { ref: [props.ref ?? null, select.setList], props: getElementProps(props) });
}
export namespace List {
  export type Props = Parameters<typeof List>[0];
}
const ItemContext = createContext({ selected: false, disabled: false, highlighted: false, value: null as any });
interface ItemProps
  extends
    BaseUIComponentProps<"div", { selected: boolean; disabled: boolean; highlighted: boolean }>,
    NonNativeButtonProps {
  value?: any;
  label?: string;
  disabled?: boolean;
}
export function Item({
  value = null,
  label,
  disabled: ownDisabled = false,
  nativeButton = false,
  ...props
}: ItemProps) {
  const select = useSelect(),
    ctx = useOverlayContext();
  const disabled = ownDisabled || select.disabled;
  const selected = select.multiple
    ? (select.value as any[]).some((v) => select.equal(v, value))
    : select.equal(select.value, value);
  const [highlighted, setHighlighted] = useState(false);
  const el = useRef<HTMLElement | null>(null);
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled, focusableWhenDisabled: true });
  const id = useBaseUiId();
  const setElement = useStableCallback((node: HTMLElement | null) => {
    el.current = node;
    if (node && label) itemLabels.set(node, label);
  });
  const state = { selected, disabled, highlighted, value };
  const node = useRenderElement("div", props, {
    state,
    ref: [props.ref ?? null, setElement, buttonRef],
    props: [
      getButtonProps({
        id,
        role: "option",
        tabIndex: -1,
        "aria-selected": selected,
        "aria-disabled": disabled || undefined,
        onFocus() {
          setHighlighted(true);
        },
        onBlur() {
          setHighlighted(false);
        },
        onPointerMove(event: PointerEvent) {
          if (!disabled && select.highlightItemOnHover && event.pointerType !== "touch")
            el.current?.focus({ preventScroll: true });
        },
        onClick(event: MouseEvent) {
          if (disabled) return;
          if (select.choose(value, event) && !select.multiple) ctx.change(false, event, "item-press");
        },
      }),
      getElementProps(props),
    ],
    stateAttributesMapping: { value: () => null },
  });
  return <ItemContext.Provider value={state}>{node}</ItemContext.Provider>;
}
export namespace Item {
  export type Props = ItemProps;
}
export function ItemText(props: BaseUIComponentProps<"span", {}>) {
  const item = useContext(ItemContext),
    select = useSelect();
  useIsoLayoutEffect(() => select.register(item.value, props.children), [item.value, props.children, select.register]);
  return useRenderElement("span", props, { ref: props.ref, props: getElementProps(props) });
}
export namespace ItemText {
  export type Props = Parameters<typeof ItemText>[0];
}
export function ItemIndicator({
  keepMounted = false,
  ...props
}: BaseUIComponentProps<"span", { selected: boolean; disabled: boolean; highlighted: boolean }> & {
  keepMounted?: boolean;
}) {
  const item = useContext(ItemContext);
  return useRenderElement("span", props, {
    enabled: item.selected || keepMounted,
    state: item,
    ref: props.ref,
    props: [{ "aria-hidden": true, hidden: !item.selected }, getElementProps(props)],
    stateAttributesMapping: { value: () => null } as any,
  });
}
export namespace ItemIndicator {
  export type Props = Parameters<typeof ItemIndicator>[0];
}
export function Icon(props: BaseUIComponentProps<"span", { open: boolean }>) {
  const ctx = useOverlayContext();
  return useRenderElement("span", props, {
    state: { open: ctx.open },
    stateAttributesMapping: popupStateMapping,
    ref: props.ref,
    props: [{ "aria-hidden": true }, getElementProps(props)],
  });
}
export namespace Icon {
  export type Props = Parameters<typeof Icon>[0];
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
  const group = useContext(GroupContext),
    id = useBaseUiId(props.id);
  useIsoLayoutEffect(() => {
    group.setId(id);
    return () => group.setId(undefined);
  }, [id, group.setId]);
  return useRenderElement("div", props, { ref: props.ref, props: [{ id }, getElementProps(props)] });
}
export namespace GroupLabel {
  export type Props = Parameters<typeof GroupLabel>[0];
}
function ScrollArrow({ direction, ...props }: BaseUIComponentProps<"div", {}> & { direction: number }) {
  const ctx = useOverlayContext();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const stop = useStableCallback(() => clearInterval(timer.current));
  useEffect(() => stop, [stop]);
  useIsoLayoutEffect(() => {
    const popup = ctx.popupRef.current;
    if (!popup) return;
    const measure = () =>
      setVisible(direction < 0 ? popup.scrollTop > 0 : popup.scrollTop + popup.clientHeight < popup.scrollHeight - 1);
    measure();
    popup.addEventListener("scroll", measure);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(popup);
    return () => {
      popup.removeEventListener("scroll", measure);
      ro?.disconnect();
    };
  }, [ctx.popupRef.current, direction]);
  return useRenderElement("div", props, {
    enabled: visible,
    ref: props.ref,
    props: [
      {
        "aria-hidden": true,
        style: { position: "sticky" },
        onPointerEnter() {
          stop();
          timer.current = setInterval(() => ctx.popupRef.current?.scrollBy({ top: direction * 10 }), 30);
        },
        onPointerLeave: stop,
        onPointerDown(event: PointerEvent) {
          event.preventDefault();
          ctx.popupRef.current?.scrollBy({ top: direction * 40 });
        },
      },
      getElementProps(props),
    ],
  });
}
export function ScrollUpArrow(props: BaseUIComponentProps<"div", {}>) {
  return <ScrollArrow direction={-1} {...props} />;
}
export namespace ScrollUpArrow {
  export type Props = Parameters<typeof ScrollUpArrow>[0];
}
export function ScrollDownArrow(props: BaseUIComponentProps<"div", {}>) {
  return <ScrollArrow direction={1} {...props} />;
}
export namespace ScrollDownArrow {
  export type Props = Parameters<typeof ScrollDownArrow>[0];
}