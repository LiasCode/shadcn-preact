import { Field, FieldLabel } from "@registry/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@registry/ui/input-group";
import { InfoIcon } from "lucide-preact";

export function InputInputGroup() {
  return (
    <Field>
      <FieldLabel htmlFor="input-input-group-input-group-url">Website URL</FieldLabel>
      <InputGroup>
        <InputGroupInput id="input-input-group-input-group-url" placeholder="example.com" />
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <InfoIcon />
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}