import { Button } from "@registry/ui/button";
import { Field as FieldLayout } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { useState } from "preact/hooks";

export function FieldValidation() {
  const [submitted, setSubmitted] = useState("");
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-4"
      onFormSubmit={(values) => setSubmitted(String(values.email))}
    >
      <Field.Root name="email" render={<FieldLayout />}>
        <Field.Label className="text-sm font-medium">Email for updates</Field.Label>
        <Field.Description className="text-sm text-muted-foreground">
          Enter a valid email address to try form validation.
        </Field.Description>
        <Input type="email" required placeholder="you@example.com" />
        <Field.Error className="text-sm text-destructive" />
      </Field.Root>
      <div className="flex gap-2">
        <Button type="submit">Subscribe</Button>
        <Button type="reset" variant="outline" onClick={() => setSubmitted("")}>
          Reset
        </Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {submitted ? `Submitted: ${submitted}` : ""}
      </p>
    </Form>
  );
}
