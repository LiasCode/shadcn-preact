import { Button } from "@registry/ui/button";
import { Field as FieldLayout } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { useState } from "preact/hooks";

export function FieldBlurValidation() {
  const [submitted, setSubmitted] = useState("");
  return (
    <Form
      validationMode="onBlur"
      className="flex w-full max-w-sm flex-col gap-4"
      onFormSubmit={(values) => setSubmitted(String(values.username))}
    >
      <Field.Root
        name="username"
        render={<FieldLayout />}
        validate={(value) => (value === "admin" ? "This username is reserved." : null)}
      >
        <Field.Label className="text-sm font-medium">Username checked on blur</Field.Label>
        <Field.Description className="text-sm text-muted-foreground">
          Use at least three lowercase letters. Try admin to see custom validation.
        </Field.Description>
        <Input required pattern="[a-z]{3,}" placeholder="yourname" />
        <div className="min-h-5">
          <Field.Error className="text-sm text-destructive" />
        </div>
      </Field.Root>
      <div className="flex gap-2">
        <Button type="submit">Save username</Button>
        <Button type="reset" variant="outline" onClick={() => setSubmitted("")}>
          Reset username
        </Button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">
        {submitted ? `Saved username: ${submitted}` : ""}
      </p>
    </Form>
  );
}