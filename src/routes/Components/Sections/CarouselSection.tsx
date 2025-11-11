import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Card, CardContent } from "@ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@ui/carousel";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function CarouselSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Card, CardContent } from "@ui/card"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@ui/carousel"

  export function CarouselDemo() {
    return (
      <Carousel className="w-full max-w-xs">
        <CarouselContent>
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }

`}
        previewElement={
          <Carousel className="w-44 max-w-xs md:w-full">
            <CarouselContent>
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="font-semibold text-4xl">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-xl">About</h2>

      <p class="leading-[1.65rem] [&amp;:not(:first-child)]:mt-6">
        The carousel component is built using the{" "}
        <a
          class="font-medium underline underline-offset-4"
          href="https://www.embla-carousel.com/"
        >
          Embla Carousel
        </a>{" "}
        library.
      </p>

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@ui/carousel"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Carousel>
    <CarouselContent>
      <CarouselItem>...</CarouselItem>
      <CarouselItem>...</CarouselItem>
      <CarouselItem>...</CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Orientation</h2>

      <p class="leading-[1.65rem] [&amp;:not(:first-child)]:mt-6">
        Use the <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">orientation</code>{" "}
        prop to set the orientation of the carousel.
      </p>

      <CodePreviewTabs
        codeString={`
  import { Card, CardContent } from "@ui/card"
  import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@ui/carousel"

  export function CarouselOrientation() {
    return (
      <Carousel
        opts={{
          align: "start",
        }}
        orientation="vertical"
        className="w-full max-w-xs"
      >
        <CarouselContent className="-mt-1 h-[200px]">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index} className="pt-1 md:basis-1/2">
              <div className="p-1">
                <Card>
                  <CardContent className="flex items-center justify-center p-6">
                    <span className="text-3xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    )
  }

`}
        previewElement={
          <Carousel
            opts={{
              align: "start",
            }}
            orientation="vertical"
            className="w-full max-w-xs"
          >
            <CarouselContent className="-mt-1 h-[200px]">
              {Array.from({ length: 5 }).map((_, index) => (
                <CarouselItem
                  key={index}
                  className="pt-1 md:basis-1/2"
                >
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex items-center justify-center p-6">
                        <span className="font-semibold text-3xl">{index + 1}</span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Plugins</h2>

      <p class="leading-[1.65rem] [&amp;:not(:first-child)]:mt-6">
        You can use the <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">plugins</code>{" "}
        prop to add plugins to the carousel.
      </p>

      <HighlightCode
        lang="tsx"
        codeString={`
  import Autoplay from "embla-carousel-autoplay"

  export function Example() {
    return (
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
      >
        // ...
      </Carousel>
    )
  }

`}
      />

      <p class="leading-[1.65rem] [&amp;:not(:first-child)]:mt-6">
        See the{" "}
        <a
          class="font-medium underline underline-offset-4"
          href="https://www.embla-carousel.com/api/plugins/"
        >
          Embla Carousel docs
        </a>{" "}
        for more information on using plugins.
      </p>

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CARD}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Card
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CHART}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Charts
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
