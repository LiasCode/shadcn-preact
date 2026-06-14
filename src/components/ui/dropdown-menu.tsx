import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useMemo, useRef } from "preact/compat";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { type FloatingAlign, type FloatingSide, useDismissableLayer, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";

type DropdownMenuContextType = {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
};

const DropdownMenuContext = createContext<DropdownMenuContextType | null>(null);
const DropdownMenuRadioContext = createContext<{ value?: string; onValueChange?: (value: string) => void } | null>(
  null
);

function useDropdownMenu() {
  const ctx = useContext(DropdownMenuContext);
  if (!ctx) throw new Error("DropdownMenu components must be used within a <DropdownMenu>");
  return ctx;
}

type DropdownMenuProps = PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}>;

function DropdownMenu({ open: openProp, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  const [open, setOpen] = useControlledState({
    defaultValue: defaultOpen ?? false,
    controlledValue: openProp,
    onChange: onOpenChange,
  });
  const [trigger, setTrigger] = useControlledState<HTMLElement | null>({ defaultValue: null });
  const value = useMemo(() => ({ open, setOpen, trigger, setTrigger }), [open, setOpen, setTrigger, trigger]);
  return <DropdownMenuContext.Provider value={value}>{children}</DropdownMenuContext.Provider>;
}

function DropdownMenuPortal({ container, ...props }: ComponentProps<typeof Portal>) {
  return (
    <Portal
      container={container}
      {...props}
    />
  );
}

type DropdownMenuTriggerProps = ComponentProps<"button"> & { asChild?: boolean };

const DropdownMenuTrigger = forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  ({ asChild = false, onClick, ...props }, forwardedRef) => {
    const { open, setOpen, setTrigger } = useDropdownMenu();
    const composedRef = useComposedRefs(forwardedRef, setTrigger);
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={composedRef}
        type={asChild ? undefined : "button"}
        data-slot="dropdown-menu-trigger"
        data-state={open ? "open" : "closed"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setOpen(!open);
        }}
        {...props}
      />
    );
  }
);
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

type DropdownMenuContentProps = ComponentProps<"div"> & {
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  container?: Element | DocumentFragment | null;
};

const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  ({ className, side = "bottom", align = "center", sideOffset = 4, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, trigger } = useDropdownMenu();
    const floating = useFloatingContent({ open, side, align, sideOffset, reference: trigger });
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
          role="menu"
          data-slot="dropdown-menu-content"
          data-state={!open ? "closed" : floating.isPositioned ? "open" : undefined}
          data-side={floating.resolvedSide}
          data-align={floating.resolvedAlign}
          style={{ ...(floating.style as object), ...(style && typeof style === "object" ? style : {}) }}
          onAnimationEnd={(e: AnimationEvent) => {
            if (e.target === e.currentTarget && !open) floating.setPresent(false);
          }}
          className={cn(
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 min-w-32 origin-(--radix-popper-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
            className
          )}
          {...props}
        />
      </Portal>
    );
  }
);
DropdownMenuContent.displayName = "DropdownMenuContent";

function DropdownMenuGroup(props: ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="dropdown-menu-group"
      {...props}
    />
  );
}

type DropdownMenuItemProps = ComponentProps<"div"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: (event: MouseEvent) => void;
};

const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ className, inset, variant = "default", disabled, onClick, onSelect, ...props }, forwardedRef) => {
    const { setOpen } = useDropdownMenu();
    return (
      <div
        ref={forwardedRef}
        role="menuitem"
        data-slot="dropdown-menu-item"
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
DropdownMenuItem.displayName = "DropdownMenuItem";

type DropdownMenuCheckboxItemProps = Omit<DropdownMenuItemProps, "role"> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

const DropdownMenuCheckboxItem = forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  ({ className, children, checked, onCheckedChange, onSelect, ...props }, forwardedRef) => {
    return (
      <DropdownMenuItem
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
      </DropdownMenuItem>
    );
  }
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

function DropdownMenuRadioGroup({
  value,
  onValueChange,
  ...props
}: ComponentProps<"div"> & { value?: string; onValueChange?: (value: string) => void }) {
  return (
    <DropdownMenuRadioContext.Provider value={{ value, onValueChange }}>
      <div
        role="radiogroup"
        data-slot="dropdown-menu-radio-group"
        {...props}
      />
    </DropdownMenuRadioContext.Provider>
  );
}

type DropdownMenuRadioItemProps = DropdownMenuItemProps & { value: string };

const DropdownMenuRadioItem = forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  ({ className, children, value, onSelect, ...props }, forwardedRef) => {
    const radio = useContext(DropdownMenuRadioContext);
    const checked = radio?.value === value;
    return (
      <DropdownMenuItem
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
      </DropdownMenuItem>
    );
  }
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

function DropdownMenuLabel({ className, inset, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="dropdown-menu-label"
      data-inset={inset ? "" : undefined}
      className={cn("px-2 py-1.5 font-medium text-sm data-[inset]:pl-8", className)}
      {...props}
    />
  );
}

function DropdownMenuSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dropdown-menu-separator"
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto text-muted-foreground text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ children }: PropsWithChildren) {
  return <div className="group relative">{children}</div>;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      role="menuitem"
      data-slot="dropdown-menu-sub-trigger"
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

function DropdownMenuSubContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="menu"
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "absolute top-0 left-full z-50 ml-1 hidden min-w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md group-hover:block",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
};
