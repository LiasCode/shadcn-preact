import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Switch } from "@registry/ui/switch";

export function SwitchSizes() {
  return (
    <FieldGroup className="w-full max-w-[10rem]">
      <Field orientation="horizontal">
        <Switch id="switch-sizes-switch-size-sm" size="sm" />
        <FieldLabel htmlFor="switch-sizes-switch-size-sm">Small</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-sizes-switch-size-default" size="default" />
        <FieldLabel htmlFor="switch-sizes-switch-size-default">Default</FieldLabel>
      </Field>
    </FieldGroup>
  );
}