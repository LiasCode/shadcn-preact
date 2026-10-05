import { ScrollAreaDemo as Example1 } from "../examples/scroll-area-demo";
import { ScrollAreaHorizontalDemo as Example2 } from "../examples/scroll-area-horizontal-demo";

export function ScrollAreaDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <div className="max-w-full overflow-x-auto">
        <Example1 />
      </div>
      <div className="max-w-full overflow-x-auto">
        <Example2 />
      </div>
    </div>
  );
}
