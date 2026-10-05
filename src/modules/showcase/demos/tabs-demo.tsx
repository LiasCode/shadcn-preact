import { TabsDemo as Example1 } from "../examples/tabs-demo";
import { TabsDisabled as Example2 } from "../examples/tabs-disabled";
import { TabsIcons as Example3 } from "../examples/tabs-icons";
import { TabsLine as Example4 } from "../examples/tabs-line";
import { TabsVertical as Example5 } from "../examples/tabs-vertical";

export function TabsDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-col items-start gap-8 overflow-x-auto">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}
