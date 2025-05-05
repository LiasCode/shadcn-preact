import { DocsLayout } from "@/components/Layout/DocsLayout";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadCrumb";
import { Button, buttonVariants } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { cn } from "@ui/share/cn";
import { AlertCircle, ChevronLeft, ChevronRight, ExternalLink } from "lucide-preact";
import { AppRoutes } from "../AppRoutes";

export default function InstallationAstroPage() {
  return (
    <DocsLayout
      breadcrumbs={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href={AppRoutes.DOCS.INTRO}>Docs</a>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href={AppRoutes.DOCS.INSTALLATION}>Installation</a>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Astro</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      title="Astro Installation"
      description="How to install dependencies and structure your app with Astro."
    >
      <Alert className="border-yellow-400">
        <AlertCircle
          className="h-4 w-4"
          color="#facc15"
        />
        <AlertTitle>Page under construction</AlertTitle>
        <AlertDescription>Astro guide page is on work in progress.</AlertDescription>
      </Alert>

      <div className="my-4 flex w-full flex-col">
        <a
          className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "w-fit font-normal")}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/LiasCode/shadcn-preact/blob/main/docs/astro-installation.md"
        >
          See this guide
          <ExternalLink />
        </a>
      </div>

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.DOCS.INSTALLATION}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Installation
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.DOCS.THEMING}>
              <Button
                className="gap-1 pr-1"
                variant="outline"
              >
                Theming
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DocsLayout>
  );
}
