import { Field, FieldLabel } from "@registry/ui/field";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";

export function RadioGroupDisabled() {
  return (
    <RadioGroup defaultValue="option2" className="w-fit">
      <Field orientation="horizontal" data-disabled>
        <RadioGroupItem value="option1" id="radio-group-disabled-disabled-1" disabled />
        <FieldLabel htmlFor="radio-group-disabled-disabled-1" className="font-normal">
          Disabled
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option2" id="radio-group-disabled-disabled-2" />
        <FieldLabel htmlFor="radio-group-disabled-disabled-2" className="font-normal">
          Option 2
        </FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="option3" id="radio-group-disabled-disabled-3" />
        <FieldLabel htmlFor="radio-group-disabled-disabled-3" className="font-normal">
          Option 3
        </FieldLabel>
      </Field>
    </RadioGroup>
  );
}