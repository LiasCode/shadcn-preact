import { SelectAlignItem as Example1 } from "../examples/select-align-item";
import { SelectDemo as Example2 } from "../examples/select-demo";
import { SelectDisabled as Example3 } from "../examples/select-disabled";
import { SelectGroups as Example4 } from "../examples/select-groups";
import { SelectInvalid as Example5 } from "../examples/select-invalid";
import { SelectScrollable as Example6 } from "../examples/select-scrollable";

export function SelectDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}
