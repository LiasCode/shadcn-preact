import { Field, FieldContent, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Switch } from "@registry/ui/switch";

export function SwitchDescription() {
  return (
    <Field orientation="horizontal" className="max-w-sm">
      <FieldContent>
        <FieldLabel htmlFor="switch-description-switch-focus-mode">Share across devices</FieldLabel>
        <FieldDescription>Focus is shared across devices, and turns off when you leave the app.</FieldDescription>
      </FieldContent>
      <Switch id="switch-description-switch-focus-mode" />
    </Field>
  );
}