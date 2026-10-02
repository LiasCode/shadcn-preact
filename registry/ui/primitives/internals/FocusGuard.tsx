import type { ComponentProps } from "./types";
import { visuallyHidden } from "./visuallyHidden";
export function FocusGuard(props: ComponentProps<"span">) {
  return <span tabIndex={0} aria-hidden="true" data-base-ui-focus-guard="" style={visuallyHidden} {...props} />;
}