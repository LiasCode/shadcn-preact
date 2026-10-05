import { TextareaButton as Example1 } from "../examples/textarea-button";
import Example2 from "../examples/textarea-demo";
import { TextareaDisabled as Example3 } from "../examples/textarea-disabled";
import { TextareaField as Example4 } from "../examples/textarea-field";
import { TextareaInvalid as Example5 } from "../examples/textarea-invalid";

export function TextareaDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}
