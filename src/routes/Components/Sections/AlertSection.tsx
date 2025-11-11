import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Alert, AlertDescription, AlertTitle } from "@ui/alert";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { AlertCircle, ChevronLeft, ChevronRight, Terminal } from "lucide-preact";

export function AlertSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Terminal } from "lucide-preact"
  
  import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "@ui/alert"
  
  export function AlertDemo() {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components to your app using the cli.
        </AlertDescription>
      </Alert>
    )
  }

`}
        previewElement={
          <Alert className="max-w-[500px]">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
          </Alert>
        }
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        codeString={`
  import { Alert, AlertDescription, AlertTitle } from "@ui/alert"

`}
        lang="tsx"
      />

      <HighlightCode
        codeString={`
  <Alert>
    <Terminal className="h-4 w-4" />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      You can add components and dependencies to your app using the cli.
    </AlertDescription>
  </Alert>

`}
        lang="tsx"
      />

      <h2 className="w-full border-b-2 pb-2 font-semibold text-2xl">Examples</h2>

      <h3 className="mt-4 w-full font-semibold text-xl">Default</h3>

      <CodePreviewTabs
        codeString={`
  <Alert>
    <Terminal className="h-4 w-4" />
    <AlertTitle>Heads up!</AlertTitle>
    <AlertDescription>
      You can add components to your app using the cli.
    </AlertDescription>
  </Alert>

`}
        previewElement={
          <Alert className="max-w-[500px]">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>You can add components to your app using the cli.</AlertDescription>
          </Alert>
        }
      />

      <h3 className="mt-4 w-full font-semibold text-xl">Destructive</h3>

      <CodePreviewTabs
        codeString={`
  <Alert variant="destructive" className="max-w-[500px]">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>
      Your session has expired. Please log in again.
    </AlertDescription>
  </Alert>

`}
        previewElement={
          <Alert
            variant="destructive"
            className="max-w-[500px]"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
          </Alert>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.ACCORDION}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Accordion
              </Button>
            </a>
          </PaginationItem>

          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.ALERT_DIALOG}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Alert Dialog
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
