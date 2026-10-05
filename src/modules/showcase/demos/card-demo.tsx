import Example1 from "../examples/card-demo";
import { CardEdgeToEdge as Example2 } from "../examples/card-edge-to-edge";
import { CardImage as Example3 } from "../examples/card-image";
import { CardSmall as Example4 } from "../examples/card-small";

export function CardDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}
