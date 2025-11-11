import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { AspectRatio } from "@ui/aspect-ratio";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function AspectRatioSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { AspectRatio } from "@ui/aspect-ratio";

  export function AspectRatioDemo() {
    return (
      <AspectRatio ratio={16 / 9} className="bg-muted">
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    );
  }

`}
        previewElement={
          <div className="flex w-full items-center justify-center space-x-2">
            <AspectRatioDemo />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { AspectRatio } from "@ui/aspect-ratio"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <div className="w-[450px]">
    <AspectRatio ratio={16 / 9}>
      <img src="..." alt="Image" className="rounded-md object-cover" />
    </AspectRatio>
  </div>

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.ALERT_DIALOG}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Alert Dialog
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.AVATAR}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Avatar
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function AspectRatioDemo() {
  return (
    <div className="w-[450px]">
      <AspectRatio
        ratio={16 / 9}
        className="bg-muted"
      >
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          // biome-ignore lint/a11y/noRedundantAlt: <>
          alt="Photo by Drew Beamer"
          className="h-full w-full rounded-md object-cover"
        />
      </AspectRatio>
    </div>
  );
}
