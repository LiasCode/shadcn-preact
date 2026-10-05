import { Button } from "@registry/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@registry/ui/combobox";
import { Field as FieldLayout } from "@registry/ui/field";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@registry/ui/select";
import { Slider } from "@registry/ui/slider";
import { useState } from "preact/hooks";

const cities = ["London", "Madrid", "Paris"];

export function FieldCompositeValidation() {
  const [submitted, setSubmitted] = useState("");
  return (
    <Form
      className="flex w-full max-w-sm flex-col gap-4"
      validationMode="onBlur"
      onFormSubmit={(values) => setSubmitted(JSON.stringify(values))}
    >
      <Field.Root name="delivery" render={<FieldLayout />}>
        <Field.Label className="text-sm font-medium">Delivery speed</Field.Label>
        <Select required items={{ standard: "Standard", express: "Express" }}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose delivery" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="express">Express</SelectItem>
          </SelectContent>
        </Select>
        <div className="min-h-5">
          <Field.Error className="text-sm text-destructive" />
        </div>
      </Field.Root>
      <Field.Root name="city" render={<FieldLayout />}>
        <Field.Label className="text-sm font-medium">Destination city</Field.Label>
        <Combobox required items={cities}>
          <ComboboxInput placeholder="Choose a destination" />
          <ComboboxContent>
            <ComboboxList>
              {(city) => (
                <ComboboxItem key={city} value={city}>
                  {city}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <div className="min-h-5">
          <Field.Error className="text-sm text-destructive" />
        </div>
      </Field.Root>
      <Field.Root
        name="budget"
        render={<FieldLayout />}
        validate={(value) => ((value as number[])[0]! < 10 ? "Budget must be at least 10." : null)}
      >
        <Field.Label className="text-sm font-medium">Delivery budget</Field.Label>
        <Slider defaultValue={[20]} />
        <div className="min-h-5">
          <Field.Error className="text-sm text-destructive" />
        </div>
      </Field.Root>
      <div className="flex gap-2">
        <Button type="submit">Save delivery</Button>
        <Button type="reset" variant="outline" onClick={() => setSubmitted("")}>
          Reset delivery
        </Button>
      </div>
      <p role="status" className="text-sm break-all text-muted-foreground">
        {submitted}
      </p>
    </Form>
  );
}
