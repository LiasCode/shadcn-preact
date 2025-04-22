import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { Calendar } from "@ui/calendar";
import { Label } from "@ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { cn } from "@ui/share/cn";
import { format } from "date-fns";
import { AlertCircle, CalendarIcon, ChevronLeft, ChevronRight } from "lucide-preact";
import { useState } from "preact/hooks";

export default function CalendarSection() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Calendar } from "@ui/calendar"
  import { useState } from "preact/hooks"
   
  export function CalendarDemo() {
    const [date, setDate] = useState<Date | undefined>(new Date())
   
    return (
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow"
            />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-xl">About</h2>

      <p>
        The Calendar component is built on top of
        <a
          className="ml-2 underline"
          href="https://daypicker.dev/"
          target="_blank"
          rel="noreferrer"
        >
          React DayPicker
        </a>
        .
      </p>

      <Alert className="my-4 max-w-[720px]">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>React DayPicker version</AlertTitle>
        <AlertDescription>
          This calendar component is not fully compatible with the original shadcn calendar component. In order to use
          the latest version of React DatePicker, we are using a custom component.
        </AlertDescription>
      </Alert>

      <h2>
        All credit of this components goes to{" "}
        <a
          className="underline"
          href="https://github.com/flixlix/shadcn-date-picker"
          target="_blank"
          rel="noreferrer"
        >
          flixlix
        </a>
        .
      </h2>

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Calendar } from "@ui/calendar"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  )

`}
      />

      <p class="">
        See the{" "}
        <a
          class="font-medium underline underline-offset-4"
          href="https://daypicker.dev/"
        >
          React DayPicker
        </a>{" "}
        documentation for more information.
      </p>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button";
  import { Calendar } from "@ui/calendar";
  import { Label } from "@ui/label";
  import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
  import { cn } from "@ui/share/cn";
  import { useState } from "preact/hooks";
  import { format } from "date-fns";

  const CalendarExample = () => {
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    return (
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <div className="flex flex-col gap-2">
          <Label>Date of birth</Label>
          <Popover alignment="start" open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
             <Button variant={"outline"} className={cn("w-[240px] pl-3 text-left font-normal", date === undefined && "text-muted-foreground")}>
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  setDate(d);
                  setIsPopoverOpen(false);
                }}
                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
              />
            </PopoverContent>
          </Popover>
          <p>Your date of birth is used to calculate your age.</p>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    );
  };

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 px-4 *:max-w-screen-md">
            <CalendarExample />
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.BUTTON}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Button
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CARD}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Card
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

const CalendarExample = () => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="space-y-8"
    >
      <div className="flex flex-col gap-2">
        <Label>Date of birth</Label>
        <Popover
          alignment="start"
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("w-[240px] pl-3 text-left font-normal", date === undefined && "text-muted-foreground")}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setIsPopoverOpen(false);
              }}
              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
            />
          </PopoverContent>
        </Popover>
        <p>Your date of birth is used to calculate your age.</p>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
};
