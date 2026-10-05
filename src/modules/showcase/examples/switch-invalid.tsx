import { Field, FieldContent, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Switch } from "@registry/ui/switch";

export function SwitchInvalid() {
  return (
    <Field orientation="horizontal" className="max-w-sm" data-invalid>
      <FieldContent>
        <FieldLabel htmlFor="switch-invalid-switch-terms">Accept terms and conditions</FieldLabel>
        <FieldDescription>You must accept the terms and conditions to continue.</FieldDescription>
      </FieldContent>
      <Switch id="switch-invalid-switch-terms" aria-invalid />
    </Field>
  );
}
