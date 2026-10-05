import { createContext, type ComponentChildren, type Ref } from "preact";
import { useContext, useMemo, useRef, useState } from "preact/hooks";

import { useDirection } from "../direction-provider";
import {
  createChangeEventDetails,
  createGenericEventDetails,
  type BaseUIGenericEventDetails,
} from "../internals/createBaseUIEventDetails";
import { FieldPopupLifecycle } from "../internals/FieldPopupLifecycle";
import { FieldRootContext, fieldValidityMapping } from "../internals/FieldRootContext";
import { FieldsetRootContext } from "../internals/FieldsetRootContext";
import { getElementProps } from "../internals/popups/getElementProps";
import {
  useOverlayContext,
  popupStateMapping,
  type OverlayChangeDetails,
  type OverlayRootProps,
} from "../internals/popups/OverlayContext";
import {
  OverlayPortal,
  OverlayPositioner,
  OverlayPopup,
  usePositionContext,
} from "../internals/popups/OverlayParts";
import { OverlayRoot } from "../internals/popups/OverlayRoot";
import { stringifyAsValue } from "../internals/resolveValueLabel";
import type { BaseUIComponentProps, NativeButtonProps } from "../internals/types";
import { useButton } from "../internals/useButton";
import { useControlled } from "../internals/useControlled";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { usePopupTabExit } from "../internals/usePopupTabExit";
import { useRegisterFieldControl } from "../internals/useRegisterFieldControl";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
import { visuallyHidden } from "../internals/visuallyHidden";
import { mergeProps } from "../merge-props";
export { OverlayPortal as Portal, OverlayPositioner as Positioner };
export { Separator } from "../separator";

type ChangeDetails = OverlayChangeDetails;

type HighlightDetails = BaseUIGenericEventDetails<"keyboard" | "pointer" | "none">;

type Selected<V, M> = M extends true ? V[] : V;

interface RootProps<V = any, M extends boolean | undefined = false> extends Omit<
  OverlayRootProps,
  "children" | "handle" | "actionsRef"
> {
  children?: ComponentChildren;
  value?: Selected<V, M> | null;
  defaultValue?: Selected<V, M> | null;
  onValueChange?: (
    value: Selected<V, M> | (M extends true ? never : null),
    details: ChangeDetails,
  ) => void;
  multiple?: M;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (value: string, details: ChangeDetails) => void;
  onItemHighlighted?: (value: V | undefined, details: HighlightDetails) => void;
  autoHighlight?: boolean;
  highlightItemOnHover?: boolean;
  loopFocus?: boolean;
  openOnInputClick?: boolean;
  items?: readonly any[];
  filteredItems?: readonly any[];
  filter?: null | ((value: V, query: string, itemToString?: (value: V) => string) => boolean);
  itemToStringLabel?: (value: V) => string;
  itemToStringValue?: (value: V) => string;
  isItemEqualToValue?: (a: V, b: V) => boolean;
  limit?: number;
  locale?: Intl.LocalesArgument;
  inline?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  form?: string;
  id?: string;
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
  actionsRef?: { current: { unmount(): void } | null };
}

interface RegisteredItem {
  element: HTMLElement;
  value: any;
  label?: string;
  disabled: boolean;
}

interface ContextValue {
  trigger: { current: HTMLElement | null };
  value: any;
  multiple: boolean;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  id?: string;
  input: { current: HTMLElement | null };
  list: { current: HTMLElement | null };
  chips: { current: HTMLElement | null };
  direction: "ltr" | "rtl";
  pendingNavigation: { current: KeyboardEvent | null };
  resetInput(): void;
  query: string;
  inputValue: string;
  items: readonly any[];
  empty: boolean;
  equal(a: any, b: any): boolean;
  label(value: any): string;
  matches(value: any, label?: string): boolean;
  changeInput(
    value: string,
    event: Event,
    reason?: "input-change" | "item-press" | "clear-press",
  ): boolean;
  choose(
    value: any,
    event: Event,
    reason?: "item-press" | "clear-press" | "chip-remove-press",
  ): boolean;
  register(item: RegisteredItem): () => void;
  active: HTMLElement | null;
  highlight(
    element: HTMLElement | null,
    event: Event,
    reason: "keyboard" | "pointer" | "none",
  ): void;
  navigate(event: KeyboardEvent): void;
  autoHighlight: boolean;
  highlightItemOnHover: boolean;
  openOnInputClick: boolean;
}

const Context = createContext<ContextValue | null>(null);

