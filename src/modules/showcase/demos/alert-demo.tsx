import Example1 from "../examples/alert-action";
import Example2 from "../examples/alert-basic";
import Example3 from "../examples/alert-colors";
import Example4 from "../examples/alert-demo";
import Example5 from "../examples/alert-destructive";

export function AlertDemo() {
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