import { type HTMLAttributes, type PropsWithChildren, createContext, forwardRef } from "preact/compat";
import { useContext, useEffect, useState } from "preact/hooks";
import { cn } from "./share/cn";
import { Slot } from "./share/slot";
import { Show } from "./show";

export type CollapsibleContextT = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
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
  ({
    children,
    open: controlledOpen,
    onOpenChange,
    defaultOpen,
    class: classNative,
    className,
    disabled,
    ...props
  }: CollapsibleProps) => {
    const [isOpen, setIsOpen] = useState(
      defaultOpen !== undefined ? defaultOpen : controlledOpen !== undefined ? controlledOpen : false
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (onOpenChange && isOpen !== controlledOpen) {
        onOpenChange(isOpen);
      }
    }, [isOpen]);

    useEffect(() => {
      if (controlledOpen !== undefined) {
        setIsOpen(controlledOpen);
      }
    }, [controlledOpen]);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    const Comp = props.asChild ? Slot : "div";

    return (
      <CollapsibleContext.Provider value={{ isOpen, open, close, disabled: Boolean(disabled) }}>
        <Comp
          data-state={isOpen ? "open" : "closed"}
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

export type CollapsibleTriggerProps = HTMLAttributes<HTMLButtonElement> & { asChild?: boolean };

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild, ...props }, forwardedRef) => {
    const { open, close, isOpen, disabled } = useCollapsible();
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        onClick={() => (isOpen ? close() : open())}
        data-state={isOpen ? "open" : "closed"}
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
  ({ children, className, class: classNative, ...props }) => {
    const { isOpen, disabled } = useCollapsible();

    return (
      <Show when={isOpen}>
        <div
          data-state={isOpen ? "open" : "closed"}
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
