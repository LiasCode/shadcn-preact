import { TableDemo as Example1 } from "../examples/table-demo";
import { TableFooterExample as Example2 } from "../examples/table-footer";

export function TableDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
    </div>
  );
}