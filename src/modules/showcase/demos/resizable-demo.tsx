import Example0 from "../examples/resizable-demo";
import Example1 from "../examples/resizable-handle";
import { ResizableVertical as Example2 } from "../examples/resizable-vertical";

export function ResizableDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example0 />
      <Example1 />
      <Example2 />
    </div>
  );
}
