import { ButtonGroup, ButtonGroupText } from "@registry/ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/ui/input-group";
import { Label } from "@registry/ui/label";
import { Link2Icon } from "lucide-preact";

export default function InputGroupButtonGroup() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <ButtonGroup>
        <ButtonGroupText render={<Label htmlFor="input-group-button-group-url" />}>https://</ButtonGroupText>
        <InputGroup>
          <InputGroupInput id="input-group-button-group-url" />
          <InputGroupAddon align="inline-end">
            <Link2Icon />
          </InputGroupAddon>
        </InputGroup>
        <ButtonGroupText>.com</ButtonGroupText>
      </ButtonGroup>
    </div>
  );
}