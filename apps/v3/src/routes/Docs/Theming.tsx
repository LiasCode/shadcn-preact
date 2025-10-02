import { DocsLayout } from "@/components/Layout/DocsLayout";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-preact";
import { AppRoutes } from "../AppRoutes";

export default function ThemingPage() {
  const firstAlphaComponentKey = Object.keys(AppRoutes.COMPONENTS).sort()[0] as keyof typeof AppRoutes.COMPONENTS;

  return (
    <DocsLayout
      title="Theming"
      description="Using CSS Variables or Tailwind CSS for theming."
    >
      <div>
        <h2>You can choose between using CSS variables (recommended) or utility classes for theming.</h2>
        <p>
          See the original documentation of shadcn on
          <Button
            variant={"link"}
            asChild
          >
            <a
              href={"https://v3.shadcn.com/docs/theming"}
              target={"_blank"}
              rel={"noopener"}
            >
              https://v3.shadcn.com/docs/theming
              <ExternalLink />
            </a>
          </Button>
        </p>
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
            <a href={AppRoutes.COMPONENTS[firstAlphaComponentKey]}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                {firstAlphaComponentKey.toLocaleLowerCase()}
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </DocsLayout>
  );
}
