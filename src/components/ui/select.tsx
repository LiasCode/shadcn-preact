import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Check, ChevronDown } from "lucide-preact";
import { type ButtonHTMLAttributes, type CSSProperties, type VNode, toChildArray } from "preact";
import {
  type HTMLAttributes,
  type MutableRefObject,
  type PropsWithChildren,
  createContext,
  forwardRef,
  useEffect,
  useState,
} from "preact/compat";
import { useCallback, useContext, useMemo } from "preact/hooks";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { debounce } from "./share/debounce";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

export type Direction = "ltr" | "rtl";

export const OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
export const SELECTION_KEYS = [" ", "Enter"];

export type SelectContextT = {
  openSelect: () => void;

  closeSelect: () => void;

  ref: {
    reference: MutableRefObject<HTMLButtonElement | null>;
    floating: React.MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLButtonElement | null) => void;
    setFloating: (node: HTMLElement | null) => void;
  };

  floatingStyles: CSSProperties;

  value: string;

  nodeForTheSelectedValue: VNode<any> | string;

  nodeForTheSelectedValueChange(node: VNode<any> | string): void;

  defaultValue?: string;

  onValueChange(value: string): void;

  open: boolean;

  dir?: Direction;

  name?: string;

  disabled?: boolean;

  required?: boolean;
};

export const SelectContext = createContext<SelectContextT | null>(null);

export type SelectProps = PropsWithChildren & {
  delay?: number;

  alignOffset?: number;

  value?: string;

  defaultValue?: string;

  onValueChange?(value: string): void;

  open?: boolean;

  defaultOpen?: boolean;

  onOpenChange?(open: boolean): void;

  dir?: Direction;

  name?: string;

  disabled?: boolean;

  required?: boolean;

  autoComplete?: string;

  form?: string;

  side?: "top" | "right" | "bottom" | "left";

  alignment?: "start" | "end";
};

export function Select({
  children,
  open: controlledOpen,
  defaultValue,
  value: controlledValue,
  onOpenChange,
  ...props
}: SelectProps) {
  const [isSelectOpen, setIsSelectOpen] = useControlledState({
    defaultValue: Boolean(props.defaultOpen),
    controlledValue: controlledOpen,
    onChange: onOpenChange,
  });
  const [value, setValue] = useControlledState({
    defaultValue: defaultValue ?? "",
    controlledValue: controlledValue,
    onChange: props.onValueChange,
  });
  const [nodeForTheSelectedValue, setNodeForTheSelectedValue] = useState<SelectContextT["nodeForTheSelectedValue"]>("");

  const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
    open: isSelectOpen,
    strategy: "fixed",
    middleware: [
      autoPlacement({
        allowedPlacements: props.side
          ? props.alignment
            ? [`${props.side}-end`, `${props.side}-start`, props.side]
            : [props.side]
          : ["bottom", "top"],
        alignment: props.alignment,
      }),
      shift(),
      offset(props.alignOffset || 4),
    ],
    whileElementsMounted: autoUpdate,
    transform: false,
  });

  const openSelect = useCallback(() => setIsSelectOpen(true), []);

  const closeSelect = useCallback(() => {
    setIsSelectOpen(false);
    setTimeout(() => {
      refs.reference.current?.focus();
      // 35ms is based on a 30hz refresh rate, which is the minimum rate for
      // a smooth user experience.
    }, 35);
  }, [refs.reference.current]);

  return (
    <SelectContext.Provider
      value={{
        open: isSelectOpen,
        ref: refs,
        floatingStyles,
        defaultValue: defaultValue,
        dir: props.dir,
        disabled: props.disabled,
        name: props.name,
        required: props.required,
        nodeForTheSelectedValue: nodeForTheSelectedValue,
        nodeForTheSelectedValueChange: (v) => setNodeForTheSelectedValue(v),
        value,
        onValueChange: (v) => setValue(v),
        closeSelect,
        openSelect,
      }}
    >
      {children}

      <select
        name={props.name}
        form={props.form}
        disabled={props.disabled}
        required={props.required}
        autoComplete={props.autoComplete}
        defaultValue={defaultValue}
        tabIndex={-1}
        value={value}
        className="-top-[99999px] pointer-events-none fixed h-1 w-1 cursor-none"
      >
        <option value={value}>{value}</option>
      </select>
    </SelectContext.Provider>
  );
}

export function useSelect() {
  const c = useContext(SelectContext);
  if (!c) throw new Error("useSelect should be used within SelectProvider");
  return c;
}

