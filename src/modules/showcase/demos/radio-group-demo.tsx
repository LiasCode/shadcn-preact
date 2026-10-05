import { RadioGroupChoiceCard as Example1 } from "../examples/radio-group-choice-card";
import { RadioGroupDemo as Example2 } from "../examples/radio-group-demo";
import { RadioGroupDescription as Example3 } from "../examples/radio-group-description";
import { RadioGroupDisabled as Example4 } from "../examples/radio-group-disabled";
import { RadioGroupFieldset as Example5 } from "../examples/radio-group-fieldset";
import { RadioGroupInvalid as Example6 } from "../examples/radio-group-invalid";

export function RadioGroupDemo() {
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
