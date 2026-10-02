import { InputBadge as Example1 } from "../examples/input-badge";
import { InputBasic as Example2 } from "../examples/input-basic";
import { InputButtonGroup as Example3 } from "../examples/input-button-group";
import { InputDemo as Example4 } from "../examples/input-demo";
import { InputDisabled as Example5 } from "../examples/input-disabled";
import { InputField as Example6 } from "../examples/input-field";
import { InputFieldgroup as Example7 } from "../examples/input-fieldgroup";
import { InputFile as Example8 } from "../examples/input-file";
import { InputGrid as Example9 } from "../examples/input-grid";
import { InputInline as Example10 } from "../examples/input-inline";
import { InputInputGroup as Example11 } from "../examples/input-input-group";
import { InputInvalid as Example12 } from "../examples/input-invalid";
import { InputRequired as Example13 } from "../examples/input-required";

export function InputDemo() {
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
    </div>
  );
}