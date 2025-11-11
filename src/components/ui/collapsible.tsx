import type { ButtonHTMLAttributes } from "preact";
import { type HTMLAttributes, type PropsWithChildren, createContext, forwardRef } from "preact/compat";
import { useContext } from "preact/hooks";
import { cn } from "./share/cn";
import { Slot } from "./share/slot";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

export type CollapsibleContextT = {
  open: boolean;
  openCollapsible: () => void;
  closeCollapsible: () => void;
  disabled: boolean;
};

export const CollapsibleContext = createContext<CollapsibleContextT | null>(null);

export type CollapsibleProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  asChild?: boolean;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  disabled?: boolean;
};

export const Collapsible = forwardRef<HTMLDivElement, CollapsibleProps>(
  (
    {
      children,
      open: controlledOpen,
      onOpenChange,
      defaultOpen,
      class: classNative,
      className,
      disabled,
      ...props
    }: CollapsibleProps,
    forwardedRef
  ) => {
    const [open, setOpen] = useControlledState({
      defaultValue: Boolean(defaultOpen),
      controlledValue: controlledOpen,
      onChange: onOpenChange,
    });

    const Comp = props.asChild ? Slot : "div";

    return (
      <CollapsibleContext.Provider
        value={{
          open,
          openCollapsible: () => setOpen(true),
          closeCollapsible: () => setOpen(false),
          disabled: Boolean(disabled),
        }}
      >
        <Comp
          ref={forwardedRef}
          data-state={open ? "open" : "closed"}
          data-disabled={disabled}
          className={cn(className, classNative)}
          {...props}
        >
          {children}
        </Comp>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

export function useCollapsible() {
  const c = useContext(CollapsibleContext);
  if (!c) throw new Error("useCollapsible should be used within CollapsibleProvider");
  return c;
}

export type CollapsibleTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild, ...props }, forwardedRef) => {
    const { openCollapsible, closeCollapsible, open, disabled } = useCollapsible();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        onClick={() => (open ? closeCollapsible() : openCollapsible())}
        data-state={open ? "open" : "closed"}
        data-disabled={disabled}
        ref={forwardedRef}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export type CollapsibleContentProps = HTMLAttributes<HTMLDivElement>;

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ children, className, class: classNative, ...props }, forwardedRef) => {
    const { open, disabled } = useCollapsible();

    return (
      <Show when={open}>
        <div
          ref={forwardedRef}
          data-state={open ? "open" : "closed"}
          data-disabled={disabled}
          className={cn(className, classNative)}
          {...props}
        >
          {children}
        </div>
      </Show>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";
