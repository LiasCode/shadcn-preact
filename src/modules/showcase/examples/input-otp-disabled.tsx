import { InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@registry/ui/input-otp";

import { VisibleInputOTP as InputOTP } from "../components/visible-input-otp";

export function InputOTPDisabled() {
  return (
    <InputOTP id="input-otp-disabled-disabled" maxLength={6} disabled value="123456">
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}