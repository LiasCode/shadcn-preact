import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { InputToken } from "@ui/input-token";
import { Label } from "@ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function InputTokenSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token";

  export function InputTokenDemo() {
    return (
      <InputToken 
        value={["Write", "with", "token"]} 
        onTokensChange={v => console.log(v)} 
      />
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken value={["Write", "with", "token"]} />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { InputToken } from "@ui/input-token";

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <InputToken />

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-lg">Default</h3>

      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token"

  export function InputToken() {
    return <InputToken />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken value={["tag1", "tag2"]} />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Outline</h3>

      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token"

  export function InputTokenOutline() {
    return <InputToken variant="outline" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken
              variant="outline"
              value={["out1", "out2"]}
            />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Intercalate</h3>

      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token"

  export function InputTokenIntercalate() {
    return <InputToken variant="intercalate" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken
              variant="intercalate"
              value={["tag1", "out2", "tag3", "out4"]}
            />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Destructive</h3>

      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token"

  export function InputTokenDestructive() {
    return <InputToken variant="destructive" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken
              variant="destructive"
              value={["fix", "bug", "p1"]}
            />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">With Initial Value</h3>

      <CodePreviewTabs
        codeString={`
  import { InputToken } from "@ui/input-token";

  export function InputTokenDemo() {
    return <InputToken value={["bugs", "fix", "docs"]} />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputToken value={["bugs", "fix", "docs"]} />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">With Label</h3>

      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input-token"
  import { Label } from "@ui/label"
   
  export function InputTags() {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="tags">Tags</Label>
        <InputToken id="tags" />
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="tags">Tags</Label>
              <InputToken id="tags" />
            </div>
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.INPUT_OTP}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Input Otp
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.LABEL}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Label
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
