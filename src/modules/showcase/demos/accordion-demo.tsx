import { AccordionBasic as Example1 } from "../examples/accordion-basic";
import Example2 from "../examples/accordion-borders";
import Example3 from "../examples/accordion-card";
import Example4 from "../examples/accordion-demo";
import Example5 from "../examples/accordion-disabled";
import { AccordionMultiple as Example6 } from "../examples/accordion-multiple";

export function AccordionDemo() {
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
