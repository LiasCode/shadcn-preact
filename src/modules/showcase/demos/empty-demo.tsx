import Example2 from "../examples/empty-avatar";
import Example1 from "../examples/empty-avatar-group";
import { EmptyMuted as Example3 } from "../examples/empty-background";
import { EmptyInCard as Example4 } from "../examples/empty-card";
import Example5 from "../examples/empty-demo";
import Example6 from "../examples/empty-input-group";
import Example7 from "../examples/empty-outline";

export function EmptyDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
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
