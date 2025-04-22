import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight, Loader2, MailOpen } from "lucide-preact";

export function ButtonsSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"

  export function ButtonDemo() {
    return <Button>Button</Button>
  }

`}
        previewElement={<Button>Button</Button>}
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Button } from "@ui/button"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Button variant="outline">Button</Button>

`}
      />

      <h3 className="w-full font-semibold text-xl">Link</h3>

      <p>
        You can use the <span className="rounded bg-accent px-2">buttonVariants</span> helper to create a link that
        looks like a button.
      </p>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { buttonVariants } from "@ui/button"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <a className={buttonVariants({ variant: "outline" })}>Click here</a>

`}
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Default</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"

  export function ButtonDemo() {
    return <Button>Button</Button>
  }

`}
        previewElement={<Button>Button</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Secondary</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"

  export function ButtonSecondary() {
    return <Button variant="secondary">Secondary</Button>
  }

`}
        previewElement={<Button variant="secondary">Secondary</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Outline</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
   
  export function ButtonOutline() {
    return <Button variant="outline">Outline</Button>
  }

`}
        previewElement={<Button variant="outline">Outline</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Destructive</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
   
  export function ButtonDestructive() {
    return <Button variant="destructive">Destructive</Button>
  }

`}
        previewElement={<Button variant="destructive">Destructive</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Ghost</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
   
  export function ButtonGhost() {
    return <Button variant="ghost">Ghost</Button>  
  }

`}
        previewElement={<Button variant="ghost">Ghost</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Link</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
   
  export function ButtonLink() {
    return <Button variant="link">Link</Button>  
  }

`}
        previewElement={<Button variant="link">Link</Button>}
      />

      <h3 className="w-full font-semibold text-xl">Icon</h3>

      <CodePreviewTabs
        codeString={`
  import { ChevronRight } from "lucide-preact"

  import { Button } from "@ui/button"

  export function ButtonIcon() {
    return (
      <Button variant="outline" size="icon">
        <ChevronRight />
      </Button>
    )
  }

`}
        previewElement={
          <Button
            variant="outline"
            size="icon"
          >
            <ChevronRight />
          </Button>
        }
      />

      <h3 className="w-full font-semibold text-xl">With Icon</h3>

      <CodePreviewTabs
        codeString={`
  import { MailOpen } from "lucide-preact"
   
  import { Button } from "@ui/button"
   
  export function ButtonWithIcon() {
    return (
      <Button>
        <MailOpen /> Login with Email
      </Button>
    )
  }

`}
        previewElement={
          <Button>
            <MailOpen /> Login with Email
          </Button>
        }
      />

      <h3 className="w-full font-semibold text-xl">Loading</h3>

      <CodePreviewTabs
        codeString={`
  import { Loader2 } from "lucide-preact"

  import { Button } from "@ui/button"

  export function ButtonLoading() {
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
        Please wait
      </Button>
    )
  }

`}
        previewElement={
          <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
          </Button>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.BREADCRUMB}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Breadcrumb
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CALENDAR}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Calendar
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
