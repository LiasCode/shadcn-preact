import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { AreaChartDemo1 } from "./Charts/AreaChartDemo1";
import { BarChartDemo1 } from "./Charts/BarChartDemo1";
import { PieChartDemo1 } from "./Charts/PieChartDemo1";

export default function ChartSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PieChartDemo1 />
      <BarChartDemo1 />
      <AreaChartDemo1 />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CAROUSEL}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Carousel
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CHECKBOX}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Checkbox
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
