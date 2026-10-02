import { Checkbox } from "@registry/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";

export function CheckboxInvalid() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="checkbox-invalid-terms-checkbox-invalid" name="terms-checkbox-invalid" aria-invalid />
        <FieldLabel htmlFor="checkbox-invalid-terms-checkbox-invalid">Accept terms and conditions</FieldLabel>
      </Field>
    </FieldGroup>
  );
}