function useCombobox() {
  const c = useContext(Context);

  if (!c) {
    throw new Error("Base UI: Combobox parts require Root.");
  }

  return c;
}

function labelOf(v: any) {
  return v == null ? "" : typeof v === "object" && "label" in v ? String(v.label) : String(v);
}

function flatten(items: readonly any[]): any[] {
  return items.flatMap((v) =>
    v && typeof v === "object" && Array.isArray(v.items) ? v.items : [v],
  );
}

export function Root<V = any, M extends boolean | undefined = false>({
  value: controlled,
  defaultValue,
  onValueChange,
  multiple = false as M,
  inputValue: controlledInput,
  defaultInputValue,
  onInputValueChange,
  onItemHighlighted,
  items = [],
  filteredItems,
  filter,
  itemToStringLabel = labelOf,
  itemToStringValue,
  isItemEqualToValue = Object.is,
  autoHighlight = false,
  highlightItemOnHover = true,
  loopFocus = true,
  openOnInputClick = true,
  disabled: disabledProp = false,
  readOnly = false,
  required = false,
  name: nameProp,
  form,
  id: idProp,
  autoComplete,
  inputRef,
  actionsRef,
  inline = false,
  limit = -1,
  locale,
  children,
  ...overlay
}: RootProps<V, M>) {
  const field = useContext(FieldRootContext);
  const fieldset = useContext(FieldsetRootContext);
  const disabled = field?.state.disabled || fieldset?.disabled || disabledProp;
  const name = field?.name ?? nameProp;
  const id = useBaseUiId(idProp);
  const direction = useDirection();
  const pendingNavigation = useRef<KeyboardEvent | null>(null);
  const [value, setValue] = useControlled<any>({
    controlled,
    default: defaultValue ?? (multiple ? [] : null),
    name: "Combobox",
  });
  const [inputValue, setInputValue] = useControlled({
    controlled: controlledInput,
    default: defaultInputValue ?? (multiple || value == null ? "" : itemToStringLabel(value)),
    name: "Combobox",
    state: "inputValue",
  });
  const [query, setQuery] = useState("");
  const [registered, setRegistered] = useState<RegisteredItem[]>([]);
  const [active, setActive] = useState<HTMLElement | null>(null);
  const input = useRef<HTMLElement | null>(null),
    list = useRef<HTMLElement | null>(null),
    chips = useRef<HTMLElement | null>(null);
  const hiddenInput = useRef<HTMLInputElement | null>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const label: (value: any) => string = (value) => (value == null ? "" : itemToStringLabel(value));

  const equal = isItemEqualToValue;
  const normalizedQuery = useMemo(
    () => (query ? query.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase(locale) : ""),
    [query, locale],
  );

  const matches = (v: any, text?: string) =>
    filteredItems !== undefined ||
    !query ||
    filter === null ||
    (filter
      ? filter(v, query, label)
      : (text ?? label(v))
          .normalize("NFKD")
          .replace(/\p{M}/gu, "")
          .toLocaleLowerCase(locale)
          .includes(normalizedQuery));

  const filtered = useMemo(() => {
    let filtered =
      filteredItems ??
      items.flatMap((v) => {
        if (v && typeof v === "object" && Array.isArray(v.items)) {
          const children = v.items.filter((i: any) => matches(i));
          return children.length ? [{ ...v, items: children }] : [];
        }

        return matches(v) ? [v] : [];
      });

    if (limit >= 0) {
      let remaining = limit;
      filtered = filtered.flatMap((item) => {
        if (remaining === 0) {
          return [];
        }

        if (item && typeof item === "object" && Array.isArray(item.items)) {
          const groupItems = item.items.slice(0, remaining);
          remaining -= groupItems.length;
          return [{ ...item, items: groupItems }];
        }

        remaining--;
        return [item];
      });
    }

    return filtered;
  }, [items, filteredItems, query, filter, itemToStringLabel, limit, locale]);
  const empty =
    items.length > 0 || filteredItems
      ? flatten(filtered).length === 0
      : !registered.some((i) => matches(i.value, i.label));
  const changeInput = useStableCallback(
    (
      next: string,
      event: Event,
      reason: "input-change" | "item-press" | "clear-press" = "input-change",
    ) => {
      const details = createChangeEventDetails(reason, event, undefined, {
        preventUnmountOnClose() {},
      });
      onInputValueChange?.(next, details);

      if (details.isCanceled) {
        return false;
      }

      setInputValue(next);

      setQuery(reason === "input-change" ? next : "");
      return true;
    },
  );
  const choose = useStableCallback(
    (
      v: any,
      event: Event,
      reason: "item-press" | "clear-press" | "chip-remove-press" = "item-press",
    ) => {
      if (disabled || readOnly) {
        return false;
      }

      const next = multiple
        ? v == null
          ? []
          : (value as any[]).some((x) => equal(x, v))
            ? (value as any[]).filter((x) => !equal(x, v))
            : [...value, v]
        : v;
      const details = createChangeEventDetails(reason, event, undefined, {
        preventUnmountOnClose() {},
      });
      onValueChange?.(next, details);

      if (details.isCanceled) {
        return false;
      }

      setValue(next);

      changeInput(
        multiple ? "" : label(v),
        event,
        reason === "clear-press" ? reason : "item-press",
      );
      return true;
    },
  );
  const register = useStableCallback((item: RegisteredItem) => {
    setRegistered((prev) => [...prev.filter((i) => i.element !== item.element), item]);
    return () => setRegistered((prev) => prev.filter((i) => i.element !== item.element));
  });
  const highlight = useStableCallback(
    (element: HTMLElement | null, event: Event, reason: "keyboard" | "pointer" | "none") => {
      if (element === active) {
        return;
      }

      setActive(element);

      onItemHighlighted?.(
        registered.find((i) => i.element === element)?.value,
        createGenericEventDetails(reason, event),
      );

      element?.scrollIntoView({ block: "nearest" });
    },
  );
  const navigate = useStableCallback((event: KeyboardEvent) => {
    if (event.isComposing) {
      return;
    }

    const options = list.current
      ? [
          ...list.current.querySelectorAll<HTMLElement>(
            "[role=option]:not([aria-disabled=true]):not([hidden])",
          ),
        ]
      : [];
    const index = options.indexOf(active!);

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? options.length - 1
            : index + (event.key === "ArrowDown" ? 1 : -1);
      highlight(
        next < 0
          ? loopFocus && index !== -1
            ? null
            : (options.at(-1) ?? null)
          : next >= options.length
            ? loopFocus
              ? null
              : (options.at(-1) ?? null)
            : (options[next] ?? null),
        event,
        "keyboard",
      );
    } else if (event.key === "Enter" && active) {
      event.preventDefault();

      active.click();
    }
  });
  useIsoLayoutEffect(() => {
    if (
      active &&
      (!active.isConnected ||
        active.hidden ||
        !matches(registered.find((i) => i.element === active)?.value))
    ) {
      setActive(null);
    }

    if (autoHighlight && query && list.current && !active) {
      highlight(
        list.current.querySelector<HTMLElement>(
          "[role=option]:not([hidden]):not([aria-disabled=true])",
        ),
        new Event("base-ui"),
        "none",
      );
    }
  }, [query, registered, autoHighlight]);

  useIsoLayoutEffect(() => {
    if (!multiple && controlled !== undefined) {
      setInputValue(label(controlled));
    }
  }, [controlled, multiple]);

  useIsoLayoutEffect(() => {
    const owner = hiddenInput.current?.form;

    if (!owner) {
      return;
    }

    const reset = (event: Event) =>
      setTimeout(() => {
        if (event.defaultPrevented) {
          return;
        }

        const next = defaultValue ?? (multiple ? [] : null);
        const details = createChangeEventDetails("none", event, undefined, {
          preventUnmountOnClose() {},
        });
        onValueChange?.(next as any, details);
        const restoredValue =
          controlled !== undefined ? controlled : details.isCanceled ? value : next;

        if (!details.isCanceled) {
          setValue(next);

          changeInput(
            defaultInputValue ?? (multiple ? "" : label(restoredValue)),
            event,
            "item-press",
          );
        }

        if (hiddenInput.current) {
          hiddenInput.current.value = serialize(multiple ? restoredValue?.[0] : restoredValue);
        }
      });

    owner.addEventListener("reset", reset);
    return () => owner.removeEventListener("reset", reset);
  }, [
    form,
    defaultValue,
    defaultInputValue,
    controlled,
    value,
    multiple,
    onValueChange,
    setValue,
    changeInput,
    itemToStringValue,
  ]);

  const serialize = (v: any) => stringifyAsValue(v, itemToStringValue);

  const serialized = multiple ? (value as any[]).map(serialize) : [serialize(value)];
  useRegisterFieldControl({
    inputRef: hiddenInput,
    controlRef: input,
    id,
    name: nameProp,
    disabled,
    value,
    getFormValue: () => (multiple ? serialized : (serialized[0] ?? "")),
    focus: () =>
      (input.current && input.current.isConnected ? input.current : trigger.current)?.focus(),
    isEqual: (next, initial) =>
      Object.is(next, initial) ||
      (next != null &&
        initial != null &&
        (Array.isArray(next) && Array.isArray(initial)
          ? next.length === initial.length &&
            next.every(
              (entry, index) => Object.is(entry, initial[index]) || equal(entry, initial[index]),
            )
          : equal(next as V, initial as V))),
  });
  const previous = useRef(value);
  useIsoLayoutEffect(() => {
    if (previous.current === value) {
      return;
    }

    previous.current = value;
    hiddenInput.current?.dispatchEvent(new Event("input", { bubbles: true }));

    hiddenInput.current?.dispatchEvent(new Event("change", { bubbles: true }));
  }, [value]);
  const context: ContextValue = {
    value,
    multiple: !!multiple,
    disabled,
    readOnly,
    required,
    id,
    input,
    trigger,
    list,
    chips,
    direction,
    pendingNavigation,
    resetInput: () => setInputValue(multiple ? "" : label(value)),
    query,
    inputValue,
    items: filtered,
    empty,
    equal,
    label,
    matches,
    changeInput,
    choose,
    register,
    active,
    highlight,
    navigate,
    autoHighlight,
    highlightItemOnHover,
    openOnInputClick,
  };
  return (
    <Context.Provider value={context}>
      <OverlayRoot
        kind="combobox"
        disabled={disabled}
        actionsRef={actionsRef as any}
        {...overlay}
        onOpenChange={(open, details) => {
          overlay.onOpenChange?.(open, details);

          if (!details.isCanceled && !open) {
            setQuery("");

            setActive(null);
          }
        }}
      >
        <Lifecycle inline={inline} />
        <FieldPopupLifecycle />
        {children}
        <input
          ref={(node) => {
            hiddenInput.current = node;

            if (typeof inputRef === "function") {
              inputRef(node);
            } else if (inputRef) {
              inputRef.current = node;
            }
          }}
          type="text"
          tabIndex={-1}
          aria-hidden="true"
          style={visuallyHidden}
          name={multiple ? undefined : name}
          form={form}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          value={serialized[0] ?? ""}
          onFocus={() => input.current?.focus()}
          readOnly={readOnly}
        />
        {multiple &&
          name &&
          serialized.map((v: string, i: number) => (
            <input key={i} type="hidden" name={name} form={form} disabled={disabled} value={v} />
          ))}
      </OverlayRoot>
    </Context.Provider>
  );
}

