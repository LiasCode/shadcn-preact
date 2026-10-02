import { ToggleGroupDemo as Example1 } from "../examples/toggle-group-demo";
import { ToggleGroupDisabled as Example2 } from "../examples/toggle-group-disabled";
import { ToggleGroupFontWeightSelector as Example3 } from "../examples/toggle-group-font-weight-selector";
import { ToggleGroupOutline as Example4 } from "../examples/toggle-group-outline";
import { ToggleGroupSizes as Example5 } from "../examples/toggle-group-sizes";
import { ToggleGroupSpacing as Example6 } from "../examples/toggle-group-spacing";
import { ToggleGroupVertical as Example7 } from "../examples/toggle-group-vertical";

export function ToggleGroupDemo() {
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