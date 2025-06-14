import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function BadgesSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Badge } from "@ui/badge"

  export function BadgeDemo() {
    return <Badge>Badge</Badge>
  }

`}
        previewElement={<Badge>Badge</Badge>}
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Badge } from "@ui/badge"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Badge variant="outline">Badge</Badge>

`}
      />

      <h3 className="w-full font-semibold text-xl">Link</h3>

      <p>
        You can use the <span className="rounded bg-accent px-2">badgeVariants</span> helper to create a link that looks
        like a badge.
      </p>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { badgeVariants } from "@ui/badge"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <a className={badgeVariants({ variant: "outline" })}>Badge</a>

`}
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Default</h3>

      <CodePreviewTabs
        codeString={`
  import { Badge } from "@ui/badge"

  export function BadgeDemo() {
    return <Badge>Badge</Badge>
  }

`}
        previewElement={<Badge>Badge</Badge>}
      />

      <h3 className="w-full font-semibold text-xl">Secondary</h3>

      <CodePreviewTabs
        codeString={`
  import { Badge } from "@ui/badge"
   
  export function BadgeSecondary() {
    return <Badge variant="secondary">Secondary</Badge>
  }

`}
        previewElement={<Badge variant="secondary">Secondary</Badge>}
      />

      <h3 className="w-full font-semibold text-xl">Outline</h3>

      <CodePreviewTabs
        codeString={`
  import { Badge } from "@ui/badge"
   
  export function BadgeOutline() {
    return <Badge variant="outline">Outline</Badge>
  }

`}
        previewElement={<Badge variant="outline">Outline</Badge>}
      />

      <h3 className="w-full font-semibold text-xl">Destructive</h3>

      <CodePreviewTabs
        codeString={`
  import { Badge } from "@ui/badge"
   
  export function BadgeDesctructive() {
    return <Badge variant="destructive">Destructive</Badge>
  }

`}
        previewElement={<Badge variant="destructive">Destructive</Badge>}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.AVATAR}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Avatar
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.BREADCRUMB}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Breadcrumb
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
