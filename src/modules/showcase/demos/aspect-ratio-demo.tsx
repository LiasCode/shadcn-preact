import Example1 from "../examples/aspect-ratio-demo";
import { AspectRatioPortrait as Example2 } from "../examples/aspect-ratio-portrait";
import { AspectRatioSquare as Example3 } from "../examples/aspect-ratio-square";

export function AspectRatioDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
    </div>
  );
}
