import { autoPlacement, autoUpdate, offset, shift, useFloating } from "@floating-ui/react-dom";
import { ChevronDown } from "lucide-preact";
import type { ButtonHTMLAttributes } from "preact";
import { type PropsWithChildren, forwardRef, useEffect, useMemo, useState } from "preact/compat";
import { Button } from "./button";
import { Modal } from "./modal";
import { cn } from "./share/cn";
import { Show } from "./show";

export type SelectProps = PropsWithChildren & {
  onChange?: (value: string) => void;
  value?: string;
  data: { value: string; title: string }[];
  title?: string;
  alignment?: "start" | "end";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const SimpleSelect = forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, class: classNative, ...props }) => {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(props.value || "");
    const data = useMemo(() => props.data, [props.data]);

    const select_title = useMemo(() => {
      return data.find((item) => item.value === value)?.title || props.title || "Select";
    }, [data, value, props.title]);

    const { refs, floatingStyles } = useFloating<HTMLButtonElement>({
      open: open,
      strategy: "fixed",
      middleware: [
        autoPlacement({
          allowedPlacements: ["bottom-end", "bottom-start", "top-start", "top-end"],
          alignment: props.alignment || "start",
        }),
        shift(),
        offset(4),
      ],
      whileElementsMounted: autoUpdate,
      transform: false,
    });

    useEffect(() => {
      setValue(props.value || "");
    }, [props.value]);

    return (
      <>
        <Button
          ref={refs.setReference}
          variant="outline"
          className={cn("w-fit min-w-[200px] justify-between", className, classNative)}
          onClick={() => setOpen(!open)}
          onFocus={() => setOpen(true)}
        >
          <span className="text-foreground text-sm">{select_title}</span>
          <ChevronDown className="h-4 w-4 text-foreground" />
        </Button>

        <Show when={open}>
          <Modal
            onClose={() => setOpen(false)}
            className="bg-transparent"
          >
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              className="flex max-h-[96vh] w-fit min-w-[200px] flex-col overflow-auto rounded-md border border-border bg-background p-1 shadow"
            >
              {props.data.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  title={item.title}
                  className={cn(className, classNative)}
                  selected={item.value === value}
                  onSelect={() => {
                    setValue(item.value);
                    setOpen(false);
                    if (props.onChange !== undefined) {
                      props.onChange(item.value);
                    }
                  }}
                />
              ))}
            </div>
          </Modal>
        </Show>
      </>
    );
  }
);

export type SelectItemProps = {
  value: string;
  title: string;
  selected: boolean;
  onSelect: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const SelectItem = forwardRef<HTMLButtonElement, SelectItemProps>(
  ({ class: classNative, className, ...props }, forwardedRef) => {
    if (props.selected) return null;

    return (
      <Button
        ref={forwardedRef}
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          props.onSelect();
        }}
        className={cn("min-h-9 items-center justify-start", className, classNative)}
      >
        {props.title}
      </Button>
    );
  }
);
