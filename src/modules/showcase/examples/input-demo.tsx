import { Field, FieldDescription, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputDemo() {
  return (
    <Field>
      <FieldLabel htmlFor="input-demo-input-demo-api-key">API Key</FieldLabel>
      <Input id="input-demo-input-demo-api-key" type="password" placeholder="sk-..." />
      <FieldDescription>Your API key is encrypted and stored securely.</FieldDescription>
    </Field>
  );
}
