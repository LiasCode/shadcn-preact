import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Button, buttonVariants } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
import { cn } from "@ui/share/cn";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function BreadcrumbSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@ui/breadcrumb";
  import { Popover, PopoverContent, PopoverTrigger } from "@ui/popover";
  import { buttonVariants } from "@ui/button";

  export function BreadcrumbDemo() {
    return (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <A href="/">Home</A>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <PopoverContent className="grid w-fit grid-cols-1 gap-2 p-1">
                <PopoverTrigger>
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </PopoverTrigger>
                <PopoverContent className="grid grid-cols-1 gap-2 p-1">
                  <BreadcrumbLink
                    asChild
                    className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                  >
                    <A href="/docs">Documentation</A>
                  </BreadcrumbLink>

                  <BreadcrumbLink
                    asChild
                    className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                  >
                    <A href="/docs/themes">Themes</A>
                  </BreadcrumbLink>

                  <BreadcrumbLink
                    className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                    href="https://github.com/LiasCode/shadcn-preact"
                  >
                    GitHub
                  </BreadcrumbLink>
                </PopoverContent>
              </Popover>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <A href="/components/alert">Components</A>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
    )
  }

`}
        previewElement={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href={AppRoutes.HOME}>Home</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Popover
                  alignment="start"
                  side="bottom"
                >
                  <PopoverTrigger>
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </PopoverTrigger>
                  <PopoverContent className="grid w-fit grid-cols-1 gap-2 p-1">
                    <BreadcrumbLink
                      asChild
                      className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                    >
                      <a href={AppRoutes.DOCS.INTRO}>Documentation</a>
                    </BreadcrumbLink>

                    <BreadcrumbLink
                      asChild
                      className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                    >
                      <a href={AppRoutes.DOCS.THEMING}>Themes</a>
                    </BreadcrumbLink>

                    <BreadcrumbLink
                      className={cn(buttonVariants({ variant: "ghost" }), "cursor-pointer justify-start")}
                      href="https://github.com/LiasCode/shadcn-preact"
                    >
                      GitHub
                    </BreadcrumbLink>
                  </PopoverContent>
                </Popover>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <a href={AppRoutes.COMPONENTS.ALERT}>Components</a>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl"> Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@ui/breadcrumb"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/components">Components</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.BADGE}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Badge
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.BUTTON}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Button
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
