import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from "@registry/ui/field";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";

export function RadioGroupFieldset() {
  return (
    <FieldSet className="w-full max-w-xs">
      <FieldLegend variant="label">Subscription Plan</FieldLegend>
      <FieldDescription>Yearly and lifetime plans offer significant savings.</FieldDescription>
      <RadioGroup defaultValue="monthly">
        <Field orientation="horizontal">
          <RadioGroupItem value="monthly" id="radio-group-fieldset-plan-monthly" />
          <FieldLabel htmlFor="radio-group-fieldset-plan-monthly" className="font-normal">
            Monthly ($9.99/month)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="yearly" id="radio-group-fieldset-plan-yearly" />
          <FieldLabel htmlFor="radio-group-fieldset-plan-yearly" className="font-normal">
            Yearly ($99.99/year)
          </FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="lifetime" id="radio-group-fieldset-plan-lifetime" />
          <FieldLabel htmlFor="radio-group-fieldset-plan-lifetime" className="font-normal">
            Lifetime ($299.99)
          </FieldLabel>
        </Field>
      </RadioGroup>
    </FieldSet>
  );
}
