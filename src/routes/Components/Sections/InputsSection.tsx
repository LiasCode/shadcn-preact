import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { toast } from "@ui/toast";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { useState } from "preact/hooks";

export function InputsSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input"

  export function InputDemo() {
    return <Input type="email" placeholder="Email" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <Input
              type="email"
              placeholder="Email"
            />
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Input } from "@ui/input"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Input />

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-lg">Default</h3>

      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input"

  export function InputDemo() {
    return <Input type="email" placeholder="Email" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <Input
              type="email"
              placeholder="Email"
            />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">File</h3>

      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input"
  import { Label } from "@ui/label"
   
  export function InputFile() {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">Picture</Label>
        <Input id="picture" type="file" />
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="picture">Picture</Label>
              <Input
                id="picture"
                type="file"
              />
            </div>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Disabled</h3>

      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input"

  export function InputDisabled() {
    return <Input disabled type="email" placeholder="Email" />
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <Input
              disabled
              type="email"
              placeholder="Email"
            />
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">With Label</h3>

      <CodePreviewTabs
        codeString={`
  import { Input } from "@ui/input"
  import { Label } from "@ui/label"

  export function InputWithLabel() {
    return (
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input type="email" id="email" placeholder="Email" />
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
              />
            </div>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">With Button</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
  import { Input } from "@ui/input"

  export function InputWithButton() {
    return (
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input type="email" placeholder="Email" />
        <Button type="submit">Subscribe</Button>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="email"
                placeholder="Email"
              />
              <Button type="submit">Subscribe</Button>
            </div>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Form</h3>

      <CodePreviewTabs
        codeString={`
  import { toast } from "@ui/toast"
  import { Button } from "@ui/button"
  import { Label } from "@ui/label";
  import { Input } from "@ui/input"
  import { useState } from "preact/hooks";

  export function InputForm() {
    const [data, setData] = useState({ username: "" });

    function onSubmit(e: SubmitEvent) {
      e.preventDefault();
      toast({
        title: "You submitted the following values:",
        description: JSON.stringify(data, null, 2),
      });
    }

    return (
      <form onSubmit={onSubmit} className="w-full space-y-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="font-semibold">Username</Label>
          <Input
            placeholder="shadcn"
            value={data.username}
            onInput={(e) => setData({ username: e.currentTarget.value })}
          />
          <p className="text-[0.8rem] text-muted-foreground">This is your public display name.</p>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    );
  }

`}
        previewElement={
          <div className="flex w-full max-w-[320px] items-center space-x-2">
            <InputForm />
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.DRAWER}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Drawer
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.INPUT_OTP}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Input Otp
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
export function InputForm() {
  const [data, setData] = useState({ username: "" });

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();
    toast({
      title: "You submitted the following values:",
      description: JSON.stringify(data, null, 2),
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full space-y-6"
    >
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="font-semibold">Username</Label>
        <Input
          placeholder="shadcn"
          value={data.username}
          onInput={(e) => setData({ username: e.currentTarget.value })}
        />
        <p className="text-[0.8rem] text-muted-foreground">This is your public display name.</p>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
