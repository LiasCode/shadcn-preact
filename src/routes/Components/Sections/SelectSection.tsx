import { AppRoutes } from "@/routes/AppRoutes";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { AlertCircle, ChevronLeft, ChevronRight } from "lucide-preact";
import { A } from "preact-hashish-router";

export function SelectSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <Alert className="border-yellow-400">
        <AlertCircle className="h-4 w-4" color="#facc15" />
        <AlertTitle>Page under construction</AlertTitle>
        <AlertDescription>Select component guide page is on work in progress.</AlertDescription>
      </Alert>

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
