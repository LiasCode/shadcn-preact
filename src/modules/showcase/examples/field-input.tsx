import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export default function FieldInput() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-input-username">Username</FieldLabel>
          <Input id="field-input-username" type="text" placeholder="Max Leiter" />
          <FieldDescription>Choose a unique username for your account.</FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="field-input-password">Password</FieldLabel>
          <FieldDescription>Must be at least 8 characters long.</FieldDescription>
          <Input id="field-input-password" type="password" placeholder="••••••••" />
        </Field>
      </FieldGroup>
    </FieldSet>
  );
}
