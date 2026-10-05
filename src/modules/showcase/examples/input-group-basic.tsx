import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import { InputGroup, InputGroupInput } from "@registry/ui/input-group";

export function InputGroupBasic() {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="input-group-basic-input-default-01">
          Default (No Input Group)
        </FieldLabel>
        <Input placeholder="Placeholder" id="input-group-basic-input-default-01" />
      </Field>
      <Field>
        <FieldLabel htmlFor="input-group-basic-input-group-02">Input Group</FieldLabel>
        <InputGroup>
          <InputGroupInput id="input-group-basic-input-group-02" placeholder="Placeholder" />
        </InputGroup>
      </Field>
      <Field data-disabled="true">
        <FieldLabel htmlFor="input-group-basic-input-disabled-03">Disabled</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-group-basic-input-disabled-03"
            placeholder="This field is disabled"
            disabled
          />
        </InputGroup>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="input-group-basic-input-invalid-04">Invalid</FieldLabel>
        <InputGroup>
          <InputGroupInput
            id="input-group-basic-input-invalid-04"
            placeholder="This field is invalid"
            aria-invalid="true"
          />
        </InputGroup>
      </Field>
    </FieldGroup>
  );
}
