import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import Example0 from "../examples/calendar-basic";
import { CalendarBookedDates as Example1 } from "../examples/calendar-booked-dates";
import { CalendarCaption as Example2 } from "../examples/calendar-caption";
import { CalendarCustomDays as Example3 } from "../examples/calendar-custom-days";
import Example4 from "../examples/calendar-demo";
import { CalendarMultiple as Example5 } from "../examples/calendar-multiple";
import { CalendarWithPresets as Example6 } from "../examples/calendar-presets";
import { CalendarRange as Example7 } from "../examples/calendar-range";
import { CalendarWithTime as Example8 } from "../examples/calendar-time";
import { CalendarWeekNumbers as Example9 } from "../examples/calendar-week-numbers";
const examples = [
  ["Basic", Example0],
  ["Booked dates", Example1],
  ["Caption", Example2],
  ["Custom days", Example3],
  ["Demo", Example4],
  ["Multiple", Example5],
  ["Presets", Example6],
  ["Range", Example7],
  ["Time", Example8],
  ["Week numbers", Example9],
] as const;

export function CalendarDemo() {
  const [selected, setSelected] = useState(0);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Calendar example"
        value={String(selected)}
        onChange={(event) => setSelected(Number(event.currentTarget.value))}
      >
        {examples.map(([name], index) => (
          <NativeSelectOption key={name} value={String(index)}>
            {name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="relative w-full min-w-0 overflow-x-auto">
        <Example />
      </div>
    </div>
  );
}
