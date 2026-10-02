import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function FieldFieldset() {
  return (
    <FieldSet className="w-full max-w-sm">
      <FieldLegend>Address Information</FieldLegend>
      <FieldDescription>We need your address to deliver your order.</FieldDescription>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="field-fieldset-street">Street Address</FieldLabel>
          <Input id="field-fieldset-street" type="text" placeholder="123 Main St" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel htmlFor="field-fieldset-city">City</FieldLabel>
            <Input id="field-fieldset-city" type="text" placeholder="New York" />
          </Field>
          <Field>
            <FieldLabel htmlFor="field-fieldset-zip">Postal Code</FieldLabel>
            <Input id="field-fieldset-zip" type="text" placeholder="90502" />
          </Field>
        </div>
      </FieldGroup>
    </FieldSet>
  );
}