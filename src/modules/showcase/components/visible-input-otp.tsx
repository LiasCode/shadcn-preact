import { InputOTP } from "@registry/ui/input-otp";
import type { ComponentProps } from "@registry/ui/primitives/internals/types";
import { useMergedRefs } from "@registry/ui/primitives/internals/useMergedRefs";
import { useRef } from "preact/hooks";

import { useDemoVisibility } from "../hooks/use-demo-visibility";

/** Keep password-manager integration on screen, and pause its one-second polling off screen. */
export function VisibleInputOTP({
  ref,
  pushPasswordManagerStrategy = "increase-width",
  ...props
}: ComponentProps<typeof InputOTP>) {
  const input = useRef<HTMLInputElement>(null);
  const mergedRef = useMergedRefs(input, ref);
  const visible = useDemoVisibility(input);
  return (
    <InputOTP {...props} ref={mergedRef} pushPasswordManagerStrategy={visible ? pushPasswordManagerStrategy : "none"} />
  );
}