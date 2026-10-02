import { Checkbox } from "@registry/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";

export function CheckboxBasic() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-basic-terms-checkbox-basic" name="terms-checkbox-basic" />
        <FieldLabel htmlFor="checkbox-basic-terms-checkbox-basic">Accept terms and conditions</FieldLabel>
      </Field>
    </FieldGroup>
  );
}