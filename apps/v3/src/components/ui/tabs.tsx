import { type ButtonHTMLAttributes, createContext } from "preact";
import { type HTMLAttributes, type PropsWithChildren, forwardRef, useContext } from "preact/compat";
import { cn } from "./share/cn";
import { useControlledState } from "./share/useControlledState";
import { Show } from "./show";

export type TabsProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  /** The value for the selected tab, if controlled */
  value?: string;
  /** The value of the tab to select by default, if uncontrolled */
  defaultValue?: string;
  /** A function called when a new tab is selected */
  onValueChange?: (value: string) => void;
  /**
   * The orientation the tabs are layed out.
   * Mainly so arrow navigation is done accordingly (left & right vs. up & down)
   * @defaultValue horizontal
   */
  orientation?: "vertical" | "horizontal";
  /**
   * Whether a tab is activated automatically or manually.
   * @defaultValue automatic
   * */
  activationMode?: "automatic" | "manual";
};

const TabContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
  orientation: "vertical" | "horizontal";
  activationMode?: "automatic" | "manual";
} | null>(null);

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      activationMode,
      orientation,
      children,
      className,
      class: classNative,
      ...props
    },
    forwardedRef
  ) => {
    const [value, setValue] = useControlledState({
      defaultValue: defaultValue ?? "",
      controlledValue,
      onChange: onValueChange,
    });

    return (
      <TabContext.Provider
        value={{ onValueChange: setValue, value, orientation: orientation || "horizontal", activationMode }}
      >
        <div
          ref={forwardedRef}
          className={cn("", className, classNative)}
          {...props}
        >
          {children}
        </div>
      </TabContext.Provider>
    );
  }
);

export function useTabs() {
  const c = useContext(TabContext);
  if (!c) throw new Error("useTabs should be used within Tabs");
  return c;
}

export type TabsListProps = HTMLAttributes<HTMLDivElement>;

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { orientation } = useTabs();

    return (
      <div
        ref={forwardedRef}
        data-orientation={orientation}
        className={cn(
          "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
          className,
          classNative
        )}
        {...props}
      />
    );
  }
);
TabsList.displayName = "TabsList";

export type TabsTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & { value?: string };

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { value, onValueChange, orientation } = useTabs();
    return (
      <button
        ref={forwardedRef}
        data-state={value === props.value ? "active" : "inactive"}
        data-orientation={orientation}
        onClick={() => onValueChange(props.value || "")}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 font-medium text-sm ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
          className,
          classNative
        )}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & { value?: string };

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { value, orientation } = useTabs();

    return (
      <Show when={value === props.value}>
        <div
          ref={forwardedRef}
          data-orientation={orientation}
          data-state="active"
          className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            className,
            classNative
          )}
          {...props}
        />
      </Show>
    );
  }
);
TabsContent.displayName = "TabsContent";
