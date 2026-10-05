import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { MessageActionsDemo as Example0 } from "../examples/message-actions";
import { MessageAttachmentDemo as Example1 } from "../examples/message-attachment";
import { MessageAvatarDemo as Example2 } from "../examples/message-avatar";
import { MessageDemo as Example3 } from "../examples/message-demo";
import { MessageGroupDemo as Example4 } from "../examples/message-group";
import { MessageHeaderFooterDemo as Example5 } from "../examples/message-header-footer";
import { MessageMarkdownDemo as Example6 } from "../examples/message-markdown";
const examples = [
  ["Actions", Example0],
  ["Attachment", Example1],
  ["Avatar", Example2],
  ["Demo", Example3],
  ["Group", Example4],
  ["Header Footer", Example5],
  ["Markdown", Example6],
] as const;

export function MessageDemo() {
  const [selected, setSelected] = useState(3);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Message example"
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
