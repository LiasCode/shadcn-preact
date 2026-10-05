import { ContextMenuBasic as Example1 } from "../examples/context-menu-basic";
import { ContextMenuCheckboxes as Example2 } from "../examples/context-menu-checkboxes";
import { ContextMenuDemo as Example3 } from "../examples/context-menu-demo";
import { ContextMenuDestructive as Example4 } from "../examples/context-menu-destructive";
import { ContextMenuGroups as Example5 } from "../examples/context-menu-groups";
import { ContextMenuIcons as Example6 } from "../examples/context-menu-icons";
import { ContextMenuRadio as Example7 } from "../examples/context-menu-radio";
import { ContextMenuShortcuts as Example8 } from "../examples/context-menu-shortcuts";
import { ContextMenuSides as Example9 } from "../examples/context-menu-sides";
import { ContextMenuSubmenu as Example10 } from "../examples/context-menu-submenu";

export function ContextMenuDemo() {
  return (
    <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <Example5 />
      <Example6 />
      <Example7 />
      <Example8 />
      <Example9 />
      <Example10 />
    </div>
  );
}
