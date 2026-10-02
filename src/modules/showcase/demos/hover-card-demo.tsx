import Example1 from "../examples/hover-card-demo";
import { HoverCardSides as Example2 } from "../examples/hover-card-sides";

export function HoverCardDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
    </div>
  );
}