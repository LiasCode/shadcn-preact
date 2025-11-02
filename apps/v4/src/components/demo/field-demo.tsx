import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { Textarea } from "@/components/ui/textarea";

export function FieldDemo() {
  return (
    <div className="w-full max-w-md">
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Payment Method</FieldLegend>
            <FieldDescription>All transactions are secure and encrypted</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-name-43j">Name on Card</FieldLabel>
                <Input
                  id="checkout-7j9-card-name-43j"
                  placeholder="Evil Rabbit"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-card-number-uw1">Card Number</FieldLabel>
                <Input
                  id="checkout-7j9-card-number-uw1"
                  placeholder="1234 5678 9012 3456"
                  required
                />
                <FieldDescription>Enter your 16-digit card number</FieldDescription>
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel htmlFor="checkout-exp-month-ts6">Month</FieldLabel>
                  <NativeSelect defaultValue="">
                    <NativeSelectOption value="01">01</NativeSelectOption>
                    <NativeSelectOption value="02">02</NativeSelectOption>
                    <NativeSelectOption value="03">03</NativeSelectOption>
                    <NativeSelectOption value="04">04</NativeSelectOption>
                    <NativeSelectOption value="05">05</NativeSelectOption>
                    <NativeSelectOption value="06">06</NativeSelectOption>
                    <NativeSelectOption value="07">07</NativeSelectOption>
                    <NativeSelectOption value="08">08</NativeSelectOption>
                    <NativeSelectOption value="09">09</NativeSelectOption>
                    <NativeSelectOption value="10">10</NativeSelectOption>
                    <NativeSelectOption value="11">11</NativeSelectOption>
                    <NativeSelectOption value="12">12</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-exp-year-f59">Year</FieldLabel>
                  <NativeSelect defaultValue="">
                    <NativeSelectOption value="2024">2024</NativeSelectOption>
                    <NativeSelectOption value="2025">2025</NativeSelectOption>
                    <NativeSelectOption value="2026">2026</NativeSelectOption>
                    <NativeSelectOption value="2027">2027</NativeSelectOption>
                    <NativeSelectOption value="2028">2028</NativeSelectOption>
                    <NativeSelectOption value="2029">2029</NativeSelectOption>
                  </NativeSelect>
                </Field>
                <Field>
                  <FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
                  <Input
                    id="checkout-7j9-cvv"
                    placeholder="123"
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <FieldSet>
            <FieldLegend>Billing Address</FieldLegend>
            <FieldDescription>The billing address associated with your payment method</FieldDescription>
          </FieldSet>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="checkout-7j9-optional-comments">Comments</FieldLabel>
                <Textarea
                  id="checkout-7j9-optional-comments"
                  placeholder="Add any additional comments"
                  className="resize-none"
                />
              </Field>
            </FieldGroup>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">Submit</Button>
            <Button
              variant="outline"
              type="button"
            >
              Cancel
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
