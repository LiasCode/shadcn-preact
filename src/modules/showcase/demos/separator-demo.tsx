import Example1 from "../examples/separator-demo";
import { SeparatorList as Example2 } from "../examples/separator-list";
import { SeparatorMenu as Example3 } from "../examples/separator-menu";
import { SeparatorVertical as Example4 } from "../examples/separator-vertical";

export function SeparatorDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}
