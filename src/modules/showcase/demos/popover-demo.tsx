import { PopoverAlignments as Example1 } from "../examples/popover-alignments";
import { PopoverBasic as Example2 } from "../examples/popover-basic";
import Example3 from "../examples/popover-demo";
import { PopoverForm as Example4 } from "../examples/popover-form";

export function PopoverDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}