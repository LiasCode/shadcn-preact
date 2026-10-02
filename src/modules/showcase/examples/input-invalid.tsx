import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputInvalid() {
  return (
    <Field data-invalid>
      <FieldLabel htmlFor="input-invalid-input-invalid">Invalid Input</FieldLabel>
      <Input id="input-invalid-input-invalid" placeholder="Error" aria-invalid />
      <FieldDescription>This field contains validation errors.</FieldDescription>
    </Field>
  );
}