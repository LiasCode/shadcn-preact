import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Textarea } from "@ui/textarea";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function TextareaSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Textarea } from "@ui/textarea"

  export function TextareaDemo() {
    return <Textarea placeholder="Type your message here." />
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 px-4 *:max-w-screen-md">
            <Textarea placeholder="Type your message here." />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Textarea } from "@ui/textarea"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Textarea />

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TABS}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Tabs
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TOAST}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Toast
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
