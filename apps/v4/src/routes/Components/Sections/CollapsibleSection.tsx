import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ui/collapsible";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-preact";
import { useState } from "preact/hooks";

export default function CollapsibleSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { ChevronsUpDown } from "lucide-preact";
  import { Button } from "@ui/button";
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ui/collapsible";
  import { useState } from "preact/hooks";

  export function CollapsibleDemo() {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-[350px] space-y-2">
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4 className="font-semibold text-sm">@peduarte starred 3 repositories</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/primitives</div>
        <CollapsibleContent className="space-y-2">
          <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/colors</div>
          <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@stitches/react</div>
        </CollapsibleContent>
      </Collapsible>
    );
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 px-2">
            <CollapsibleDemo />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@ui/collapsible"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Collapsible>
    <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>
    <CollapsibleContent>
      Yes. Free to use for personal and commercial projects. No attribution
      required.
    </CollapsibleContent>
  </Collapsible>

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CHECKBOX}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Checkbox
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.COMMAND}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Command
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-[350px] space-y-2"
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="font-semibold text-sm">@peduarte starred 3 repositories</h4>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
          >
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/primitives</div>
      <CollapsibleContent className="space-y-2">
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@radix-ui/colors</div>
        <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">@stitches/react</div>
      </CollapsibleContent>
    </Collapsible>
  );
}
