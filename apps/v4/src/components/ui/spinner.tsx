import { cn } from "@ui/share/cn";
import { Loader2Icon } from "lucide-preact";
import type { ComponentProps } from "preact";

type SpinnerProps = ComponentProps<"svg">;

function Spinner({ className, class: classNative, ...props }: SpinnerProps) {
  return (
    //@ts-expect-error <The icons props are not SignalLike>
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className, classNative)}
      {...props}
    />
  );
}

export { Spinner, type SpinnerProps };
