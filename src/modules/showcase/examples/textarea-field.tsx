import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Textarea } from "@registry/ui/textarea";

export function TextareaField() {
  return (
    <Field>
      <FieldLabel htmlFor="textarea-field-textarea-message">Message</FieldLabel>
      <FieldDescription>Enter your message below.</FieldDescription>
      <Textarea id="textarea-field-textarea-message" placeholder="Type your message here." />
    </Field>
  );
}
