import Example0 from "../examples/sonner-demo";
import Example2 from "../examples/sonner-error";
import Example3 from "../examples/sonner-info";
import Example5 from "../examples/sonner-promise";
import Example1 from "../examples/sonner-success";
import Example4 from "../examples/sonner-warning";

export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Example0 />
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}
