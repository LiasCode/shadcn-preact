import { CheckboxBasic as Example1 } from "../examples/checkbox-basic";
import Example2 from "../examples/checkbox-demo";
import { CheckboxDescription as Example3 } from "../examples/checkbox-description";
import { CheckboxDisabled as Example4 } from "../examples/checkbox-disabled";
import { CheckboxGroup as Example5 } from "../examples/checkbox-group";
import { CheckboxInvalid as Example6 } from "../examples/checkbox-invalid";
import { CheckboxInTable as Example7 } from "../examples/checkbox-table";

export function CheckboxDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-col items-start gap-8 overflow-x-auto">
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