import Example1 from "../examples/sheet-demo";
import Example2 from "../examples/sheet-no-close-button";
import Example3 from "../examples/sheet-side";

export function SheetDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
    </div>
  );
}
