import { AlertDialogBasic as Example1 } from "../examples/alert-dialog-basic";
import Example2 from "../examples/alert-dialog-demo";
import { AlertDialogDestructive as Example3 } from "../examples/alert-dialog-destructive";
import { AlertDialogWithMedia as Example4 } from "../examples/alert-dialog-media";
import { AlertDialogSmall as Example6 } from "../examples/alert-dialog-small";
import { AlertDialogSmallWithMedia as Example5 } from "../examples/alert-dialog-small-media";

export function AlertDialogDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
    </div>
  );
}