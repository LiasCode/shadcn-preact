import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useMemo, useRef, useState } from "preact/compat";

import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { type FloatingAlign, useDismissableLayer, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { useControlledState } from "./share/useControlledState";

type SelectContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  selectedLabel: string;
  setSelectedLabel: (label: string) => void;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
  disabled?: boolean;
};

const SelectContext = createContext<SelectContextType | null>(null);

function useSelect() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within a <Select>");
  return ctx;
}

type SelectProps = PropsWithChildren<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}>;

function Select({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled,
  children,
}: SelectProps) {
  const [value, setValue] = useControlledState({
    defaultValue: defaultValue ?? "",
    controlledValue: valueProp,
    onChange: onValueChange,
  });
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });
  const [trigger, setTrigger] = useControlledState<HTMLElement | null>({ defaultValue: null });
  const [selectedLabel, setSelectedLabel] = useState("");
  const ctx = useMemo(
    () => ({ open, setOpen, value, setValue, selectedLabel, setSelectedLabel, trigger, setTrigger, disabled }),
    [disabled, open, selectedLabel, setOpen, setTrigger, setValue, trigger, value],
  );

  return <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>;
}

function SelectGroup(props: ComponentProps<"div">) {
  return <div role="group" data-slot="select-group" {...props} />;
}

function SelectValue({ placeholder, children, ...props }: ComponentProps<"span"> & { placeholder?: string }) {
  const { value, selectedLabel } = useSelect();
  return (
    <span data-slot="select-value" {...props}>
      {children ?? (selectedLabel || value || placeholder)}
    </span>
  );
}

type SelectTriggerProps = ComponentProps<"button"> & { size?: "sm" | "default" };

const SelectTrigger = forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, size = "default", children, onClick, disabled, ...props }, forwardedRef) => {
    const { open, setOpen, setTrigger, disabled: rootDisabled } = useSelect();
    const composedRef = useComposedRefs(forwardedRef, setTrigger);
    const isDisabled = disabled || rootDisabled;
    return (
      <button
        ref={composedRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-disabled={isDisabled}
        disabled={isDisabled}
        data-slot="select-trigger"
        data-size={size}
        data-state={open ? "open" : "closed"}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          if (!isDisabled) setOpen(!open);
        }}
        className={cn(
          "flex h-9 w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[size=sm]:h-8 data-[size=sm]:rounded-md data-[size=sm]:px-2 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="size-4 opacity-50" />
      </button>
    );
  },
);
SelectTrigger.displayName = "SelectTrigger";

type SelectContentProps = ComponentProps<"div"> & {
  align?: FloatingAlign;
  sideOffset?: number;
  container?: Element | DocumentFragment | null;
};

const SelectContent = forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, align = "center", sideOffset = 4, container, style, children, ...props }, forwardedRef) => {
    const { open, setOpen, trigger } = useSelect();
    const floating = useFloatingContent({ open, side: "bottom", align, sideOffset, reference: trigger });
    const contentRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLElement | null>(trigger);
    triggerRef.current = trigger;
    const composedRef = useComposedRefs(forwardedRef, floating.refs.setFloating, contentRef);
    useDismissableLayer({ open, onOpenChange: setOpen, contentRef, triggerRef });

    if (!floating.present) return null;

    return (
      <Portal container={container}>
        <div
          ref={composedRef}
          role="listbox"
          data-slot="select-content"
          data-state={!open ? "closed" : floating.isPositioned ? "open" : undefined}
          data-side={floating.resolvedSide}
          data-align={floating.resolvedAlign}
          style={{
            ...(floating.style as object),
            minWidth: trigger?.offsetWidth,
            ...(style && typeof style === "object" ? style : {}),
          }}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget && !open) floating.setPresent(false);
          }}
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 relative z-50 max-h-96 min-w-32 origin-(--radix-popper-transform-origin) overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
          )}
          {...props}
        >
          <div className="p-1">{children}</div>
        </div>
      </Portal>
    );
  },
);
SelectContent.displayName = "SelectContent";

function SelectLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-2 py-1.5 font-medium text-muted-foreground text-xs", className)}
      {...props}
    />
  );
}

type SelectItemProps = ComponentProps<"div"> & {
  value: string;
  disabled?: boolean;
};

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, disabled, onClick, ...props }, forwardedRef) => {
    const select = useSelect();
    const checked = select.value === value;
    return (
      <div
        ref={forwardedRef}
        role="option"
        aria-selected={checked}
        aria-disabled={disabled}
        data-slot="select-item"
        data-state={checked ? "checked" : "unchecked"}
        data-disabled={disabled ? "" : undefined}
        tabIndex={disabled ? undefined : -1}
        onClick={(e: MouseEvent) => {
          if (disabled) return;
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          select.setValue(value);
          select.setSelectedLabel(String(children ?? value));
          select.setOpen(false);
        }}
        className={cn(
          "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className,
        )}
        {...props}
      >
        <span className="absolute right-2 flex size-3.5 items-center justify-center">
          {checked && <CheckIcon className="size-4" />}
        </span>
        {children}
      </div>
    );
  },
);
SelectItem.displayName = "SelectItem";

function SelectSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-up-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </div>
  );
}

function SelectScrollDownButton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="select-scroll-down-button"
      className={cn("flex cursor-default items-center justify-center py-1", className)}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </div>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};