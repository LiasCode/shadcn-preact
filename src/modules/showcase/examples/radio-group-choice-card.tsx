import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@registry/ui/field";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";

export function RadioGroupChoiceCard() {
  return (
    <RadioGroup defaultValue="plus" className="max-w-sm">
      <FieldLabel htmlFor="radio-group-choice-card-plus-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Plus</FieldTitle>
            <FieldDescription>For individuals and small teams.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="plus" id="radio-group-choice-card-plus-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="radio-group-choice-card-pro-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Pro</FieldTitle>
            <FieldDescription>For growing businesses.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="pro" id="radio-group-choice-card-pro-plan" />
        </Field>
      </FieldLabel>
      <FieldLabel htmlFor="radio-group-choice-card-enterprise-plan">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Enterprise</FieldTitle>
            <FieldDescription>For large teams and enterprises.</FieldDescription>
          </FieldContent>
          <RadioGroupItem value="enterprise" id="radio-group-choice-card-enterprise-plan" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  );
}