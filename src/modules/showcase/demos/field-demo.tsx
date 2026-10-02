import { FieldFieldset as Example1 } from "../examples/field-fieldset";
import Example2 from "../examples/field-input";
import { FieldResponsive as Example3 } from "../examples/field-responsive";
import Example4 from "../examples/field-textarea";

export function FieldDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}