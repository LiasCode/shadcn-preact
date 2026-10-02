import { DialogCloseButton as Example1 } from "../examples/dialog-close-button";
import { DialogDemo as Example2 } from "../examples/dialog-demo";
import { DialogNoCloseButton as Example3 } from "../examples/dialog-no-close-button";
import { DialogScrollableContent as Example4 } from "../examples/dialog-scrollable-content";
import { DialogStickyFooter as Example5 } from "../examples/dialog-sticky-footer";

export function DialogDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
    </div>
  );
}