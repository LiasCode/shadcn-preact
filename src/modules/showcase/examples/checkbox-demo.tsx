import { Checkbox } from "@registry/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@registry/ui/field";
import { Label } from "@registry/ui/label";

export default function CheckboxDemo() {
  return (
    <FieldGroup className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="checkbox-demo-terms-checkbox" name="terms-checkbox" />
        <Label htmlFor="checkbox-demo-terms-checkbox">Accept terms and conditions</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-demo-terms-checkbox-2" name="terms-checkbox-2" defaultChecked />
        <FieldContent>
          <FieldLabel htmlFor="checkbox-demo-terms-checkbox-2">Accept terms and conditions</FieldLabel>
          <FieldDescription>By clicking this checkbox, you agree to the terms.</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="checkbox-demo-toggle-checkbox" name="toggle-checkbox" disabled />
        <FieldLabel htmlFor="checkbox-demo-toggle-checkbox">Enable notifications</FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="checkbox-demo-toggle-checkbox-2" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  );
}