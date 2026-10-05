import { Calendar } from "@registry/ui/calendar";
import { Card, CardContent, CardFooter } from "@registry/ui/card";
import { Field, FieldGroup, FieldLabel } from "@registry/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/ui/input-group";
import { Clock2Icon } from "lucide-preact";
import * as React from "preact/compat";

export function CalendarWithTime() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  return (
    <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar mode="single" selected={date} onSelect={setDate} className="p-0" />
      </CardContent>
      <CardFooter className="border-t bg-card">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="calendar-time-time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="calendar-time-time-from"
                type="time"
                step="1"
                defaultValue="10:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="calendar-time-time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="calendar-time-time-to"
                type="time"
                step="1"
                defaultValue="12:30:00"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
  );
}