export namespace Root {
  export type Props<V = any, M extends boolean | undefined = false> = RootProps<V, M>;

  export type ChangeEventDetails = ChangeDetails;
}

function Lifecycle({ inline }: { inline: boolean }) {
  const c = useCombobox(),
    overlay = useOverlayContext();
  const previousOpen = useRef(overlay.open);
  useIsoLayoutEffect(() => {
    if (previousOpen.current && !overlay.open) {
      c.resetInput();
    }

    previousOpen.current = overlay.open;

    if (overlay.open && c.pendingNavigation.current) {
      const event = c.pendingNavigation.current;
      c.pendingNavigation.current = null;
      queueMicrotask(() => {
        if (overlay.popupRef.current?.isConnected) {
          c.navigate(event);
        }
      });
    }

    if (overlay.open && inline && c.input.current) {
      overlay.setReference(c.input.current);
    }
  }, [inline, overlay.open]);
  return null;
}

const PopupContext = createContext(false);

interface InputState {
  open: boolean;
  popupSide: string | null;
  listEmpty: boolean;
  disabled: boolean;
  readOnly: boolean;
  valid: boolean | null;
  touched: boolean;
  dirty: boolean;
  filled: boolean;
  focused: boolean;
}

export function Input({
  disabled: ownDisabled = false,
  ...props
}: BaseUIComponentProps<"input", InputState> & { disabled?: boolean }) {
  const field = useContext(FieldRootContext);
  const c = useCombobox(),
    overlay = useOverlayContext();
  const inside = useRef(false);
  const inputInsidePopup = useContext(PopupContext);
  const setInputElement = useStableCallback((node: HTMLElement | null) => {
    inside.current = inputInsidePopup;

    if (node && !inside.current && !c.chips.current) {
      overlay.setReference(node);
    }
  });
  const id = useBaseUiId(props.id ?? c.id);
  const disabled = c.disabled || ownDisabled;
  const state: InputState = {
    open: overlay.open,
    popupSide: null,
    listEmpty: c.empty,
    disabled,
    readOnly: c.readOnly,
    valid: field?.state.valid ?? null,
    touched: field?.state.touched ?? false,
    dirty: field?.state.dirty ?? false,
    filled: field?.state.filled ?? false,
    focused: field?.state.focused ?? false,
  };
  const tabExit = usePopupTabExit(
    () => (inside.current ? overlay.reference : c.input.current),
    (event) => !overlay.change(false, event, "focus-out").isCanceled,
  );
  const external = getElementProps(props);
  const onChange = external.onChange;
  delete external.onChange;
  const element = useRenderElement("input", props, {
    state,
    ref: [props.ref ?? null, c.input, setInputElement],
    stateAttributesMapping: {
      ...popupStateMapping,
      valid: fieldValidityMapping.valid,
      popupSide: () => null,
      listEmpty: (empty) => (empty ? { "data-list-empty": "" } : null),
    },
    props: [
      {
        id,
        disabled,
        readOnly: c.readOnly,
        role: "combobox",
        autoComplete: "off",
        "aria-autocomplete": "list",
        "aria-expanded": overlay.open,
        "aria-controls": overlay.mounted ? `${overlay.id}-list` : undefined,
        "aria-activedescendant": c.active?.id || undefined,
        "aria-required": c.required || undefined,
        "aria-labelledby": field?.labelId,
        "aria-describedby": field?.messages.join(" ") || undefined,
        "aria-invalid": (field?.state.valid === false && !disabled) || undefined,
        onFocus() {
          field?.focus(true);
        },
        value: c.inputValue,
        onInput(event: Event) {
          if (disabled || c.readOnly) {
            return;
          }

          if (c.changeInput((event.currentTarget as HTMLInputElement).value, event)) {
            overlay.change(true, event, "input-change");
          } else {
            (event.currentTarget as HTMLInputElement).value = c.inputValue;
          }
        },
        onClick(event: MouseEvent) {
          if (!disabled && !c.readOnly && c.openOnInputClick) {
            overlay.change(true, event, "input-press");
          }
        },
        onKeyDown(event: KeyboardEvent) {
          if (disabled || c.readOnly || event.isComposing) {
            return;
          }

          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            if (!overlay.open) {
              event.preventDefault();
              c.pendingNavigation.current = event;

              if (overlay.change(true, event, "list-navigation").isCanceled) {
                c.pendingNavigation.current = null;
              }
            } else {
              c.navigate(event);
            }
          } else if (overlay.open) {
            c.navigate(event);

            tabExit(event);
          }

          if (c.multiple && !c.inputValue && event.key === "Backspace") {
            const last = c.value.at(-1);

            if (last !== undefined) {
              c.choose(last, event, "chip-remove-press");
            }
          }

          if (
            c.multiple &&
            !c.inputValue &&
            event.key === (c.direction === "rtl" ? "ArrowRight" : "ArrowLeft")
          ) {
            c.chips.current
              ?.querySelectorAll<HTMLElement>("[data-combobox-chip]")
              .item(c.value.length - 1)
              ?.focus();
          }
        },
        onBlur(event: FocusEvent) {
          if (!overlay.open) {
            field?.focus(false);
          }

          if (!overlay.open && !c.multiple) {
            c.changeInput(c.label(c.value), event, "item-press");
          }
        },
      },
      mergeProps({ onInput: onChange }, external),
    ],
  });
  // The rendered Input must not register its query as another Field control.
  return <FieldRootContext.Provider value={null}>{element}</FieldRootContext.Provider>;
}

