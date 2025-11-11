import type { TextareaHTMLAttributes } from "preact";
import { forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export type TextareaProps = TextareaHTMLAttributes;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    return (
      <textarea
        ref={forwardedRef}
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
          classNative
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";
