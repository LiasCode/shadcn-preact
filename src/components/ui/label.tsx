import { type VariantProps, cva } from "class-variance-authority";
import { type LabelHTMLAttributes, forwardRef } from "preact/compat";
import { cn } from "./share/cn";

export const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

export type LabelProps = LabelHTMLAttributes & VariantProps<typeof labelVariants>;

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, class: classNative, ...props }, ref) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: <explanation>
  <label ref={ref} className={cn(labelVariants(), className, classNative)} {...props} />
));
Label.displayName = "Label";
