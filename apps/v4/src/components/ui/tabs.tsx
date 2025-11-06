import { type ComponentProps, createContext } from "preact";
import { forwardRef, type PropsWithChildren, useContext } from "preact/compat";
import { cn } from "./share/cn";
import { useControlledState } from "./share/useControlledState";

const TabCtx = createContext<{
  value: string;
  onValueChange: (value: string) => void;
  orientation: "vertical" | "horizontal";
  activationMode?: "automatic" | "manual";
} | null>(null);

function useTabs() {
  const c = useContext(TabCtx);
  if (!c) throw new Error("useTabs should be used within TabCtx provider");
  return c;
}

type TabsProps = PropsWithChildren<ComponentProps<"div">> & {
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

const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    { value: controlledValue, defaultValue, onValueChange, activationMode, orientation, children, className, ...props },
    forwardedRef
  ) => {
    const [value, setValue] = useControlledState({
      defaultValue: defaultValue ?? "",
      controlledValue,
      onChange: onValueChange,
    });

    return (
      <TabCtx.Provider
        value={{ onValueChange: setValue, value, orientation: orientation || "horizontal", activationMode }}
      >
        <div
          ref={forwardedRef}
          data-slot="tabs"
          className={cn("flex flex-col gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </TabCtx.Provider>
    );
  }
);

const TabsList = forwardRef<HTMLDivElement, ComponentProps<"div">>(({ className, ...props }, forwardedRef) => {
  const { orientation } = useTabs();

  return (
    <div
      ref={forwardedRef}
      data-slot="tabs-list"
      data-orientation={orientation}
      className={cn(
        "inline-flex h-9 w-fit items-center justify-center rounded-lg bg-muted p-[3px] text-muted-foreground",
        className
      )}
      {...props}
    />
  );
});

type TabsTriggerProps = ComponentProps<"button"> & { value?: string };

const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(({ className, ...props }, forwardedRef) => {
  const { value, onValueChange, orientation } = useTabs();
  return (
    <button
      ref={forwardedRef}
      data-state={value === props.value ? "active" : "inactive"}
      data-orientation={orientation}
      data-slot="tabs-trigger"
      onClick={() => onValueChange(props.value || "")}
      type="button"
      className={cn(
        "inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md border border-transparent px-2 py-1 font-medium text-foreground text-sm transition-[color,box-shadow] focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:shadow-sm dark:text-muted-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
    />
  );
});

type TabsContentProps = ComponentProps<"div"> & { value?: string };

const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(({ className, ...props }, forwardedRef) => {
  const { value, orientation } = useTabs();

  return (
    value === props.value && (
      <div
        ref={forwardedRef}
        data-orientation={orientation}
        data-state="active"
        data-slot="tabs-content"
        className={cn("flex-1 outline-none", className)}
        {...props}
      />
    )
  );
});

export { Tabs, TabsContent, TabsList, TabsTrigger };
