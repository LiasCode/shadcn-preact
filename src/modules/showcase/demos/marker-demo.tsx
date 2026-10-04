import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { MarkerBorderDemo as Example0 } from "../examples/marker-border";
import { MarkerDemo as Example1 } from "../examples/marker-demo";
import { MarkerIconDemo as Example2 } from "../examples/marker-icon";
import { MarkerLinkButtonDemo as Example3 } from "../examples/marker-link-button";
import { MarkerSeparatorDemo as Example4 } from "../examples/marker-separator";
import { MarkerShimmerDemo as Example5 } from "../examples/marker-shimmer";
import { MarkerStatusDemo as Example6 } from "../examples/marker-status";
import { MarkerVariantsDemo as Example7 } from "../examples/marker-variants";
const examples = [
  ["Border", Example0],
  ["Demo", Example1],
  ["Icon", Example2],
  ["Link Button", Example3],
  ["Separator", Example4],
  ["Shimmer", Example5],
  ["Status", Example6],
  ["Variants", Example7],
] as const;
export function MarkerDemo() {
  const [selected, setSelected] = useState(1);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Marker example"
        value={String(selected)}
        onChange={(event) => setSelected(Number(event.currentTarget.value))}
      >
        {examples.map(([name], index) => (
          <NativeSelectOption key={name} value={String(index)}>
            {name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="relative w-full min-w-0">
        <Example key={selected} />
      </div>
    </div>
  );
}