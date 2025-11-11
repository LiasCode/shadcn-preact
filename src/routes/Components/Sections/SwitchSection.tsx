import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Label } from "@ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { Switch } from "@ui/switch";
import { toast } from "@ui/toast";
import { ChevronLeft, ChevronRight } from "lucide-preact";
import { useState } from "preact/hooks";

export function SwitchSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Label } from "@ui/label"
  import { Switch } from "@ui/switch"

  export function SwitchDemo() {
    return (
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <Label htmlFor="airplane-mode">Airplane Mode</Label>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex w-full items-center justify-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch id="airplane-mode" />
              <Label htmlFor="airplane-mode">Airplane Mode</Label>
            </div>
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Switch } from "@ui/switch"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Switch />

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Form</h3>

      <CodePreviewTabs
        codeString={`
  import { toast } from "@ui/toast"
  import { Button } from "@ui/button"
  import { Switch } from "@ui/switch"

  export function SwitchForm() {
    const [form, setForm] = useState({
      security_emails: true,
      marketing_emails: false,
    });

    function onSubmit(e: SubmitEvent) {
      e.preventDefault();

      toast({
        title: "You submitted the following values:",
        description: JSON.stringify(form, null, 2),
      });
    }

    return (
      <form onSubmit={onSubmit} className="w-full max-w-[520px] space-y-6">
        <h3 className="mb-4 font-medium text-lg">Email Notifications</h3>
        <div className="space-y-4">
          <div className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Marketing emails</Label>
              <p className="text-[0.8rem] text-muted-foreground">
                Receive emails about new products, features, and more.
              </p>
            </div>
            <Switch
              checked={form.marketing_emails}
              onCheckedChange={(v) => setForm((prev) => ({ ...prev, marketing_emails: v }))}
            />
          </div>

          <div className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
            <div className="space-y-0.5">
              <Label>Security emails</Label>
              <p className="text-[0.8rem] text-muted-foreground">Receive emails about your account security.</p>
            </div>

            <Switch
              checked={form.security_emails}
              onCheckedChange={(v) => setForm((prev) => ({ ...prev, security_emails: v }))}
              disabled
              aria-readonly
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    );
  }

`}
        previewElement={
          <div className="flex w-full items-center justify-center space-x-2">
            <SwitchForm />
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.SKELETON}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Skeleton
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TABLE}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Table
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export function SwitchForm() {
  const [form, setForm] = useState({
    security_emails: true,
    marketing_emails: false,
  });

  function onSubmit(e: SubmitEvent) {
    e.preventDefault();

    toast({
      title: "You submitted the following values:",
      description: JSON.stringify(form, null, 2),
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-[520px] space-y-6 px-4"
    >
      <h3 className="mb-4 font-medium text-lg">Email Notifications</h3>
      <div className="space-y-4">
        <div className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Marketing emails</Label>
            <p className="text-[0.8rem] text-muted-foreground">
              Receive emails about new products, features, and more.
            </p>
          </div>
          <Switch
            checked={form.marketing_emails}
            onCheckedChange={(v) => setForm((prev) => ({ ...prev, marketing_emails: v }))}
          />
        </div>

        <div className="flex flex-row items-center justify-between gap-4 rounded-lg border p-3 shadow-sm">
          <div className="space-y-0.5">
            <Label>Security emails</Label>
            <p className="text-[0.8rem] text-muted-foreground">Receive emails about your account security.</p>
          </div>

          <Switch
            checked={form.security_emails}
            onCheckedChange={(v) => setForm((prev) => ({ ...prev, security_emails: v }))}
            disabled
            aria-readonly
          />
        </div>
      </div>
      <Button type="submit">Submit</Button>
    </form>
  );
}
