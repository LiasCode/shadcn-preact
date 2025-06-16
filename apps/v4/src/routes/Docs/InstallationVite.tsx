import { DocsLayout } from "@/components/Layout/DocsLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
import { Suspense, lazy } from "preact/compat";
import { AppRoutes } from "../AppRoutes";

const InstallationGuideVite = lazy(() => import("../../components/InstallationForVite"));

export default function InstallationVitePage() {
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
              <BreadcrumbPage>Vite</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      title="Vite Installation"
      description="How to install dependencies and structure your app with vite."
    >
      <Suspense
        fallback={
          <div className="flex w-full flex-col items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <InstallationGuideVite />
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
