import { AppRoutes } from "@/routes/AppRoutes";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@ui/select";
import { AlertCircle, Apple, ChevronLeft, ChevronRight, Sun } from "lucide-preact";
import { A } from "preact-hashish-router";

export function SelectSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Alert className="border-yellow-400">
        <AlertCircle className="h-4 w-4" color="#facc15" />
        <AlertTitle>Page under construction</AlertTitle>
        <AlertDescription>Select component guide page is on work in progress.</AlertDescription>
      </Alert>

      <Select defaultValue="blueberry">
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel className="flex flex-row items-center gap-2 [&_svg]:h-4 [&_svg]:w-4">
              Fruits
              <Apple />
            </SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
            <SelectItem value="pineapple">Pineapple</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="flex flex-row items-center gap-2 [&_svg]:h-4 [&_svg]:w-4">
              Theme <Sun />
            </SelectLabel>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <A href={AppRoutes.COMPONENTS.POPOVER}>
              <Button className="gap-1 pl-1" variant="outline">
                <ChevronLeft />
                Popover
              </Button>
            </A>
          </PaginationItem>
          <PaginationItem>
            <A href={AppRoutes.COMPONENTS.SHEET}>
              <Button className="gap-1 pr-1 capitalize" variant="outline">
                Sheet
                <ChevronRight />
              </Button>
            </A>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
