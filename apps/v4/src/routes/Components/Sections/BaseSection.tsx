import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function BaseSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md" />
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Example 1</h3>

      <CodePreviewTabs
        codeString={`

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md" />
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.SWITCH}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Switch
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TABS}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Tabs
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
