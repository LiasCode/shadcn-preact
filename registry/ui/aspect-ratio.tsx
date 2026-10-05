import type { CSSProperties } from "preact";

import { cn } from "./lib/utils";
import type { ComponentProps } from "./primitives/internals/types";

function AspectRatio({ ratio, className, ...props }: ComponentProps<"div"> & { ratio: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      style={
        {
          "--ratio": ratio,
        } as CSSProperties
      }
      className={cn("relative aspect-(--ratio)", className)}
      {...props}
    />
  );
}

export { AspectRatio };
