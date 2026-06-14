import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useMemo, useRef } from "preact/compat";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { useDismissableLayer } from "./share/floating";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";

type Point = { x: number; y: number };
type ContextMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  point: Point;
  setPoint: (point: Point) => void;
};

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

function useContextMenu() {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("ContextMenu components must be used within a <ContextMenu>");
  return ctx;
}

type ContextMenuProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function ContextMenu({ open: openProp, defaultOpen, onOpenChange, children }: ContextMenuProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });
  const [point, setPoint] = useControlledState<Point>({ defaultValue: { x: 0, y: 0 } });
  const value = useMemo(() => ({ open, setOpen, point, setPoint }), [open, point, setOpen, setPoint]);
  return <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>;
}

type ContextMenuTriggerProps = ComponentProps<"div"> & { asChild?: boolean; disabled?: boolean };

const ContextMenuTrigger = forwardRef<HTMLDivElement, ContextMenuTriggerProps>(
  ({ asChild = false, disabled, onContextMenu, ...props }, forwardedRef) => {
    const { setOpen, setPoint } = useContextMenu();
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={forwardedRef}
        data-slot="context-menu-trigger"
        data-disabled={disabled ? "" : undefined}
        onContextMenu={(e: MouseEvent) => {
          (onContextMenu as ((e: MouseEvent) => void) | undefined)?.(e);
          if (disabled || e.defaultPrevented) return;
          e.preventDefault();
          setPoint({ x: e.clientX, y: e.clientY });
          setOpen(true);
        }}
        {...props}
      />
    );
  }
);
ContextMenuTrigger.displayName = "ContextMenuTrigger";

type ContextMenuContentProps = ComponentProps<"div"> & {
  container?: Element | DocumentFragment | null;
};

const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  ({ className, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, point } = useContextMenu();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const composedRef = useComposedRefs(forwardedRef, contentRef);
    useDismissableLayer({ open, onOpenChange: setOpen, contentRef });

    if (!open) return null;

    return (
      <Portal container={container}>
        <div
          ref={composedRef}
          role="menu"
          data-slot="context-menu-content"
          data-state="open"
          style={{
            position: "fixed",
            top: point.y,
            left: point.x,
            ...(style && typeof style === "object" ? style : {}),
          }}
          className={cn(
            "fade-in-0 zoom-in-95 z-50 min-w-32 origin-top-left animate-in overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
            className
          )}
          {...props}
        />
      </Portal>
    );
  }
);
ContextMenuContent.displayName = "ContextMenuContent";

type ContextMenuItemProps = ComponentProps<"div"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: (event: MouseEvent) => void;
};

const ContextMenuItem = forwardRef<HTMLDivElement, ContextMenuItemProps>(
  ({ className, inset, variant = "default", disabled, onClick, onSelect, ...props }, forwardedRef) => {
    const { setOpen } = useContextMenu();
    return (
      <div
        ref={forwardedRef}
        role="menuitem"
        data-slot="context-menu-item"
        data-inset={inset ? "" : undefined}
        data-variant={variant}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : -1}
        onClick={(e: MouseEvent) => {
          if (disabled) return;
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          (onSelect as ((event: MouseEvent) => void) | undefined)?.(e as unknown as MouseEvent);
          if (!e.defaultPrevented) setOpen(false);
        }}
        className={cn(
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);
ContextMenuItem.displayName = "ContextMenuItem";

type ContextMenuCheckboxItemProps = ContextMenuItemProps & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const ContextMenuCheckboxItem = forwardRef<HTMLDivElement, ContextMenuCheckboxItemProps>(
  ({ className, children, checked, onCheckedChange, onSelect, ...props }, forwardedRef) => {
    return (
      <ContextMenuItem
        ref={forwardedRef}
        role="menuitemcheckbox"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn("pl-8", className)}
        onSelect={(e) => {
          onCheckedChange?.(!checked);
          (onSelect as ((event: MouseEvent) => void) | undefined)?.(e as unknown as MouseEvent);
        }}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <CheckIcon className="size-4" />}
        </span>
        {children}
      </ContextMenuItem>
    );
  }
);
ContextMenuCheckboxItem.displayName = "ContextMenuCheckboxItem";

const ContextMenuRadioContext = createContext<{ value?: string; onValueChange?: (value: string) => void } | null>(null);

function ContextMenuRadioGroup({
  value,
  onValueChange,
  ...props
}: ComponentProps<"div"> & { value?: string; onValueChange?: (value: string) => void }) {
  return (
    <ContextMenuRadioContext.Provider value={{ value, onValueChange }}>
      <div
        role="radiogroup"
        data-slot="context-menu-radio-group"
        {...props}
      />
    </ContextMenuRadioContext.Provider>
  );
}

const ContextMenuRadioItem = forwardRef<HTMLDivElement, ContextMenuItemProps & { value: string }>(
  ({ className, children, value, onSelect, ...props }, forwardedRef) => {
    const radio = useContext(ContextMenuRadioContext);
    const checked = radio?.value === value;
    return (
      <ContextMenuItem
        ref={forwardedRef}
        role="menuitemradio"
        aria-checked={checked}
        data-state={checked ? "checked" : "unchecked"}
        className={cn("pl-8", className)}
        onSelect={(e) => {
          radio?.onValueChange?.(value);
          (onSelect as ((event: MouseEvent) => void) | undefined)?.(e as unknown as MouseEvent);
        }}
        {...props}
      >
        <span className="absolute left-2 flex size-3.5 items-center justify-center">
          {checked && <CircleIcon className="size-2 fill-current" />}
        </span>
        {children}
      </ContextMenuItem>
    );
  }
);
ContextMenuRadioItem.displayName = "ContextMenuRadioItem";

function ContextMenuLabel({ className, inset, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="context-menu-label"
      data-inset={inset ? "" : undefined}
      className={cn("px-2 py-1.5 font-medium text-sm data-[inset]:pl-8", className)}
      {...props}
    />
  );
}

function ContextMenuSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="context-menu-separator"
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function ContextMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn("ml-auto text-muted-foreground text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function ContextMenuGroup(props: ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="context-menu-group"
      {...props}
    />
  );
}

function ContextMenuSub({ children }: PropsWithChildren) {
  return <div className="group relative">{children}</div>;
}

function ContextMenuSubTrigger({ className, inset, children, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      role="menuitem"
      data-slot="context-menu-sub-trigger"
      data-inset={inset ? "" : undefined}
      tabIndex={-1}
      className={cn(
        "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent data-[inset]:pl-8",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto size-4" />
    </div>
  );
}

function ContextMenuSubContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="menu"
      data-slot="context-menu-sub-content"
      className={cn(
        "absolute top-0 left-full z-50 ml-1 hidden min-w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md group-hover:block",
        className
      )}
      {...props}
    />
  );
}

export {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
};
