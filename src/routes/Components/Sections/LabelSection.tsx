import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Label } from "@ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { A } from "preact-hashish-router";

export function LabelSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Checkbox } from "@ui/checkbox"
  import { Label } from "@ui/label"

  export function LabelDemo() {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center justify-center space-x-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Label } from "@ui/label"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Label htmlFor="email">Your email address</Label>

`}
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <A href={AppRoutes.COMPONENTS.INPUT_OTP}>
              <Button className="gap-1 pl-1" variant="outline">
                <ChevronLeft />
                Input Otp
              </Button>
            </A>
          </PaginationItem>
          <PaginationItem>
            <A href={AppRoutes.COMPONENTS.POPOVER}>
              <Button className="gap-1 pr-1 capitalize" variant="outline">
                Popover
                <ChevronRight />
              </Button>
            </A>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
