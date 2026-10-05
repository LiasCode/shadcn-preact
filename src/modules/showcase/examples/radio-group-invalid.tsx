import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@registry/ui/field";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";

export function RadioGroupInvalid() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Notification Preferences</FieldLegend>
      <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
      <RadioGroup defaultValue="email">
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="email" id="radio-group-invalid-invalid-email" aria-invalid />
          <FieldLabel htmlFor="radio-group-invalid-invalid-email" className="font-normal">
            Email only
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="sms" id="radio-group-invalid-invalid-sms" aria-invalid />
          <FieldLabel htmlFor="radio-group-invalid-invalid-sms" className="font-normal">
            SMS only
          </FieldLabel>
        </Field>
        <Field orientation="horizontal" data-invalid>
          <RadioGroupItem value="both" id="radio-group-invalid-invalid-both" aria-invalid />
          <FieldLabel htmlFor="radio-group-invalid-invalid-both" className="font-normal">
            Both Email & SMS
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}
