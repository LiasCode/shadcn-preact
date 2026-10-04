import { Button } from "@registry/ui/button";
import { Checkbox } from "@registry/ui/checkbox";
import { Field as FieldLayout } from "@registry/ui/field";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";
import { Switch } from "@registry/ui/switch";
import { useState } from "preact/hooks";

export function FieldSelectionValidation() {
  const [submitted, setSubmitted] = useState("");
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-4"
      onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
    >
      <Field.Root name="plan" render={<FieldLayout />}>
        <Field.Label className="text-sm font-medium">Subscription plan</Field.Label>
        <RadioGroup required aria-label="Subscription plan">
          <label className="flex items-center gap-2">
            <RadioGroupItem value="basic" />
            Basic
          </label>
          <label className="flex items-center gap-2">
            <RadioGroupItem value="pro" />
            Pro
          </label>
        </RadioGroup>
        <Field.Error className="text-sm text-destructive" />
      </Field.Root>
      <Field.Root name="terms" render={<FieldLayout />}>
        <div className="flex items-center gap-2">
          <Checkbox required />
          <Field.Label className="text-sm font-medium">Accept terms</Field.Label>
        </div>
        <Field.Error className="text-sm text-destructive" />
      </Field.Root>
      <Field.Root name="updates" render={<FieldLayout />}>
        <div className="flex items-center gap-2">
          <Switch />
          <Field.Label className="text-sm font-medium">Receive updates</Field.Label>
        </div>
      </Field.Root>
      <div className="flex gap-2">
        <Button type="submit">Save preferences</Button>
        <Button type="reset" variant="outline" onClick={() => setSubmitted("")}>
          Reset preferences
        </Button>
      </div>
      <p role="status" className="text-sm break-all text-muted-foreground">
        {submitted}
      </p>
    </Form>
  );
}