import Example1 from "../examples/pagination-demo";
import { PaginationSimple as Example2 } from "../examples/pagination-simple";

export function PaginationDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
    </div>
  );
}
