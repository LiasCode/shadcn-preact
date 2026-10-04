import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { AttachmentDemo as Example0 } from "../examples/attachment-demo";
import { AttachmentGroupDemo as Example1 } from "../examples/attachment-group";
import { AttachmentImage as Example2 } from "../examples/attachment-image";
import { AttachmentSizes as Example3 } from "../examples/attachment-sizes";
import { AttachmentStates as Example4 } from "../examples/attachment-states";
import { AttachmentTriggerDemo as Example5 } from "../examples/attachment-trigger";
const examples = [
  ["Demo", Example0],
  ["Group", Example1],
  ["Image", Example2],
  ["Sizes", Example3],
  ["States", Example4],
  ["Trigger", Example5],
] as const;
export function AttachmentDemo() {
  const [selected, setSelected] = useState(0);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Attachment example"
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