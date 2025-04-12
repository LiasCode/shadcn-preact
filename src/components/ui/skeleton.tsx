import type { HTMLAttributes } from "preact/compat";
import { cn } from "./share/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, class: classNative, ...props }: SkeletonProps) {
  return <div className={cn("animate-pulse rounded-md bg-primary/10", className, classNative)} {...props} />;
}
