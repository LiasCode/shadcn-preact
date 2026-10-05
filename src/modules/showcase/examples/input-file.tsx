import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputFile() {
  return (
    <Field>
      <FieldLabel htmlFor="input-file-picture">Picture</FieldLabel>
      <Input id="input-file-picture" type="file" />
      <FieldDescription>Select a picture to upload.</FieldDescription>
    </Field>
  );
}
