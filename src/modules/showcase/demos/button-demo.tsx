import Example1 from "../examples/button-default";
import Example2 from "../examples/button-demo";
import Example3 from "../examples/button-destructive";
import Example4 from "../examples/button-ghost";
import Example5 from "../examples/button-icon";
import Example6 from "../examples/button-link";
import Example7 from "../examples/button-outline";
import Example8 from "../examples/button-render";
import Example9 from "../examples/button-rounded";
import Example10 from "../examples/button-secondary";
import Example11 from "../examples/button-size";
import Example12 from "../examples/button-spinner";
import Example13 from "../examples/button-with-icon";

export function ButtonDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
      <Example8 />
      <Example9 />
      <Example10 />
      <Example11 />
      <Example12 />
      <Example13 />
    </div>
  );
}