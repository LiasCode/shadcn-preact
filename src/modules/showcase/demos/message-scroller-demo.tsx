import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { MessageScrollerAnchoring as Example0 } from "../examples/message-scroller-anchoring";
import { MessageScrollerAnimation as Example1 } from "../examples/message-scroller-animation";
import { MessageScrollerCommands as Example2 } from "../examples/message-scroller-commands";
import { MessageScrollerDemo as Example3 } from "../examples/message-scroller-demo";
import { MessageScrollerGroupChat as Example4 } from "../examples/message-scroller-group-chat";
import { MessageScrollerLoadHistory as Example5 } from "../examples/message-scroller-load-history";
import { MessageScrollerOpeningPosition as Example6 } from "../examples/message-scroller-opening-position";
import { MessageScrollerPreviousContext as Example7 } from "../examples/message-scroller-previous-context";
import { MessageScrollerScrollable as Example8 } from "../examples/message-scroller-scrollable";
import { MessageScrollerState as Example9 } from "../examples/message-scroller-state";
import { MessageScrollerStreaming as Example10 } from "../examples/message-scroller-streaming";
import { MessageScrollerVisibility as Example11 } from "../examples/message-scroller-visibility";
const examples = [
  ["Anchoring", Example0],
  ["Animation", Example1],
  ["Commands", Example2],
  ["Demo", Example3],
  ["Group Chat", Example4],
  ["Load History", Example5],
  ["Opening Position", Example6],
  ["Previous Context", Example7],
  ["Scrollable", Example8],
  ["State", Example9],
  ["Streaming", Example10],
  ["Visibility", Example11],
] as const;

export function MessageScrollerDemo() {
  const [selected, setSelected] = useState(3);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Message Scroller example"
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
