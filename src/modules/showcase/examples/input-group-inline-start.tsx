import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/ui/input-group";
import { SearchIcon } from "lucide-preact";

export function InputGroupInlineStart() {
  return (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="input-group-inline-start-inline-start-input">Input</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-group-inline-start-inline-start-input" placeholder="Search..." />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Icon positioned at the start.</FieldDescription>
    </Field>
  );
}