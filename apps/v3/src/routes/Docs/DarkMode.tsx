import { DocsLayout } from "@/components/Layout/DocsLayout";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-preact";
import { AppRoutes } from "../AppRoutes";

export default function DarkModePage() {
  const firstAlphaComponentKey = Object.keys(AppRoutes.COMPONENTS).sort()[0] as keyof typeof AppRoutes.COMPONENTS;

  return (
    <DocsLayout
      title="Dark Mode"
      description="Adding dark mode to your site."
    >
      <div>
        <p>
          See the original documentation for adding dark mode on
          <Button
            variant={"link"}
            asChild
          >
            <a
              href={"https://v3.shadcn.com/docs/dark-mode"}
              target={"_blank"}
              rel={"noopener"}
            >
              https://v3.shadcn.com/docs/dark-mode
              <ExternalLink />
            </a>
          </Button>
        </p>
      </div>

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.DOCS.THEMING}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Theming
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
