import { Button } from "@registry/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@registry/ui/card";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@registry/ui/input-group";
import { ExternalLinkIcon, MailIcon } from "lucide-preact";

export function InputGroupInCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Card with Input Group</CardTitle>
        <CardDescription>This is a card with an input group.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="input-group-in-card-email-input">Email Address</FieldLabel>
            <InputGroup>
              <InputGroupInput id="input-group-in-card-email-input" type="email" placeholder="you@example.com" />
              <InputGroupAddon align="inline-end">
                <MailIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-group-in-card-website-input">Website URL</FieldLabel>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="input-group-in-card-website-input" placeholder="example.com" />
              <InputGroupAddon align="inline-end">
                <ExternalLinkIcon />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="input-group-in-card-feedback-textarea">Feedback & Comments</FieldLabel>
            <InputGroup>
              <InputGroupTextarea
                id="input-group-in-card-feedback-textarea"
                placeholder="Share your thoughts..."
                className="min-h-[100px]"
              />
              <InputGroupAddon align="block-end">
                <InputGroupText>0/500 characters</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  );
}