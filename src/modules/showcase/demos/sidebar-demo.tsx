import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import Example0 from "../examples/sidebar-controlled";
import Example1 from "../examples/sidebar-demo";
import Example2 from "../examples/sidebar-footer";
import Example5 from "../examples/sidebar-group";
import Example3 from "../examples/sidebar-group-action";
import Example4 from "../examples/sidebar-group-collapsible";
import Example6 from "../examples/sidebar-header";
import Example11 from "../examples/sidebar-menu";
import Example7 from "../examples/sidebar-menu-action";
import Example8 from "../examples/sidebar-menu-badge";
import Example9 from "../examples/sidebar-menu-collapsible";
import Example10 from "../examples/sidebar-menu-sub";
const examples = [
  Example0,
  Example1,
  Example2,
  Example3,
  Example4,
  Example5,
  Example6,
  Example7,
  Example8,
  Example9,
  Example10,
  Example11,
];

export function SidebarDemo() {
  const [selected, setSelected] = useState(0);
  const Example = examples[selected]!;
  return (
    <div className="w-full space-y-4">
      <NativeSelect
        aria-label="Sidebar example"
        value={String(selected)}
        onChange={(event) => setSelected(Number(event.currentTarget.value))}
      >
        <NativeSelectOption value="0">Controlled</NativeSelectOption>
        <NativeSelectOption value="1">Demo</NativeSelectOption>
        <NativeSelectOption value="2">Footer</NativeSelectOption>
        <NativeSelectOption value="3">Group Action</NativeSelectOption>
        <NativeSelectOption value="4">Group Collapsible</NativeSelectOption>
        <NativeSelectOption value="5">Group</NativeSelectOption>
        <NativeSelectOption value="6">Header</NativeSelectOption>
        <NativeSelectOption value="7">Menu Action</NativeSelectOption>
        <NativeSelectOption value="8">Menu Badge</NativeSelectOption>
        <NativeSelectOption value="9">Menu Collapsible</NativeSelectOption>
        <NativeSelectOption value="10">Menu Sub</NativeSelectOption>
        <NativeSelectOption value="11">Menu</NativeSelectOption>
      </NativeSelect>
      <div className="relative isolate h-[440px] w-full overflow-hidden rounded-lg border [transform:translateZ(0)]">
        <Example />
      </div>
    </div>
  );
}
