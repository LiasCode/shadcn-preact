import { Field, FieldLabel } from "@registry/ui/field";
import { Textarea } from "@registry/ui/textarea";

export function TextareaDisabled() {
  return (
    <Field data-disabled>
      <FieldLabel htmlFor="textarea-disabled-textarea-disabled">Message</FieldLabel>
      <Textarea id="textarea-disabled-textarea-disabled" placeholder="Type your message here." disabled />
    </Field>
  );
}