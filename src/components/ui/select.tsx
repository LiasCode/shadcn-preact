import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import { Check, ChevronDown } from "lucide-preact";
import type { VNode } from "preact";
import {
  type CSSProperties,
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
import { Show } from "./show";

export type Direction = "ltr" | "rtl";

export const OPEN_KEYS = [" ", "Enter", "ArrowUp", "ArrowDown"];
export const SELECTION_KEYS = [" ", "Enter"];

export type SelectContextT = {
  openSelect: () => void;

  closeSelect: () => void;

  id: string;

  ref: {
    reference: MutableRefObject<HTMLDivElement | null>;
    floating: MutableRefObject<HTMLElement | null>;
    setReference: (node: HTMLDivElement) => void;
    setFloating: (node: HTMLElement) => void;
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

  /* TODO: Fix bug for initial default value render no children node correctly */
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
  const [isSelectOpen, setIsSelectOpen] = useState(controlledOpen !== undefined ? controlledOpen : false);
  const [value, setValue] = useState<string>(
    controlledValue !== undefined ? controlledValue : defaultValue !== undefined ? defaultValue : ""
  );
  const [select_id] = useState(Math.random().toString());
  const [nodeForTheSelectedValue, setNodeForTheSelectedValue] = useState<SelectContextT["nodeForTheSelectedValue"]>("");

  const { refs, floatingStyles } = useFloating<HTMLDivElement>({
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (onOpenChange && isSelectOpen !== controlledOpen) {
      onOpenChange(isSelectOpen);
    }
  }, [isSelectOpen]);

  useEffect(() => {
    if (controlledOpen !== undefined) {
      setIsSelectOpen(controlledOpen);
    }
  }, [controlledOpen]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (props.onValueChange && value !== controlledValue) {
      props.onValueChange(value);
    }
  }, [value]);

  useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue);
    }
  }, [controlledValue]);

  const openSelect = useCallback(() => setIsSelectOpen(true), []);
  const closeSelect = useCallback(() => {
    setIsSelectOpen(false);
    refs.reference.current?.focus();
  }, [refs.reference.current]);

  return (
    <SelectContext.Provider
      value={{
        open: isSelectOpen,
        id: select_id,
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

      {/* TODO: TEST the usage with a external form work correctly */}
      <select
        name={props.name}
        form={props.form}
        disabled={props.disabled}
        required={props.required}
        autoComplete={props.autoComplete}
        tabIndex={-1}
        value={value}
        className="-top-[99999px] pointer-events-none fixed h-0 w-0 cursor-none"
      />
    </SelectContext.Provider>
  );
}

export function useSelect() {
  const c = useContext(SelectContext);
  if (!c) throw new Error("useSelect should be used within SelectProvider");
  return c;
}

// Select Trigger
export type SelectTriggerProps = HTMLAttributes<HTMLDivElement> & { asChild?: boolean };

export const SelectTrigger = forwardRef<HTMLDivElement, SelectContentProps>(
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

    return (
      <div
        ref={(v) => ref.setReference(v!)}
        onClick={openDebounced}
        onFocus={() => setIsFocused(true)}
        onFocusOut={() => setIsFocused(false)}
        onBlur={() => setIsFocused(false)}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
        role="button"
        tabIndex={0}
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
      </div>
    );
  }
);

// Select Value
export type SelectValueProps = HTMLAttributes<HTMLSpanElement> & {
  asChild?: boolean;
  placeholder: VNode<any> | string;
};

export const SelectValue = forwardRef<HTMLSpanElement, SelectValueProps>(
  ({ className, class: classNative, ...props }: SelectValueProps, ref) => {
    const { value, nodeForTheSelectedValue } = useSelect();

    return (
      <span ref={ref} className={cn(className, classNative)} {...props}>
        {value && nodeForTheSelectedValue ? nodeForTheSelectedValue : props.placeholder}
      </span>
    );
  }
);

// Select Content
export type SelectContentProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, class: classNative, ...props }) => {
    const { open: isOpen, ref, floatingStyles, closeSelect, id } = useSelect();

    const triggerWidth = useMemo(() => {
      return ref.reference.current?.getBoundingClientRect().width;
    }, [ref.reference.current]);

    useEffect(() => {
      if (!isOpen) return;
      (ref.floating.current?.querySelector("[role=option]") as HTMLOptionElement | undefined)?.focus();
    }, [isOpen, ref.floating.current]);

    return (
      <Modal onClose={closeSelect} show={isOpen} className="bg-transparent">
        <div
          data-select-id={id}
          // @ts-expect-error
          ref={ref.setFloating}
          onClick={(e) => e.stopPropagation()}
          style={{
            ...floatingStyles,
            minWidth: `${triggerWidth}px`,
          }}
          data-state={isOpen ? "open" : "closed"}
          className={cn(
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 flex max-h-[90vh] flex-col overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
            classNative
          )}
          {...props}
        >
          {children}
        </div>
      </Modal>
    );
  }
);

// Select Group
export type SelectGroupProps = HTMLAttributes<HTMLDivElement>;

export const SelectGroup = forwardRef<HTMLDivElement, SelectGroupProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div ref={ref} role="group" className={cn("mb-1", className, classNative)} {...props} />
  )
);
SelectGroup.displayName = "SelectGroup";

// Select Label
export type SelectLabelProps = HTMLAttributes<HTMLDivElement>;

export const SelectLabel = forwardRef<HTMLDivElement, SelectLabelProps>(
  ({ className, class: classNative, ...props }, ref) => (
    <div
      ref={ref}
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
  ({ value: itemValue, className, class: classNative, children, ...props }, ref) => {
    const { value, onValueChange, closeSelect, ref: refs, nodeForTheSelectedValueChange } = useSelect();
    const [isFocused, setIsFocused] = useState(false);

    const isSelected = useMemo(() => value === itemValue, [value, itemValue]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const selectItemHandler = useCallback(() => {
      if (props.disabled) return;
      onValueChange(itemValue);
      // @ts-expect-error
      nodeForTheSelectedValueChange(children);
      closeSelect();
    }, [props.disabled]);

    const focusKeydownHandle = (e: KeyboardEvent) => {
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
        ref={ref}
        // biome-ignore lint/a11y/useSemanticElements: <explanation>
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
SelectItem.displayName = "SelectItem";
