import { Calendar } from "@registry/ui/calendar";
import { Card, CardContent } from "@registry/ui/card";
import * as React from "preact/compat";

export function CalendarWeekNumbers() {
  const [date, setDate] = React.useState<Date | undefined>(new Date(new Date().getFullYear(), 0, 12));

  return (
    <Card className="mx-auto w-fit p-0">
      <CardContent className="p-0">
        <Calendar mode="single" defaultMonth={date} selected={date} onSelect={setDate} showWeekNumber />
      </CardContent>
    </Card>
  );
}