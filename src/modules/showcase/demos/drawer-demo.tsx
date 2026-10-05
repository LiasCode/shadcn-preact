import { DrawerDialogDemo as Example1 } from "../examples/drawer-dialog";
import { DrawerNested as Example2 } from "../examples/drawer-nested";
import { DrawerNonModal as Example3 } from "../examples/drawer-non-modal";
import { DrawerWithSides as Example4 } from "../examples/drawer-sides";
import { DrawerSnapPoints as Example5 } from "../examples/drawer-snap-points";
import { DrawerSwipeHandle as Example6 } from "../examples/drawer-swipe-handle";

export function DrawerDemo() {
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
