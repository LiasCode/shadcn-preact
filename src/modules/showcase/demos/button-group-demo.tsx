import Example1 from "../examples/button-group-input";
import Example2 from "../examples/button-group-orientation";
import Example3 from "../examples/button-group-separator";
import Example4 from "../examples/button-group-size";
import Example5 from "../examples/button-group-split";

export function ButtonGroupDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}