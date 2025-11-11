import { Loader2Icon } from "lucide-preact";
import type { ComponentProps } from "preact";
import { cn } from "./share/cn";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return (
    // @ts-expect-error
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
