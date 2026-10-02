import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="input-disabled-input-demo-disabled">Email</FieldLabel>
      <Input id="input-disabled-input-demo-disabled" type="email" placeholder="Email" disabled />
      <FieldDescription>This field is currently disabled.</FieldDescription>
    </Field>
  );
}