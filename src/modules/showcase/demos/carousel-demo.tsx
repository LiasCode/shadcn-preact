import Example0 from "../examples/carousel-api";
import Example1 from "../examples/carousel-demo";
import { CarouselMultiple as Example2 } from "../examples/carousel-multiple";
import Example3 from "../examples/carousel-orientation";
import Example4 from "../examples/carousel-plugin";
import Example5 from "../examples/carousel-size";
import Example6 from "../examples/carousel-spacing";
export function CarouselDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8 overflow-x-auto px-12 py-12">
      <Example0 />
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}