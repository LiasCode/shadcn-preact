import { ToggleDemo as Example1 } from "../examples/toggle-demo";
import { ToggleDisabled as Example2 } from "../examples/toggle-disabled";
import { ToggleOutline as Example3 } from "../examples/toggle-outline";
import { ToggleSizes as Example4 } from "../examples/toggle-sizes";
import { ToggleText as Example5 } from "../examples/toggle-text";

export function ToggleDemo() {
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