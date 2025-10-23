import { ChevronDownIcon } from "lucide-preact";
import type { ComponentProps } from "preact";
import { cn } from "./share/cn";

function NativeSelect({ className, class: classNative, ...props }: ComponentProps<"select">) {
  return (
    <div
      className="group/native-select relative w-fit has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        className={cn(
          "h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-2 pr-9 text-sm shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed dark:bg-input/30 dark:hover:bg-input/50",
          "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className,
          classNative
        )}
        {...props}
      />
      <ChevronDownIcon
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 right-3.5 size-4 select-none text-muted-foreground opacity-50"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  );
}

function NativeSelectOption({ ...props }: ComponentProps<"option">) {
  return (
    <option
      data-slot="native-select-option"
      {...props}
    />
  );
}

function NativeSelectOptGroup({ className, class: classNative, ...props }: ComponentProps<"optgroup">) {
  return (
    <optgroup
      data-slot="native-select-optgroup"
      className={cn(className, classNative)}
      {...props}
    />
  );
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption };
