import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext, useId, useMemo, useRef } from "preact/compat";
import { cn } from "./share/cn";
import { useComposedRefs } from "./share/compose_ref";
import { type FloatingAlign, type FloatingSide, useDismissableLayer, useFloatingContent } from "./share/floating";
import { Portal } from "./share/portal";
import { useControlledState } from "./share/useControlledState";

type MenubarRootContextType = {
  value: string;
  setValue: (value: string) => void;
};

type MenubarMenuContextType = {
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: HTMLElement | null;
  setTrigger: (el: HTMLElement | null) => void;
};

const MenubarRootContext = createContext<MenubarRootContextType | null>(null);
const MenubarMenuContext = createContext<MenubarMenuContextType | null>(null);
const MenubarRadioContext = createContext<{ value?: string; onValueChange?: (value: string) => void } | null>(null);

function useMenubarRoot() {
  const ctx = useContext(MenubarRootContext);
  if (!ctx) throw new Error("Menubar components must be used within a <Menubar>");
  return ctx;
}

function useMenubarMenu() {
  const ctx = useContext(MenubarMenuContext);
  if (!ctx) throw new Error("MenubarMenu components must be used within a <MenubarMenu>");
  return ctx;
}

type MenubarProps = ComponentProps<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const Menubar = forwardRef<HTMLDivElement, MenubarProps>(
  ({ className, value: valueProp, defaultValue, onValueChange, ...props }, forwardedRef) => {
    const [value, setValue] = useControlledState({
      defaultValue: defaultValue ?? "",
      controlledValue: valueProp,
      onChange: onValueChange,
    });

    return (
      <MenubarRootContext.Provider value={{ value, setValue }}>
        <div
          ref={forwardedRef}
          role="menubar"
          data-slot="menubar"
          className={cn("flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs", className)}
          {...props}
        />
      </MenubarRootContext.Provider>
    );
  }
);
Menubar.displayName = "Menubar";

type MenubarMenuProps = PropsWithChildren<{ value?: string }>;

function MenubarMenu({ value, children }: MenubarMenuProps) {
  const root = useMenubarRoot();
  const [trigger, setTrigger] = useControlledState<HTMLElement | null>({ defaultValue: null });
  const generatedId = useId();
  const itemValue = value ?? `menubar-${generatedId}`;
  const open = root.value === itemValue;
  const setOpen = (nextOpen: boolean) => root.setValue(nextOpen ? itemValue : "");
  const ctx = useMemo(
    () => ({ value: itemValue, open, setOpen, trigger, setTrigger }),
    [itemValue, open, setTrigger, trigger]
  );
  return <MenubarMenuContext.Provider value={ctx}>{children}</MenubarMenuContext.Provider>;
}

type MenubarTriggerProps = ComponentProps<"button">;

const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  ({ className, onClick, onPointerEnter, ...props }, forwardedRef) => {
    const root = useMenubarRoot();
    const { open, setOpen, setTrigger, value } = useMenubarMenu();
    const composedRef = useComposedRefs(forwardedRef, setTrigger);

    return (
      <button
        ref={composedRef}
        type="button"
        role="menuitem"
        data-slot="menubar-trigger"
        data-state={open ? "open" : "closed"}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setOpen(!open);
        }}
        onPointerEnter={(e: PointerEvent) => {
          (onPointerEnter as ((e: PointerEvent) => void) | undefined)?.(e);
          if (root.value) root.setValue(value);
        }}
        className={cn(
          "flex cursor-default select-none items-center rounded-sm px-2 py-1 font-medium text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
          className
        )}
        {...props}
      />
    );
  }
);
MenubarTrigger.displayName = "MenubarTrigger";

type MenubarContentProps = ComponentProps<"div"> & {
  side?: FloatingSide;
  align?: FloatingAlign;
  sideOffset?: number;
  container?: Element | DocumentFragment | null;
};

const MenubarContent = forwardRef<HTMLDivElement, MenubarContentProps>(
  ({ className, side = "bottom", align = "start", sideOffset = 4, container, style, ...props }, forwardedRef) => {
    const { open, setOpen, trigger } = useMenubarMenu();
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
          data-slot="menubar-content"
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
MenubarContent.displayName = "MenubarContent";

type MenubarItemProps = ComponentProps<"div"> & {
  inset?: boolean;
  variant?: "default" | "destructive";
  disabled?: boolean;
  onSelect?: (event: MouseEvent) => void;
};

const MenubarItem = forwardRef<HTMLDivElement, MenubarItemProps>(
  ({ className, inset, variant = "default", disabled, onClick, onSelect, ...props }, forwardedRef) => {
    const { setOpen } = useMenubarMenu();
    return (
      <div
        ref={forwardedRef}
        role="menuitem"
        data-slot="menubar-item"
        data-inset={inset ? "" : undefined}
        data-variant={variant}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled}
        tabIndex={disabled ? undefined : -1}
        onClick={(e: MouseEvent) => {
          if (disabled) return;
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          (onSelect as ((event: MouseEvent) => void) | undefined)?.(e);
          if (!e.defaultPrevented) setOpen(false);
        }}
        className={cn(
          "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[inset]:pl-8 data-[variant=destructive]:text-destructive data-[disabled]:opacity-50 data-[variant=destructive]:focus:bg-destructive/10 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          className
        )}
        {...props}
      />
    );
  }
);
MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = forwardRef<
  HTMLDivElement,
  MenubarItemProps & { checked?: boolean; onCheckedChange?: (checked: boolean) => void }
>(({ className, children, checked, onCheckedChange, onSelect, ...props }, forwardedRef) => {
  return (
    <MenubarItem
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
    </MenubarItem>
  );
});
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

function MenubarRadioGroup({
  value,
  onValueChange,
  ...props
}: ComponentProps<"div"> & { value?: string; onValueChange?: (value: string) => void }) {
  return (
    <MenubarRadioContext.Provider value={{ value, onValueChange }}>
      <div
        role="radiogroup"
        data-slot="menubar-radio-group"
        {...props}
      />
    </MenubarRadioContext.Provider>
  );
}

const MenubarRadioItem = forwardRef<HTMLDivElement, MenubarItemProps & { value: string }>(
  ({ className, children, value, onSelect, ...props }, forwardedRef) => {
    const radio = useContext(MenubarRadioContext);
    const checked = radio?.value === value;
    return (
      <MenubarItem
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
      </MenubarItem>
    );
  }
);
MenubarRadioItem.displayName = "MenubarRadioItem";

function MenubarGroup(props: ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="menubar-group"
      {...props}
    />
  );
}

function MenubarLabel({ className, inset, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="menubar-label"
      data-inset={inset ? "" : undefined}
      className={cn("px-2 py-1.5 font-medium text-sm data-[inset]:pl-8", className)}
      {...props}
    />
  );
}

function MenubarSeparator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="menubar-separator"
      aria-hidden="true"
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function MenubarShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn("ml-auto text-muted-foreground text-xs tracking-widest", className)}
      {...props}
    />
  );
}

function MenubarSub({ children }: PropsWithChildren) {
  return <div className="group relative">{children}</div>;
}

function MenubarSubTrigger({ className, inset, children, ...props }: ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      role="menuitem"
      data-slot="menubar-sub-trigger"
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

function MenubarSubContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      role="menu"
      data-slot="menubar-sub-content"
      className={cn(
        "absolute top-0 left-full z-50 ml-1 hidden min-w-32 rounded-md border bg-popover p-1 text-popover-foreground shadow-md group-hover:block",
        className
      )}
      {...props}
    />
  );
}

export {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
};
