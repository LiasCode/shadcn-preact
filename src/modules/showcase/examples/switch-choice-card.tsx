import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@registry/ui/field";
import { Switch } from "@registry/ui/switch";

export function SwitchChoiceCard() {
  return (
    <FieldGroup className="w-full max-w-sm">
      <FieldLabel htmlFor="switch-choice-card-switch-share">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Share across devices</FieldTitle>
            <FieldDescription>Focus is shared across devices, and turns off when you leave the app.</FieldDescription>
          </FieldContent>
          <Switch id="switch-choice-card-switch-share" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="switch-choice-card-switch-notifications">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>Receive notifications when focus mode is enabled or disabled.</FieldDescription>
          </FieldContent>
          <Switch id="switch-choice-card-switch-notifications" defaultChecked />
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}