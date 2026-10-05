import { SwitchChoiceCard as Example1 } from "../examples/switch-choice-card";
import { SwitchDemo as Example2 } from "../examples/switch-demo";
import { SwitchDescription as Example3 } from "../examples/switch-description";
import { SwitchDisabled as Example4 } from "../examples/switch-disabled";
import { SwitchInvalid as Example5 } from "../examples/switch-invalid";
import { SwitchSizes as Example6 } from "../examples/switch-sizes";

export function SwitchDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}
