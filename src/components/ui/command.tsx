import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-preact";
import { type ComponentPropsWithoutRef, type ElementRef, type HTMLAttributes, forwardRef } from "preact/compat";
import { Dialog, DialogContent, type DialogProviderProps as DialogProps } from "./dialog";
import { cn } from "./share/cn";

export type CommandProps = ComponentPropsWithoutRef<typeof CommandPrimitive>;

export const Command = forwardRef<ElementRef<typeof CommandPrimitive>, CommandProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <CommandPrimitive
      ref={forwardedRef}
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
        className,
        classNative
      )}
      {...props}
    />
  )
);
Command.displayName = CommandPrimitive.displayName;

export type CommandDialogProps = Pick<DialogProps, "open" | "children"> & {
  onOpenChange?: (open: boolean) => void;
};

export const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog
      {...props}
      onChange={props.onOpenChange}
    >
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export type CommandInputProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Input>;

export const CommandInput = forwardRef<ElementRef<typeof CommandPrimitive.Input>, CommandInputProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <div
      className="flex items-center border-b px-3"
      cmdk-input-wrapper=""
    >
      <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        ref={forwardedRef}
        className={cn(
          "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          className,
          classNative
        )}
        {...props}
      />
    </div>
  )
);
CommandInput.displayName = CommandPrimitive.Input.displayName;

export type CommandListProps = ComponentPropsWithoutRef<typeof CommandPrimitive.List>;

export const CommandList = forwardRef<ElementRef<typeof CommandPrimitive.List>, CommandListProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <CommandPrimitive.List
      ref={forwardedRef}
      className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className, classNative)}
      {...props}
    />
  )
);
CommandList.displayName = CommandPrimitive.List.displayName;

export type CommandEmptyProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>;

export const CommandEmpty = forwardRef<ElementRef<typeof CommandPrimitive.Empty>, CommandEmptyProps>(
  (props, forwardedRef) => (
    <CommandPrimitive.Empty
      ref={forwardedRef}
      className="py-6 text-center text-sm"
      {...props}
    />
  )
);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export type CommandGroupProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Group>;

export const CommandGroup = forwardRef<ElementRef<typeof CommandPrimitive.Group>, CommandGroupProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <CommandPrimitive.Group
      ref={forwardedRef}
      className={cn(
        "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs",
        className,
        classNative
      )}
      {...props}
    />
  )
);
CommandGroup.displayName = CommandPrimitive.Group.displayName;

export type CommandSeparatorProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>;

export const CommandSeparator = forwardRef<ElementRef<typeof CommandPrimitive.Separator>, CommandSeparatorProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <CommandPrimitive.Separator
      ref={forwardedRef}
      className={cn("-mx-1 h-px bg-border", className, classNative)}
      {...props}
    />
  )
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export type CommandItemProps = ComponentPropsWithoutRef<typeof CommandPrimitive.Item>;

export const CommandItem = forwardRef<ElementRef<typeof CommandPrimitive.Item>, CommandItemProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => (
    <CommandPrimitive.Item
      ref={forwardedRef}
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className,
        classNative
      )}
      {...props}
    />
  )
);
CommandItem.displayName = CommandPrimitive.Item.displayName;

export type CommandShortcutProps = HTMLAttributes<HTMLSpanElement>;

export const CommandShortcut = ({ className, class: classNative, ...props }: CommandShortcutProps) => {
  return (
    <span
      className={cn("ml-auto text-muted-foreground text-xs tracking-widest", className, classNative)}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";
