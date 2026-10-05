import { Button } from "@registry/ui/button";
import { Field } from "@registry/ui/primitives/field";
import { Fieldset } from "@registry/ui/primitives/fieldset";
import { Form } from "@registry/ui/primitives/form";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";
import { useState } from "preact/hooks";

export function FieldItemScopes() {
  const [disabled, setDisabled] = useState(false);
  const [submitted, setSubmitted] = useState("");
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Button variant="outline" onClick={() => setDisabled((value) => !value)}>
        {disabled ? "Enable contact options" : "Disable contact options"}
      </Button>
      <Form
        className="flex flex-col gap-4"
        onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
      >
        <Fieldset.Root disabled={disabled} className="flex flex-col gap-4 rounded-lg border p-4">
          <Fieldset.Legend className="text-sm font-medium">Contact preferences</Fieldset.Legend>
          <Field.Root name="contact">
            <Field.Label className="mb-3 block text-sm font-medium">
              Preferred contact method
            </Field.Label>
            <RadioGroup required>
              <Field.Item className="flex items-start gap-2">
                <RadioGroupItem value="email" className="mt-1" />
                <div>
                  <Field.Label className="text-sm font-medium">Email contact</Field.Label>
                  <Field.Description className="text-sm text-muted-foreground">
                    Receive a message in your inbox.
                  </Field.Description>
                </div>
              </Field.Item>
              <Field.Item className="flex items-start gap-2">
                <RadioGroupItem value="phone" className="mt-1" />
                <div>
                  <Field.Label className="text-sm font-medium">Phone contact</Field.Label>
                  <Field.Description className="text-sm text-muted-foreground">
                    Request a callback.
                  </Field.Description>
                </div>
              </Field.Item>
              <Field.Item disabled className="flex items-start gap-2 opacity-50">
                <RadioGroupItem value="post" className="mt-1" />
                <div>
                  <Field.Label className="text-sm font-medium">Postal contact</Field.Label>
                  <Field.Description className="text-sm text-muted-foreground">
                    Currently unavailable.
                  </Field.Description>
                </div>
              </Field.Item>
            </RadioGroup>
            <div className="min-h-5">
              <Field.Error className="text-sm text-destructive" />
            </div>
          </Field.Root>
        </Fieldset.Root>
        <Button type="submit">Save contact method</Button>
        <p role="status" className="text-sm text-muted-foreground">
          {submitted}
        </p>
      </Form>
    </div>
  );
}
