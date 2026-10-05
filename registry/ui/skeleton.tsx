import { cn } from "./lib/utils";
import type { ComponentProps } from "./primitives/internals/types";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-muted rounded-md animate-pulse", className)}
      {...props}
    />
  );
}

export { Skeleton };
