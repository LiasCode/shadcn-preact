import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputRequired() {
  return (
    <Field>
      <FieldLabel htmlFor="input-required-input-required">
        Required Field <span className="text-destructive">*</span>
      </FieldLabel>
      <Input id="input-required-input-required" placeholder="This field is required" required />
      <FieldDescription>This field must be filled out.</FieldDescription>
    </Field>
  );
}
