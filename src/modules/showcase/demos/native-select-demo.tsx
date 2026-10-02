import Example1 from "../examples/native-select-demo";
import { NativeSelectDisabled as Example2 } from "../examples/native-select-disabled";
import Example3 from "../examples/native-select-groups";
import { NativeSelectInvalid as Example4 } from "../examples/native-select-invalid";

export function NativeSelectDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}