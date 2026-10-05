import { Loader2Icon } from "lucide-preact";

import { cn } from "./lib/utils";
import type { ComponentProps } from "./primitives/internals/types";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    <Loader2Icon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
