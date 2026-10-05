import { Field, FieldLabel } from "@registry/ui/field";
import { Switch } from "@registry/ui/switch";

export function SwitchDisabled() {
  return (
    <Field orientation="horizontal" data-disabled className="w-fit">
      <Switch id="switch-disabled-switch-disabled-unchecked" disabled />
      <FieldLabel htmlFor="switch-disabled-switch-disabled-unchecked">Disabled</FieldLabel>
    </Field>
  );
}
