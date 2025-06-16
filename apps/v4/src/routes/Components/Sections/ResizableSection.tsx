import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export default function ResizableSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@ui/resizable"

  export function ResizableDemo() {
    return (
      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-md rounded-lg border md:min-w-[450px]"
      >
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2">
            <ResizableDemo />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-xl">About</h2>

      <p class="leading-[1.65rem] [&amp;:not(:first-child)]:mt-6">
        The <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">Resizable</code> component
        is built on top of{" "}
        <a
          class="font-medium underline underline-offset-4"
          href="https://github.com/bvaughn/react-resizable-panels"
        >
          react-resizable-panels
        </a>{" "}
        by{" "}
        <a
          class="font-medium underline underline-offset-4"
          href="https://github.com/bvaughn"
        >
          bvaughn
        </a>
        .
      </p>

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@ui/resizable"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <ResizablePanelGroup direction="horizontal">
    <ResizablePanel>One</ResizablePanel>
    <ResizableHandle />
    <ResizablePanel>Two</ResizablePanel>
  </ResizablePanelGroup>

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.PROGRESS}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Progress
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.SELECT}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Select
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function ResizableDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel defaultSize={50}>
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={50}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={25}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
