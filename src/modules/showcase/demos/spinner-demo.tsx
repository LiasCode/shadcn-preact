import { SpinnerBadge as Example1 } from "../examples/spinner-badge";
import { SpinnerButton as Example2 } from "../examples/spinner-button";
import { SpinnerCustom as Example3 } from "../examples/spinner-custom";
import { SpinnerDemo as Example4 } from "../examples/spinner-demo";
import { SpinnerEmpty as Example5 } from "../examples/spinner-empty";
import { SpinnerInputGroup as Example6 } from "../examples/spinner-input-group";
import { SpinnerSize as Example7 } from "../examples/spinner-size";

export function SpinnerDemo() {
  return (
    <div className="flex min-w-0 w-full flex-col items-start gap-8 overflow-x-auto py-5">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
    </div>
  );
}