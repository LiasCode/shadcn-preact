import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/ui/input-group";
import { EyeOffIcon } from "lucide-preact";

export function InputGroupInlineEnd() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="input-group-inline-end-inline-end-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="input-group-inline-end-inline-end-input"
          type="password"
          placeholder="Enter password"
        />
        <InputGroupAddon align="inline-end">
          <EyeOffIcon />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the end.</FieldDescription>
    </Field>
  );
}
