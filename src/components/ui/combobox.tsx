import { CheckIcon, ChevronsUpDownIcon, SearchIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useMemo, useRef, useState } from "preact/compat";

import { Button } from "./button";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { useDismissableLayer, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { useControlledState } from "./share/useControlledState";

type ComboboxContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  label: string;
  setLabel: (label: string) => void;
  query: string;
  setQuery: (query: string) => void;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
};

const ComboboxContext = createContext<ComboboxContextType | null>(null);

function useCombobox() {
  const ctx = useContext(ComboboxContext);
  if (!ctx) throw new Error("Combobox components must be used within a <Combobox>");
  return ctx;
}

type ComboboxProps = PropsWithChildren<{
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function Combobox({
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen,
  onOpenChange,
  children,
}: ComboboxProps) {
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
  const [label, setLabel] = useState("");
  const [query, setQuery] = useState("");
  const ctx = useMemo(
    () => ({ open, setOpen, value, setValue, label, setLabel, query, setQuery, trigger, setTrigger }),
    [label, open, query, setOpen, setTrigger, setValue, trigger, value],
  );
  return <ComboboxContext.Provider value={ctx}>{children}</ComboboxContext.Provider>;
}

type ComboboxTriggerProps = ComponentProps<typeof Button> & { placeholder?: string };

const ComboboxTrigger = forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  ({ className, children, placeholder = "Select option...", onClick, ...props }, forwardedRef) => {
    const { open, setOpen, label, value, setTrigger } = useCombobox();
    const composedRef = useComposedRefs(forwardedRef, setTrigger);
    return (
      <Button
        ref={composedRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        data-slot="combobox-trigger"
        variant="outline"
        className={cn("w-56 justify-between", className)}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setOpen(!open);
        }}
        {...props}
      >
        <span className="truncate">{children ?? (label || value || placeholder)}</span>
        <ChevronsUpDownIcon className="opacity-50" />
      </Button>
    );
  },
);
ComboboxTrigger.displayName = "ComboboxTrigger";

type ComboboxContentProps = ComponentProps<"div"> & {
  container?: Element | DocumentFragment | null;
};

const ComboboxContent = forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, trigger } = useCombobox();
    const floating = useFloatingContent({ open, side: "bottom", align: "start", sideOffset: 4, reference: trigger });
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
          data-slot="combobox-content"
          data-state={!open ? "closed" : floating.isPositioned ? "open" : undefined}
          data-side={floating.resolvedSide}
          style={{
            ...(floating.style as object),
            minWidth: trigger?.offsetWidth,
            ...(style && typeof style === "object" ? style : {}),
          }}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget && !open) floating.setPresent(false);
          }}
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 overflow-hidden rounded-md border bg-popover p-0 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
            className,
          )}
          {...props}
        />
      </Portal>
    );
  },
);
ComboboxContent.displayName = "ComboboxContent";

function ComboboxInput({ className, onInput, ...props }: ComponentProps<"input">) {
  const { query, setQuery } = useCombobox();
  return (
    <div className="flex items-center border-b px-3">
      <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
      <input
        data-slot="combobox-input"
        value={query}
        onInput={(e: InputEvent) => {
          const nextValue = (e.currentTarget as HTMLInputElement).value;
          setQuery(nextValue);
          (onInput as ((e: InputEvent) => void) | undefined)?.(e);
        }}
        className={cn(
          "flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function ComboboxList({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="listbox"
      data-slot="combobox-list"
      className={cn("max-h-72 overflow-y-auto overflow-x-hidden p-1", className)}
      {...props}
    />
  );
}

type ComboboxItemProps = ComponentProps<"div"> & {
  value: string;
  disabled?: boolean;
};

const ComboboxItem = forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, children, value, disabled, onClick, ...props }, forwardedRef) => {
    const { value: selectedValue, setValue, setLabel, setOpen, query } = useCombobox();
    const label = String(children ?? value);
    const visible =
      !query || label.toLowerCase().includes(query.toLowerCase()) || value.toLowerCase().includes(query.toLowerCase());
    const selected = selectedValue === value;
    if (!visible) return null;

    return (
      <div
        ref={forwardedRef}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        data-slot="combobox-item"
        data-disabled={disabled ? "" : undefined}
        data-selected={selected ? "" : undefined}
        tabIndex={disabled ? undefined : -1}
        onClick={(e: MouseEvent) => {
          if (disabled) return;
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setValue(value);
          setLabel(label);
          setOpen(false);
        }}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[selected]:bg-accent data-[selected]:text-accent-foreground data-[disabled]:opacity-50",
          className,
        )}
        {...props}
      >
        <CheckIcon className={cn("mr-2 size-4", selected ? "opacity-100" : "opacity-0")} />
        {children}
      </div>
    );
  },
);
ComboboxItem.displayName = "ComboboxItem";

function ComboboxEmpty({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="combobox-empty"
      className={cn("py-6 text-center text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger };