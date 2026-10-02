import type { ComponentProps } from "@registry/ui/primitives/internals/types";
import { cn } from "cn";
import { LoaderIcon } from "lucide-preact";

function Spinner({ className, ...props }: ComponentProps<"svg">) {
  return <LoaderIcon role="status" aria-label="Loading" className={cn("size-4 animate-spin", className)} {...props} />;
}

export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  );
}