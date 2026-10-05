import { Button } from "@registry/ui/button";
import { ButtonGroup } from "@registry/ui/button-group";
import { Field, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputButtonGroup() {
  return (
    <Field>
      <FieldLabel htmlFor="input-button-group-input-button-group">Search</FieldLabel>
      <ButtonGroup>
        <Input id="input-button-group-input-button-group" placeholder="Type to search..." />
        <Button variant="outline">Search</Button>
      </ButtonGroup>
    </Field>
  );
}
