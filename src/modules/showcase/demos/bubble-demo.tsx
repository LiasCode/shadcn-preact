import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { BubbleAlignmentDemo as Example0 } from "../examples/bubble-alignment";
import { BubbleCollapsible as Example1 } from "../examples/bubble-collapsible";
import { BubbleDemo as Example2 } from "../examples/bubble-demo";
import { BubbleGroupDemo as Example3 } from "../examples/bubble-group-demo";
import { BubbleLinkButtonDemo as Example4 } from "../examples/bubble-link-button";
import { BubbleMarkdownDemo as Example5 } from "../examples/bubble-markdown";
import { BubblePopoverDemo as Example6 } from "../examples/bubble-popover";
import { BubbleReactionsDemo as Example7 } from "../examples/bubble-reactions";
import { BubbleTooltipDemo as Example8 } from "../examples/bubble-tooltip";
import { BubbleVariantsDemo as Example9 } from "../examples/bubble-variants";
const examples = [
  ["Alignment", Example0],
  ["Collapsible", Example1],
  ["Demo", Example2],
  ["Group Demo", Example3],
  ["Link Button", Example4],
  ["Markdown", Example5],
  ["Popover", Example6],
  ["Reactions", Example7],
  ["Tooltip", Example8],
  ["Variants", Example9],
] as const;
export function BubbleDemo() {
  const [selected, setSelected] = useState(2);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Bubble example"
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