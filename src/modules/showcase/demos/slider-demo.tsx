import { SliderControlled as Example1 } from "../examples/slider-controlled";
import { SliderDemo as Example2 } from "../examples/slider-demo";
import { SliderDisabled as Example3 } from "../examples/slider-disabled";
import { SliderMultiple as Example4 } from "../examples/slider-multiple";
import { SliderRange as Example5 } from "../examples/slider-range";
import { SliderVertical as Example6 } from "../examples/slider-vertical";

export function SliderDemo() {
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
