import Example1 from "../examples/kbd-button";
import Example2 from "../examples/kbd-demo";
import Example3 from "../examples/kbd-group";
import Example4 from "../examples/kbd-input-group";

export function KbdDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}