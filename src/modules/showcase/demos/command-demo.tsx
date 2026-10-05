import { CommandBasic as Example0 } from "../examples/command-basic";
import { CommandDemo as Example1 } from "../examples/command-demo";
import { CommandDialogDemo as Example2 } from "../examples/command-dialog";
import { CommandWithGroups as Example3 } from "../examples/command-groups";
import { CommandManyItems as Example4 } from "../examples/command-scrollable";
import { CommandWithShortcuts as Example5 } from "../examples/command-shortcuts";

export function CommandDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example0 />
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}
