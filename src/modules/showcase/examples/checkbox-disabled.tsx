import { Checkbox } from "@registry/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";

export function CheckboxDisabled() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="checkbox-disabled-toggle-checkbox-disabled" name="toggle-checkbox-disabled" disabled />
        <FieldLabel htmlFor="checkbox-disabled-toggle-checkbox-disabled">Enable notifications</FieldLabel>
      </Field>
    </FieldGroup>
  );
}