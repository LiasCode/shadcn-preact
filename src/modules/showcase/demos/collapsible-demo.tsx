import { CollapsibleBasic as Example1 } from "../examples/collapsible-basic";
import Example2 from "../examples/collapsible-demo";
import { CollapsibleFileTree as Example3 } from "../examples/collapsible-file-tree";
import { CollapsibleSettings as Example4 } from "../examples/collapsible-settings";

export function CollapsibleDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-col items-start gap-8 overflow-x-auto">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
    </div>
  );
}
