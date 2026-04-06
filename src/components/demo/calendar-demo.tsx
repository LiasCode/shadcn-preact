import { Calendar } from "@/components/ui/calendar";
import { Button } from "@ui/button";
import { Card, CardContent, CardFooter } from "@ui/card";
import { addDays } from "date-fns";
import { useState } from "preact/hooks";
import type { DateRange } from "react-day-picker";

export function CalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex flex-row flex-wrap gap-8">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm"
        captionLayout="dropdown"
      />

      <Calendar
        mode="single"
        className="rounded-lg border"
      />

      <CalendarRange />

      <CalendarWithPresets />
    </div>
  );
}

export function CalendarRange() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });
  return (
    <Card className="h-fit w-fit p-0">
      <CardContent className="p-0">
        <Calendar
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          numberOfMonths={2}
          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
        />
      </CardContent>
    </Card>
  );
}

export function CalendarWithPresets() {
  const [date, setDate] = useState<Date | undefined>(new Date(new Date().getFullYear(), 1, 12));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

  return (
    <Card
      className="w-fit max-w-75"
      size="sm"
    >
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          fixedWeeks
          className="p-0 [--cell-size:--spacing(9.5)]"
        />
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t">
        {[
          { label: "Today", value: 0 },
          { label: "Tomorrow", value: 1 },
          { label: "In 3 days", value: 3 },
          { label: "In a week", value: 7 },
          { label: "In 2 weeks", value: 14 },
        ].map((preset) => (
          <Button
            key={preset.value}
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => {
              const newDate = addDays(new Date(), preset.value);
              setDate(newDate);
              setCurrentMonth(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
            }}
          >
            {preset.label}
          </Button>
        ))}
      </CardFooter>
    </Card>
  );
}
