import { ChevronDownIcon } from "lucide-preact";
import { type ComponentProps, createContext } from "preact";
import { forwardRef, useContext, useId, useMemo, useState } from "preact/compat";

import { cn } from "./share/cn";

type NavigationMenuContextType = {
  value: string;
  setValue: (value: string) => void;
};

type NavigationMenuItemContextType = {
  value: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const NavigationMenuContext = createContext<NavigationMenuContextType | null>(null);
const NavigationMenuItemContext = createContext<NavigationMenuItemContextType | null>(null);

function useNavigationMenu() {
  const ctx = useContext(NavigationMenuContext);
  if (!ctx) throw new Error("NavigationMenu components must be used within a <NavigationMenu>");
  return ctx;
}

function useNavigationMenuItem() {
  const ctx = useContext(NavigationMenuItemContext);
  if (!ctx) throw new Error("NavigationMenu item components must be used within a <NavigationMenuItem>");
  return ctx;
}

type NavigationMenuProps = ComponentProps<"nav"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, value: valueProp, defaultValue = "", onValueChange, onPointerLeave, ...props }, forwardedRef) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const value = valueProp ?? internalValue;
    const setValue = (nextValue: string) => {
      if (valueProp === undefined) setInternalValue(nextValue);
      onValueChange?.(nextValue);
    };

    return (
      <NavigationMenuContext.Provider value={{ value, setValue }}>
        <nav
          ref={forwardedRef}
          data-slot="navigation-menu"
          onPointerLeave={(e: PointerEvent) => {
            (onPointerLeave as ((e: PointerEvent) => void) | undefined)?.(e);
            setValue("");
          }}
          className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
          {...props}
        />
      </NavigationMenuContext.Provider>
    );
  },
);
NavigationMenu.displayName = "NavigationMenu";

function NavigationMenuList({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="navigation-menu-list"
      className={cn("group flex flex-1 list-none items-center justify-center gap-1", className)}
      {...props}
    />
  );
}

type NavigationMenuItemProps = ComponentProps<"li"> & { value?: string };

function NavigationMenuItem({ value: valueProp, className, onPointerEnter, ...props }: NavigationMenuItemProps) {
  const root = useNavigationMenu();
  const generatedId = useId();
  const value = valueProp ?? `navigation-${generatedId}`;
  const open = root.value === value;
  const item = useMemo(
    () => ({ value, open, setOpen: (nextOpen: boolean) => root.setValue(nextOpen ? value : "") }),
    [open, root, value],
  );
  return (
    <NavigationMenuItemContext.Provider value={item}>
      <li
        data-slot="navigation-menu-item"
        data-state={open ? "open" : "closed"}
        className={cn("relative", className)}
        onPointerEnter={(e: PointerEvent) => {
          (onPointerEnter as ((e: PointerEvent) => void) | undefined)?.(e);
          root.setValue(value);
        }}
        {...props}
      />
    </NavigationMenuItemContext.Provider>
  );
}

const navigationMenuTriggerStyle =
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent/50";

type NavigationMenuTriggerProps = ComponentProps<"button">;

const NavigationMenuTrigger = forwardRef<HTMLButtonElement, NavigationMenuTriggerProps>(
  ({ className, children, onClick, ...props }, forwardedRef) => {
    const { open, setOpen } = useNavigationMenuItem();
    return (
      <button
        ref={forwardedRef}
        type="button"
        data-slot="navigation-menu-trigger"
        data-state={open ? "open" : "closed"}
        aria-expanded={open}
        onClick={(e: MouseEvent) => {
          (onClick as ((e: MouseEvent) => void) | undefined)?.(e);
          setOpen(!open);
        }}
        className={cn(navigationMenuTriggerStyle, className)}
        {...props}
      >
        {children}
        <ChevronDownIcon
          className="relative top-px ml-1 size-3 transition-transform duration-200 group-data-[state=open]:rotate-180"
          aria-hidden="true"
        />
      </button>
    );
  },
);
NavigationMenuTrigger.displayName = "NavigationMenuTrigger";

type NavigationMenuContentProps = ComponentProps<"div">;

const NavigationMenuContent = forwardRef<HTMLDivElement, NavigationMenuContentProps>(
  ({ className, ...props }, forwardedRef) => {
    const { open } = useNavigationMenuItem();
    if (!open) return null;

    return (
      <div
        ref={forwardedRef}
        data-slot="navigation-menu-content"
        data-state="open"
        className={cn(
          "fade-in-0 zoom-in-95 absolute top-full left-0 z-50 mt-1 w-max min-w-80 animate-in rounded-md border bg-popover p-2 text-popover-foreground shadow-md",
          className,
        )}
        {...props}
      />
    );
  },
);
NavigationMenuContent.displayName = "NavigationMenuContent";

type NavigationMenuLinkProps = ComponentProps<"a"> & {
  active?: boolean;
};

const NavigationMenuLink = forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, active, ...props }, forwardedRef) => {
    return (
      <a
        ref={forwardedRef}
        data-slot="navigation-menu-link"
        data-active={active ? "" : undefined}
        className={cn(
          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[active]:bg-accent/50",
          className,
        )}
        {...props}
      />
    );
  },
);
NavigationMenuLink.displayName = "NavigationMenuLink";

function NavigationMenuViewport({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-viewport"
      className={cn("absolute top-full left-0 flex justify-center", className)}
      {...props}
    />
  );
}

function NavigationMenuIndicator({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="navigation-menu-indicator"
      className={cn("top-full z-1 flex h-1.5 items-end justify-center overflow-hidden", className)}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  NavigationMenuViewport,
};