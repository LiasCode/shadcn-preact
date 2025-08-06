import { forwardRef, type HTMLAttributes } from "preact/compat";
import { cn } from "./share/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn("animate-pulse rounded-md bg-primary/10", className, classNative)}
        {...props}
      />
    );
  }
);
