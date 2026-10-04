import { Field, FieldLabel } from "@registry/ui/field";
import { InputOTPGroup, InputOTPSlot } from "@registry/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { VisibleInputOTP as InputOTP } from "../components/visible-input-otp";

export function InputOTPPattern() {
  return (
    <Field className="w-fit">
      <FieldLabel htmlFor="input-otp-pattern-digits-only">Digits Only</FieldLabel>
      <InputOTP id="input-otp-pattern-digits-only" maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  );
}