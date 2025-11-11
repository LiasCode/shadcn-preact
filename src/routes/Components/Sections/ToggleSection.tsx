import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Toggle } from "@ui/toggle";
import { Bold, ChevronLeft, ChevronRight, Italic, Underline } from "lucide-preact";

export function ToggleSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Toggle } from "@ui/toggle"
  import { Bold } from "lucide-preact"

  export function ToggleDemo() {
    return (
      <Toggle aria-label="Toggle italic">
        <Bold className="h-4 w-4" />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle aria-label="Toggle italic">
              <Bold className="h-4 w-4" />
            </Toggle>
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Toggle } from "@ui/toggle"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Toggle>Toggle</Toggle>

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Default</h3>

      <CodePreviewTabs
        codeString={`
  import { Bold } from "lucide-preact"
  import { Toggle } from "@ui/toggle"

  export function ToggleDemo() {
    return (
      <Toggle aria-label="Toggle italic">
        <Bold className="h-4 w-4" />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle aria-label="Toggle italic">
              <Bold className="h-4 w-4" />
            </Toggle>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">Outline</h3>

      <CodePreviewTabs
        codeString={`
  import { Italic } from "lucide-preact"
  import { Toggle } from "@ui/toggle"

  export function ToggleOutline() {
    return (
      <Toggle variant="outline" aria-label="Toggle italic">
        <Italic />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle
              variant="outline"
              aria-label="Toggle italic"
            >
              <Italic />
            </Toggle>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">With Text</h3>

      <CodePreviewTabs
        codeString={`
  import { Italic } from "lucide-preact"
  import { Toggle } from "@ui/toggle"

  export function ToggleWithText() {
    return (
      <Toggle aria-label="Toggle italic">
        <Italic />
        Italic
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle aria-label="Toggle italic">
              <Italic />
              Italic
            </Toggle>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">Small</h3>

      <CodePreviewTabs
        codeString={`
  import { Italic } from "lucide-preact"
  import { Toggle } from "@ui/toggle"

  export function ToggleSm() {
    return (
      <Toggle size="sm" aria-label="Toggle italic">
        <Italic />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle
              size="sm"
              aria-label="Toggle italic"
            >
              <Italic />
            </Toggle>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">Large</h3>

      <CodePreviewTabs
        codeString={`
  import { Italic } from "lucide-preact"
  import { Toggle } from "@ui/toggle"

  export function ToggleLg() {
    return (
      <Toggle size="lg" aria-label="Toggle italic">
        <Italic />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle
              size="lg"
              aria-label="Toggle italic"
            >
              <Italic />
            </Toggle>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">Disabled</h3>

      <CodePreviewTabs
        codeString={`
  import { Underline } from "lucide-react"
  import { Toggle } from "@ui/toggle"

  export function ToggleDisabled() {
    return (
      <Toggle aria-label="Toggle italic" disabled>
        <Underline className="h-4 w-4" />
      </Toggle>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Toggle
              aria-label="Toggle italic"
              disabled
            >
              <Underline className="h-4 w-4" />
            </Toggle>
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TOAST}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Toast
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TOOLTIP}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Tooltip
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
