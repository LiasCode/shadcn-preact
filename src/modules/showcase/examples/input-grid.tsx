import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputGrid() {
  return (
    <FieldGroup className="grid max-w-sm grid-cols-2">
      <Field>
        <FieldLabel htmlFor="input-grid-first-name">First Name</FieldLabel>
        <Input id="input-grid-first-name" placeholder="Jordan" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-grid-last-name">Last Name</FieldLabel>
        <Input id="input-grid-last-name" placeholder="Lee" />
      </Field>
    </FieldGroup>
  );
}
