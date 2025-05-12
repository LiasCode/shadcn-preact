import { ChevronDown } from "lucide-preact";
import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "preact/compat";
import { Collapsible, CollapsibleTrigger } from "./collapsible";
import { cn } from "./share/cn";

export const AccordionContext = createContext<{
  value?: string | string[];

  defaultValue?: string | string[];

  onValueChange?(value: string | string[]): void;

  collapsible?: boolean;

  type: "single" | "multiple";

  disabled: boolean;

  dir: "ltr" | "rtl";

  orientation: "horizontal" | "vertical";
} | null>(null);

export type AccordionProps = {
  asChild?: boolean;

  value?: string | string[];

  defaultValue?: string | string[];

  onValueChange?(value: string | string[]): void;

  collapsible?: boolean;

  type?: "single" | "multiple";

  disabled?: boolean;

  dir?: "ltr" | "rtl";

  orientation?: "horizontal" | "vertical";
} & HTMLAttributes<HTMLDivElement>;

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      disabled = false,
      orientation = "vertical",
      type = "single",
      collapsible = false,
      dir = "ltr",
      defaultValue,
      value: controlledValue,
      onValueChange,
      children,
      className,
      class: classNative,
      ...props
    },
    forwardedRef
  ) => {
    const [value, setValue] = useState(
      defaultValue !== undefined
        ? defaultValue
        : controlledValue !== undefined
          ? controlledValue
          : // Default Value
            type === "single"
            ? ""
            : []
    );

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (onValueChange && value !== controlledValue) {
        onValueChange(value);
      }
    }, [value]);

    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
      }
    }, [controlledValue]);

    return (
      <AccordionContext.Provider
        value={{
          value,
          disabled,
          orientation,
          dir,
          type,
          collapsible,
          defaultValue,
          onValueChange(value) {
            if (!disabled) {
              setValue(value);
            }
          },
        }}
      >
        <div
          ref={forwardedRef}
          className={cn(className, classNative)}
          data-orientation={orientation}
          {...props}
        >
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

export function useAccordion() {
  const c = useContext(AccordionContext);
  if (!c) throw new Error("useAccordion should be used within AccordionProvider");
  return c;
}

export type AccordionItemProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;

  disabled?: boolean;

  value: string;
};

export const AccordionItemContext = createContext<{
  state: "open" | "closed";
  disabled?: boolean;
  value: string;
  orientation: "horizontal" | "vertical";
} | null>(null);

export function useAccordionItem() {
  const c = useContext(AccordionItemContext);
  if (!c) throw new Error("useAccordionItem should be used within useAccordionItemProvider");
  return c;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, class: classNative, children, ...props }, ref) => {
    const { orientation, value, onValueChange, type } = useAccordion();

    const state: "open" | "closed" = useMemo(() => {
      if (!value) return "closed";

      if (type === "single" && typeof value === "string") {
        return value === props.value ? "open" : "closed";
      }

      if (type === "multiple" && Array.isArray(value)) {
        return value.includes(props.value) ? "open" : "closed";
      }

      return "closed";
    }, [value, props.value, type]);

    return (
      <AccordionItemContext
        value={{
          orientation,
          value: props.value,
          state,
          disabled: props.disabled,
        }}
      >
        <Collapsible
          ref={ref}
          className={cn("border-b", className, classNative)}
          data-state={state}
          data-disabled={props.disabled}
          data-orientation={orientation}
          open={state === "open"}
          onOpenChange={(open) => {
            if (type === "single") {
              if (open === true) {
                onValueChange?.(props.value);
              } else if (open === false) {
                onValueChange?.("");
              }
            }

            if (type === "multiple" && value !== undefined && typeof value !== "string") {
              if (open === true) {
                const newValue = [...value, props.value];
                onValueChange?.(newValue);
              } else if (open === false) {
                const newValue = value.filter((v) => v !== props.value);
                onValueChange?.(newValue);
              }
            }
          }}
          {...props}
        >
          {children}
        </Collapsible>
      </AccordionItemContext>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

export type AccordionTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
};

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, class: classNative, children, ...props }, ref) => {
    const { state, orientation, disabled } = useAccordionItem();

    return (
      <h3 className="flex">
        <CollapsibleTrigger
          ref={ref}
          className={cn(
            "flex flex-1 items-center justify-between py-4 text-left font-medium text-sm transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
            className,
            classNative
          )}
          data-state={state}
          data-disabled={disabled}
          data-orientation={orientation}
          asChild={props.asChild}
          disabled={disabled}
          {...props}
        >
          {children}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </CollapsibleTrigger>
      </h3>
    );
  }
);
AccordionTrigger.displayName = "AccordionTrigger";

export type AccordionContentProps = HTMLAttributes<HTMLDivElement> & {
  asChild?: boolean;
};

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, class: classNative, children, ...props }, ref) => {
    const { state, orientation, disabled } = useAccordionItem();

    return (
      <div
        ref={ref}
        className={cn("overflow-hidden text-sm", state === "closed" ? "h-0" : "h-fit")}
        data-state={state}
        data-disabled={disabled}
        data-orientation={orientation}
        asChild={props.asChild}
        {...props}
      >
        <div className={cn("pt-0 pb-4", className, classNative)}>{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = "AccordionContent";