// Select Trigger
export type SelectTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, class: classNative, ...props }) => {
    const { ref, openSelect, open, disabled, value } = useSelect();
    const [isFocused, setIsFocused] = useState(false);

    const showPlaceholder = useMemo(() => Boolean(value), [value]);

    const openDebounced = debounce(() => {
      if (!disabled) {
        openSelect();
        ref.reference.current?.blur();
      }
    }, 50);

    const focusHandle = (e: KeyboardEvent) => {
      if (OPEN_KEYS.includes(e.key)) {
        openSelect();
        setIsFocused(false);
        ref.reference.current?.blur();
      }
    };

    useEffect(() => {
      switch (isFocused) {
        case true:
          document.addEventListener("keydown", focusHandle);
          break;
        case false:
          document.removeEventListener("keydown", focusHandle);
          break;
      }

      return () => {
        document.removeEventListener("keydown", focusHandle);
      };
    }, [isFocused]);

    const Comp = props.asChild ? Slot : "button";

    return (
      // TODO: FIX focus does not work with Label
      <Comp
        ref={ref.setReference}
        onClick={openDebounced}
        onFocus={() => setIsFocused(true)}
        onFocusOut={() => setIsFocused(false)}
        onBlur={() => setIsFocused(false)}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled}
        data-placeholder={showPlaceholder}
        className={cn(
          "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder=false]:text-muted-foreground [&>span]:line-clamp-1",
          className,
          classNative
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Comp>
    );
  }
);

// Select Value
export type SelectValueProps = HTMLAttributes<HTMLSpanElement> & {
  asChild?: boolean;
  placeholder: VNode<any> | string;
};

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, class: classNative, ...props }: SelectValueProps, forwardedRef) => {
    const { value, nodeForTheSelectedValue } = useSelect();
    const Comp = props.asChild ? Slot : "span";

    return (
      <Comp
        ref={forwardedRef}
        className={cn(className, classNative)}
        {...props}
      >
        {value && nodeForTheSelectedValue ? nodeForTheSelectedValue : props.placeholder}
      </Comp>
    );
  }
);

// Select Content
export type SelectContentProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, class: classNative, ...props }) => {
    const { open: isOpen, ref, floatingStyles, closeSelect, nodeForTheSelectedValueChange, value } = useSelect();

    const triggerWidth = useMemo(() => {
      return ref.reference.current?.getBoundingClientRect().width || 0;
    }, [ref.reference.current]);

    const maxHeight = useMemo(() => {
      if (isOpen === false) return 0;

      const window_height = window.innerHeight;

      const trigger_height = ref.reference.current?.getBoundingClientRect().height || 24;

      const top = ref.reference.current?.getBoundingClientRect().top || 0;

      const bottom = window_height - top + trigger_height - 16;

      const result = top > bottom ? top - 8 : bottom - trigger_height - 32;

      return result;
    }, [ref.reference.current, isOpen]);

    useEffect(() => {
      if (!isOpen) return;

      // Autofocus the SelectItem with the current value or the first one
      if (!value) {
        ref.floating.current?.querySelector<HTMLOptionElement>("[role=option]")?.focus();
      } else {
        ref.floating.current?.querySelector<HTMLOptionElement>(`[role=option][data-option-value="${value}"]`)?.focus();
      }
    }, [isOpen, ref.floating.current]);

    // This is for fix initial render value to capture the correctly `nodeForTheSelectedValue`
    useEffect(() => {
      const search_value = value;

      if (!search_value) return;

      const childrensArray = toChildArray(children);

      let target: VNode<any> | null = null;

      try {
        for (const child of childrensArray) {
          if (typeof child === "string") continue;
          if (typeof child === "number") continue;
          if (!child.props.children) continue;

          if ("value" in child.props) {
            //@ts-expect-error
            if (child.type?.displayName === "SelectItem" && child.props.value === search_value) {
              target = child;
              break;
            }
          }

          target = findNodeOptionByValue(child, search_value);
          if (target) break;
        }
      } catch (error) {
        console.error("Error while finding node option by value:", error);
        console.warn("Make sure that the SelectItem component is used correctly.");
      }

      if (!target) return;

      nodeForTheSelectedValueChange(target?.props?.children || "");
    }, [value]);

    return (
      <Show when={isOpen}>
        <Modal
          onClose={closeSelect}
          className="bg-transparent"
        >
          <div
            ref={ref.setFloating}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              ...floatingStyles,
              minWidth: `${triggerWidth}px`,
              maxHeight: `${maxHeight}px`,
            }}
            data-state={isOpen ? "open" : "closed"}
            className={cn(
              "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 flex h-fit flex-col overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
              className,
              classNative
            )}
            {...props}
          >
            {children}
          </div>
        </Modal>
      </Show>
    );
  }
);

// Select Group
export type SelectGroupProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    // biome-ignore lint/a11y/useSemanticElements: <>
    <div
      ref={forwardedRef}
      role="group"
      className={cn("mb-1", className, classNative)}
      {...props}
    />
  )
);
SelectGroup.displayName = "SelectGroup";

