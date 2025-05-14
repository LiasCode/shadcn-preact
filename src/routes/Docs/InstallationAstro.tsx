import { DocsLayout } from "@/components/Layout/DocsLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@ui/breadcrumb";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";

import { ChevronLeft, ChevronRight } from "lucide-preact";
import { AppRoutes } from "../AppRoutes";
import { lazy, Suspense } from "preact/compat";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const InstallationGuideAstro = lazy(() => import("../../components/InstallationForAstro"));

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
      title="Setting Up an Astro Project with Preact and Tailwind CSS"
      description="This guide will walk you through creating an Astro project with Preact integration and Tailwind CSS for styling."
    >
      <Suspense
        fallback={
          <div className="flex w-full flex-col items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <InstallationGuideAstro />
      </Suspense>
      
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
