import { Badge } from "@registry/ui/badge";
import { Field, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";

export function InputBadge() {
  return (
    <Field>
      <FieldLabel htmlFor="input-badge-input-badge">
        Webhook URL{" "}
        <Badge variant="secondary" className="ml-auto">
          Beta
        </Badge>
      </FieldLabel>
      <Input id="input-badge-input-badge" type="url" placeholder="https://api.example.com/webhook" />
    </Field>
  );
}