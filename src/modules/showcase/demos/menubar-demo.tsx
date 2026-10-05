import { MenubarCheckbox as Example1 } from "../examples/menubar-checkbox";
import Example2 from "../examples/menubar-demo";
import { MenubarIcons as Example3 } from "../examples/menubar-icons";
import { MenubarRadio as Example4 } from "../examples/menubar-radio";
import { MenubarSubmenu as Example5 } from "../examples/menubar-submenu";

export function MenubarDemo() {
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
