import { Button } from "@registry/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@registry/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@registry/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import { MaximizeIcon, MinimizeIcon } from "lucide-preact";
import * as React from "preact/compat";

export function CollapsibleSettings() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Card className="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>Set the corner radius of the element.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="flex items-start gap-2">
          <FieldGroup className="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="collapsible-settings-radius-x" className="sr-only">
                Radius X
              </FieldLabel>
              <Input id="collapsible-settings-radius-x" placeholder="0" defaultValue={0} />
            </Field>
            <Field>
              <FieldLabel htmlFor="collapsible-settings-radius-y" className="sr-only">
                Radius Y
              </FieldLabel>
              <Input id="collapsible-settings-radius-y" placeholder="0" defaultValue={0} />
            </Field>
            <CollapsibleContent className="col-span-full grid grid-cols-subgrid gap-2">
              <Field>
                <FieldLabel htmlFor="collapsible-settings-expanded-radius-x" className="sr-only">
                  Radius X
                </FieldLabel>
                <Input
                  id="collapsible-settings-expanded-radius-x"
                  placeholder="0"
                  defaultValue={0}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="collapsible-settings-expanded-radius-y" className="sr-only">
                  Radius Y
                </FieldLabel>
                <Input
                  id="collapsible-settings-expanded-radius-y"
                  placeholder="0"
                  defaultValue={0}
                />
              </Field>
            </CollapsibleContent>
          </FieldGroup>
          <CollapsibleTrigger render={<Button variant="outline" size="icon" />}>
            {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
