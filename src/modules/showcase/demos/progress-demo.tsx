import Example1 from "../examples/progress-demo";
import { ProgressWithLabel as Example2 } from "../examples/progress-label";

export function ProgressDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
    </div>
  );
}