export namespace Input {
  export type Props = Parameters<typeof Input>[0];
}

export function Trigger({
  nativeButton = true,
  disabled: ownDisabled = false,
  ...props
}: BaseUIComponentProps<"button", Omit<InputState, "readOnly"> & { placeholder: boolean }> &
  NativeButtonProps) {
  const field = useContext(FieldRootContext);
  const c = useCombobox(),
    overlay = useOverlayContext();
  const element = useRef<HTMLElement | null>(null);
  const disabled = c.disabled || ownDisabled;
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  return useRenderElement("button", props, {
    state: {
      open: overlay.open,
      disabled,
      popupSide: null,
      listEmpty: c.empty,
      placeholder: c.multiple ? !c.value.length : c.value == null,
      valid: field?.state.valid ?? null,
      touched: field?.state.touched ?? false,
      dirty: field?.state.dirty ?? false,
      filled: field?.state.filled ?? false,
      focused: field?.state.focused ?? false,
    },
    stateAttributesMapping: {
      ...popupStateMapping,
      valid: fieldValidityMapping.valid,
      popupSide: () => null,
      listEmpty: (empty) => (empty ? { "data-list-empty": "" } : null),
    },
    ref: [
      props.ref ?? null,
      element,
      buttonRef,
      c.trigger,
      (node: HTMLElement | null) => {
        if (node && !c.input.current && !c.chips.current) {
          overlay.setReference(node);
        }
      },
    ],
    props: [
      getButtonProps({
        "aria-labelledby": field?.labelId,
        "aria-describedby": field?.messages.join(" ") || undefined,
        "aria-invalid": (field?.state.valid === false && !disabled) || undefined,
        onFocus() {
          field?.focus(true);
        },
        onBlur() {
          if (!overlay.open) {
            field?.focus(false);
          }
        },
        tabIndex: c.input.current && !overlay.popupRef.current?.contains(c.input.current) ? -1 : 0,
        "aria-haspopup": "listbox",
        "aria-expanded": overlay.open,
        "aria-controls": overlay.mounted ? `${overlay.id}-list` : undefined,
        onMouseDown(event: MouseEvent) {
          if (c.input.current && !overlay.popupRef.current?.contains(c.input.current)) {
            event.preventDefault();
          }
        },
        onClick(event: MouseEvent) {
          if (c.readOnly || disabled) {
            return;
          }

          overlay.change(!overlay.open, event, "trigger-press");

          if (c.input.current && !overlay.popupRef.current?.contains(c.input.current)) {
            c.input.current.focus();
          }
        },
        onKeyDown(event: KeyboardEvent) {
          if (c.readOnly || disabled || event.isComposing) {
            return;
          }

          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();

            overlay.change(true, event, "list-navigation");
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

interface PopupState {
  open: boolean;
  side: string;
  align: string;
  anchorHidden: boolean;
  transitionStatus: ReturnType<typeof useOverlayContext>["transitionStatus"];
  empty: boolean;
}

type PopupProps = Omit<OverlayPopup.Props, "className" | "style" | "render"> &
  BaseUIComponentProps<"div", PopupState>;

export function Popup(props: PopupProps) {
  const c = useCombobox(),
    overlay = useOverlayContext(),
    position = usePositionContext();
  const state: PopupState = {
    open: overlay.open,
    side: position?.side ?? "bottom",
    align: position?.align ?? "start",
    anchorHidden: position?.anchorHidden ?? false,
    transitionStatus: overlay.transitionStatus,
    empty: c.empty,
  };
  const render = props.render;
  return (
    <PopupContext.Provider value={true}>
      <OverlayPopup
        {...(props as OverlayPopup.Props)}
        className={typeof props.className === "function" ? props.className(state) : props.className}
        style={typeof props.style === "function" ? props.style(state) : props.style}
        render={
          typeof render === "function" ? (elementProps) => render(elementProps, state) : render
        }
        data-empty={c.empty ? "" : undefined}
        data-anchor-hidden={state.anchorHidden ? "" : undefined}
        role={undefined}
        aria-modal={undefined}
        initialFocus={props.initialFocus ?? (() => c.input.current ?? overlay.popupRef.current)}
        finalFocus={props.finalFocus ?? (() => overlay.reference)}
      />
    </PopupContext.Provider>
  );
}

export namespace Popup {
  export type Props = PopupProps;

  export type State = PopupState;
}

export function List({
  children,
  ...props
}: Omit<BaseUIComponentProps<"div", { empty: boolean }>, "children"> & {
  children?: ComponentChildren | ((item: any, index: number) => ComponentChildren);
}) {
  const c = useCombobox(),
    overlay = useOverlayContext();
  return useRenderElement("div", props, {
    state: { empty: c.empty },
    ref: [props.ref ?? null, c.list],
    props: [
      {
        id: `${overlay.id}-list`,
        role: "listbox",
        "aria-multiselectable": c.multiple || undefined,
        children:
          typeof children === "function"
            ? c.items.map(children as (item: any, index: number) => ComponentChildren)
            : children,
      },
      getElementProps(props),
    ],
  });
}

export namespace List {
  export type Props = Parameters<typeof List>[0];
}
const GroupItems = createContext<readonly any[] | null>(null);

export function Collection({
  children,
}: {
  children: (item: any, index: number) => ComponentChildren;
  "data-slot"?: string;
}) {
  const c = useCombobox(),
    items = useContext(GroupItems);
  return <>{(items ?? c.items).map(children)}</>;
}

export namespace Collection {
  export type Props = Parameters<typeof Collection>[0];
}
const ItemContext = createContext({ selected: false, disabled: false, highlighted: false });

export function Item({
  value,
  disabled: ownDisabled = false,
  label,
  ...props
}: BaseUIComponentProps<"div", { selected: boolean; disabled: boolean; highlighted: boolean }> & {
  value?: any;
  disabled?: boolean;
  label?: string;
}) {
  const c = useCombobox(),
    overlay = useOverlayContext(),
    element = useRef<HTMLElement | null>(null);
  const id = useBaseUiId(props.id),
    disabled = c.disabled || ownDisabled;
  const selected = c.multiple
    ? c.value.some((v: any) => c.equal(v, value))
    : c.equal(c.value, value);
  const state = {
    selected,
    disabled,
    highlighted: c.active === element.current && !!element.current,
  };
  useIsoLayoutEffect(() => {
    if (!element.current) {
      return;
    }

    return c.register({ element: element.current, value, label, disabled });
  }, [value, label, disabled, c.register]);
  const node = useRenderElement("div", props, {
    state,
    ref: [props.ref ?? null, element],
    props: [
      {
        id,
        role: "option",
        "aria-selected": selected,
        "aria-disabled": disabled || undefined,
        tabIndex: -1,
        hidden: !c.matches(value, label),
        onPointerMove(event: PointerEvent) {
          if (!disabled && c.highlightItemOnHover && event.pointerType !== "touch") {
            c.highlight(element.current, event, "pointer");
          }
        },
        onPointerLeave(event: PointerEvent) {
          if (!c.autoHighlight) {
            c.highlight(null, event, "pointer");
          }
        },
        onMouseDown(event: MouseEvent) {
          event.preventDefault();
        },
        onClick(event: MouseEvent) {
          if (!disabled && c.choose(value, event)) {
            if (!c.multiple) {
              overlay.change(false, event, "item-press");
            }

            c.input.current?.focus();
          }
        },
      },
      getElementProps(props),
    ],
  });
  return <ItemContext.Provider value={state}>{node}</ItemContext.Provider>;
}

export namespace Item {
  export type Props = Parameters<typeof Item>[0];
}

export function ItemIndicator({
  keepMounted = false,
  ...props
}: BaseUIComponentProps<"span", { selected: boolean; disabled: boolean; highlighted: boolean }> & {
  keepMounted?: boolean;
}) {
  const state = useContext(ItemContext);
  return useRenderElement("span", props, {
    state,
    enabled: state.selected || keepMounted,
    ref: props.ref,
    props: [{ "aria-hidden": true, hidden: !state.selected }, getElementProps(props)],
  });
}

export namespace ItemIndicator {
  export type Props = Parameters<typeof ItemIndicator>[0];
}
const GroupContext = createContext<{ id?: string; setId(id: string | undefined): void }>({
  setId() {},
});

export function Group({
  items,
  ...props
}: BaseUIComponentProps<"div", {}> & { items?: readonly any[] }) {
  const [id, setId] = useState<string>();
  const node = useRenderElement("div", props, {
    ref: props.ref,
    props: [{ role: "group", "aria-labelledby": id }, getElementProps(props)],
  });
  return (
    <GroupContext.Provider value={{ id, setId }}>
      <GroupItems.Provider value={items ?? null}>{node}</GroupItems.Provider>
    </GroupContext.Provider>
  );
}

export namespace Group {
  export type Props = Parameters<typeof Group>[0];
}

export function GroupLabel(props: BaseUIComponentProps<"div", {}>) {
  const c = useContext(GroupContext),
    id = useBaseUiId(props.id);
  useIsoLayoutEffect(() => {
    c.setId(id);
    return () => c.setId(undefined);
  }, [id, c.setId]);
  return useRenderElement("div", props, {
    ref: props.ref,
    props: [{ id }, getElementProps(props)],
  });
}

export namespace GroupLabel {
  export type Props = Parameters<typeof GroupLabel>[0];
}

export function Empty(props: BaseUIComponentProps<"div", { empty: boolean }>) {
  const c = useCombobox();
  return useRenderElement("div", props, {
    enabled: c.empty,
    state: { empty: c.empty },
    ref: props.ref,
    props: [{ role: "status" }, getElementProps(props)],
  });
}

export namespace Empty {
  export type Props = Parameters<typeof Empty>[0];
}

export function Value({
  children,
  placeholder,
}: {
  children?: ComponentChildren | ((value: any) => ComponentChildren);
  placeholder?: ComponentChildren;
  "data-slot"?: string;
}) {
  const c = useCombobox();
  return (
    <>
      {typeof children === "function"
        ? children(c.value)
        : (children ??
          (c.value == null || (c.multiple && !c.value.length)
            ? placeholder
            : c.multiple
              ? c.value.map(c.label).join(", ")
              : c.label(c.value)))}
    </>
  );
}

export namespace Value {
  export type Props = Parameters<typeof Value>[0];
}

export function Clear({
  nativeButton = true,
  disabled: ownDisabled = false,
  ...props
}: BaseUIComponentProps<"button", { disabled: boolean }> & NativeButtonProps) {
  const c = useCombobox(),
    disabled = ownDisabled || c.disabled || c.readOnly;
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  return useRenderElement("button", props, {
    enabled: c.multiple ? c.value.length > 0 : c.value != null || !!c.inputValue,
    state: { disabled },
    ref: [props.ref ?? null, buttonRef],
    props: [
      getButtonProps({
        tabIndex: -1,
        "aria-label": "Clear selection",
        onMouseDown(event: MouseEvent) {
          event.preventDefault();
        },
        onClick(event: MouseEvent) {
          if (c.choose(null, event, "clear-press")) {
            c.input.current?.focus();
          }
        },
      }),
      getElementProps(props),
    ],
  });
}

export namespace Clear {
  export type Props = Parameters<typeof Clear>[0];
}

export function Chips(props: BaseUIComponentProps<"div", { disabled: boolean }>) {
  const c = useCombobox(),
    overlay = useOverlayContext();
  return useRenderElement("div", props, {
    state: { disabled: c.disabled },
    ref: [props.ref ?? null, c.chips, overlay.setReference],
    props: getElementProps(props),
  });
}

export namespace Chips {
  export type Props = Parameters<typeof Chips>[0];
}
const ChipContext = createContext<any>(null);

export function Chip(props: BaseUIComponentProps<"div", { disabled: boolean }>) {
  const c = useCombobox(),
    element = useRef<HTMLElement | null>(null);
  const [index, setIndex] = useState(0);
  useIsoLayoutEffect(() => {
    if (!element.current || !c.chips.current) {
      return;
    }

    setIndex(
      [...c.chips.current.querySelectorAll<HTMLElement>("[data-combobox-chip]")].indexOf(
        element.current,
      ),
    );
  });
  const value = c.value[index];
  const node = useRenderElement("div", props, {
    state: { disabled: c.disabled },
    ref: [props.ref ?? null, element],
    props: [
      {
        "data-combobox-chip": "",
        tabIndex: c.disabled ? undefined : -1,
        onKeyDown(event: KeyboardEvent) {
          if (c.disabled || c.readOnly) {
            return;
          }

          const nodes = c.chips.current
            ? [...c.chips.current.querySelectorAll<HTMLElement>("[data-combobox-chip]")]
            : [];
          const index = nodes.indexOf(element.current!);

          if (event.key === "Backspace" || event.key === "Delete") {
            event.preventDefault();

            if (c.choose(value, event, "chip-remove-press")) {
              (nodes[index - 1] ?? c.input.current)?.focus();
            }
          } else if (["ArrowLeft", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            const rtl =
              element.current?.ownerDocument.defaultView?.getComputedStyle(element.current)
                .direction === "rtl";
            const step = (event.key === "ArrowLeft" ? -1 : 1) * (rtl ? -1 : 1);
            (nodes[index + step] ?? c.input.current)?.focus();
          }
        },
      },
      getElementProps(props),
    ],
  });
  return <ChipContext.Provider value={value}>{node}</ChipContext.Provider>;
}

export namespace Chip {
  export type Props = Parameters<typeof Chip>[0];
}

export function ChipRemove({
  nativeButton = true,
  disabled: ownDisabled = false,
  ...props
}: BaseUIComponentProps<"button", { disabled: boolean }> & NativeButtonProps) {
  const c = useCombobox(),
    value = useContext(ChipContext),
    disabled = ownDisabled || c.disabled || c.readOnly;
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  return useRenderElement("button", props, {
    state: { disabled },
    ref: [props.ref ?? null, buttonRef],
    props: [
      getButtonProps({
        tabIndex: -1,
        "aria-label": `Remove ${c.label(value)}`,
        onMouseDown(event: MouseEvent) {
          event.preventDefault();
        },
        onClick(event: MouseEvent) {
          if (c.choose(value, event, "chip-remove-press")) {
            c.input.current?.focus();
          }
        },
      }),
      getElementProps(props),
    ],
  });
}

export namespace ChipRemove {
  export type Props = Parameters<typeof ChipRemove>[0];
}
