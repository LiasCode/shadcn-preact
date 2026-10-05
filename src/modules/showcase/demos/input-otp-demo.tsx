import { InputOTPAlphanumeric as Example0 } from "../examples/input-otp-alphanumeric";
import Example1 from "../examples/input-otp-controlled";
import { InputOTPDemo as Example2 } from "../examples/input-otp-demo";
import { InputOTPDisabled as Example3 } from "../examples/input-otp-disabled";
import { InputOTPForm as Example4 } from "../examples/input-otp-form";
import { InputOTPFourDigits as Example5 } from "../examples/input-otp-four-digits";
import { InputOTPInvalid as Example6 } from "../examples/input-otp-invalid";
import { InputOTPPattern as Example7 } from "../examples/input-otp-pattern";
import Example8 from "../examples/input-otp-separator";

export function InputOtpDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example0 />
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
      <Example8 />
    </div>
  );
}
