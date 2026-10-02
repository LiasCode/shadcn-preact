import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputField() {
  return (
    <Field>
      <FieldLabel htmlFor="input-field-input-field-username">Username</FieldLabel>
      <Input id="input-field-input-field-username" type="text" placeholder="Enter your username" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  );
}