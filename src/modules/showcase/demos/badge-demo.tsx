import { BadgeCustomColors as Example1 } from "../examples/badge-colors";
import Example2 from "../examples/badge-demo";
import { BadgeWithIconLeft as Example3 } from "../examples/badge-icon";
import { BadgeAsLink as Example4 } from "../examples/badge-link";
import { BadgeWithSpinner as Example5 } from "../examples/badge-spinner";
import { BadgeVariants as Example6 } from "../examples/badge-variants";

export function BadgeDemo() {
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