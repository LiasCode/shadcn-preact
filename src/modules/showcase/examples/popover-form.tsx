import { Button } from "@registry/ui/button";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@registry/ui/popover";

export function PopoverForm() {
  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>Open Popover</PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <PopoverHeader>
            <PopoverTitle>Dimensions</PopoverTitle>
            <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
          </PopoverHeader>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <FieldLabel htmlFor="popover-form-width" className="w-1/2">
                Width
              </FieldLabel>
              <Input id="popover-form-width" defaultValue="100%" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="popover-form-height" className="w-1/2">
                Height
              </FieldLabel>
              <Input id="popover-form-height" defaultValue="25px" />
            </Field>
          </FieldGroup>
        </PopoverContent>
      </Popover>
    </>
  );
}