// Select Label
export type SelectLabelProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      tabindex={-1}
      className={cn("px-2 py-1.5 font-semibold text-sm", className, classNative)}
      {...props}
    />
  )
);
SelectLabel.displayName = "SelectLabel";

// Select Item
export type SelectItemProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
  textValue?: string;
};

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value: itemValue, className, class: classNative, children, ...props }, forwardedRef) => {
    const { value, onValueChange, closeSelect, ref: refs } = useSelect();
    const [isFocused, setIsFocused] = useState(false);

    const isSelected = useMemo(() => value === itemValue, [value, itemValue]);

    const selectItemHandler = useCallback(() => {
      if (props.disabled) return;
      onValueChange(itemValue);
      closeSelect();
    }, [props.disabled]);

    const focusKeydownHandle = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (SELECTION_KEYS.includes(e.key)) {
        selectItemHandler();
        return;
      }

      if (e.key === "ArrowDown") {
        const optionsElements = refs.floating.current?.querySelectorAll<HTMLOptionElement>("[role=option]");
        if (!optionsElements) return;

        let current: HTMLOptionElement | null = null;
        let next: HTMLOptionElement | null = null;

        for (const option of optionsElements.values()) {
          if (current !== null) {
            next = option;
            break;
          }
          if (option.getAttribute("data-option-value") === itemValue) {
            current = option;
          }
        }

        if (!next) return;

        next.focus();
      }

      if (e.key === "ArrowUp") {
        const optionsElements = refs.floating.current?.querySelectorAll<HTMLOptionElement>("[role=option]");
        if (!optionsElements) return;

        let previous: HTMLOptionElement | null = null;

        for (const option of optionsElements.values()) {
          const dataOptionValue = option.getAttribute("data-option-value");

          if (dataOptionValue !== itemValue) {
            previous = option;
          } else if (dataOptionValue === itemValue) {
            break;
          }
        }

        if (!previous) return;

        previous.focus();
      }
    };

    const removeOtherOptionsFocus = () => {
      const optionsElements = refs.floating.current?.querySelectorAll<HTMLOptionElement>("[role=option]");
      if (!optionsElements) return;

      for (const option of optionsElements.values()) {
        if (option.getAttribute("data-option-value") === itemValue) continue;
        option.blur();
      }
    };

    useEffect(() => {
      switch (isFocused) {
        case true:
          document.addEventListener("keydown", focusKeydownHandle);
          break;
        case false:
          document.removeEventListener("keydown", focusKeydownHandle);
          break;
      }

      return () => {
        document.removeEventListener("keydown", focusKeydownHandle);
      };
    }, [isFocused]);

    return (
      <div
        ref={forwardedRef}
        role="option"
        onClick={() => {
          selectItemHandler();
        }}
        onFocus={() => {
          removeOtherOptionsFocus();
          setIsFocused(true);
        }}
        onMouseEnter={() => {
          removeOtherOptionsFocus();
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        onMouseLeave={() => {
          setIsFocused(false);
        }}
        tabIndex={0}
        aria-selected={isSelected}
        data-state={isSelected ? "checked" : "unchecked"}
        data-disabled={props.disabled}
        data-option-value={itemValue}
        className={cn(
          "relative flex w-full cursor-default select-none items-center justify-between rounded-sm py-1.5 pr-2 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          isFocused && "bg-accent",
          className,
          classNative
        )}
        {...props}
      >
        {children}
        <Show when={isSelected}>
          <Check className="h-4 w-4" />
        </Show>
      </div>
    );
  }
);
// If this name changes, the `findNodeOptionByValue` function will not work and will break the select
// or maybe the entire app. Must be always "SelectItem"
SelectItem.displayName = "SelectItem";

function findNodeOptionByValue(root: VNode<any>, value: string): VNode<any> | null {
  const stack: VNode[] = [root];

  while (stack.length) {
    const node = stack.pop()!;

    if (Array.isArray(node)) {
      stack.push(...node);
      continue;
    }

    if (typeof node === "string") continue;
    if (typeof node === "number") continue;
    if (!node.props.children) continue;

    if ("value" in node.props) {
      // @ts-expect-error
      if (node.type?.displayName === "SelectItem" && node.props.value === value) {
        return node;
      }
    }

    stack.push(...(node.props.children as VNode[]));
  }

  return null;
}

// Select Separator
export type SelectSeparatorProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const SelectSeparator = forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      ref={forwardedRef}
      tabindex={-1}
      className={cn("-mx-1 my-1 h-px bg-muted", className, classNative)}
      {...props}
    />
  )
);
SelectSeparator.displayName = "SelectSeparator";

// TODO: SelectScrollUpButton and SelectScrollDownButton
