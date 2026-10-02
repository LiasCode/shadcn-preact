import { InputGroupBasic as Example1 } from "../examples/input-group-basic";
import { InputGroupBlockEnd as Example2 } from "../examples/input-group-block-end";
import { InputGroupBlockStart as Example3 } from "../examples/input-group-block-start";
import Example4 from "../examples/input-group-button-group";
import Example5 from "../examples/input-group-custom";
import { InputGroupDemo as Example6 } from "../examples/input-group-demo";
import Example7 from "../examples/input-group-icon";
import { InputGroupInCard as Example8 } from "../examples/input-group-in-card";
import { InputGroupInlineEnd as Example9 } from "../examples/input-group-inline-end";
import { InputGroupInlineStart as Example10 } from "../examples/input-group-inline-start";
import { InputGroupKbd as Example11 } from "../examples/input-group-kbd";
import Example12 from "../examples/input-group-spinner";
import Example13 from "../examples/input-group-text";
import Example15 from "../examples/input-group-textarea";
import { InputGroupTextareaExamples as Example14 } from "../examples/input-group-textarea-examples";
import { InputGroupWithButtons as Example16 } from "../examples/input-group-with-buttons";
import { InputGroupWithKbd as Example17 } from "../examples/input-group-with-kbd";

export function InputGroupDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
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
      <Example11 />
      <Example12 />
      <Example13 />
      <Example14 />
      <Example15 />
      <Example16 />
      <Example17 />
    </div>
  );
}