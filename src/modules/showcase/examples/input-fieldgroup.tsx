import { Button } from "@registry/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputFieldgroup() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-fieldgroup-fieldgroup-name">Name</FieldLabel>
        <Input id="input-fieldgroup-fieldgroup-name" placeholder="Jordan Lee" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-fieldgroup-fieldgroup-email">Email</FieldLabel>
        <Input id="input-fieldgroup-fieldgroup-email" type="email" placeholder="name@example.com" />
        <FieldDescription>We&apos;ll send updates to this address.</FieldDescription>
      </Field>
      <Field orientation="horizontal">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Submit</Button>
      </Field>
    </FieldGroup>
  );
}