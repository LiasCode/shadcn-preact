import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card";
import { Checkbox } from "@ui/checkbox";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function CheckboxSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Checkbox } from "@ui/checkbox"

  export function CheckboxDemo() {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label
          htmlFor="terms"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex items-center space-x-2">
            <Checkbox id="terms" />
            <label
              htmlFor="terms"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Checkbox } from "@ui/checkbox"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  <Checkbox />

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-lg">With Text</h3>

      <CodePreviewTabs
        codeString={`
  import { Checkbox } from "@ui/checkbox"

  export function CheckboxWithText() {
    return (
      <div className="items-top flex space-x-2">
        <Checkbox id="terms1" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms1"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Accept terms and conditions
          </label>
          <p className="text-sm text-muted-foreground">
            You agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex flex-col items-center justify-center px-4 *:max-w-screen-md">
            <div className="flex space-x-2">
              <Checkbox id="terms1" />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms1"
                  className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
                <p className="text-muted-foreground text-sm">You agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Disable</h3>

      <CodePreviewTabs
        codeString={`
  import { Checkbox } from "@ui/checkbox"

  export function CheckboxDisabled() {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms2" disabled />
        <label
          htmlFor="terms2"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Accept terms and conditions
        </label>
      </div>
    )
  }

`}
        previewElement={
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms2"
              disabled
            />
            <label
              htmlFor="terms2"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept terms and conditions
            </label>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-lg">Form</h3>

      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button";
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ui/card";
  import { Checkbox } from "@ui/checkbox";

  const CheckboxDemo = () => (
    <form>
      <Card className="max-w-[350px]">
        <CardHeader>
          <CardTitle>Sidebar</CardTitle>
          <CardDescription>Select the items you want to display in the sidebar.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="recents" defaultChecked />
            <label
              htmlFor="recents"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recents
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="home" defaultChecked />
            <label
              htmlFor="home"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Home
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="app" />
            <label
              htmlFor="app"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Applications
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="desktop" />
            <label
              htmlFor="desktop"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Desktop
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="downloads" />
            <label
              htmlFor="downloads"
              className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Downloads
            </label>
          </div>
        </CardContent>

        <CardFooter>
          <Button>Submit</Button>
        </CardFooter>
      </Card>
    </form>
  )
`}
        previewElement={
          <div className="flex flex-col items-center justify-center px-4 *:max-w-screen-md">
            <Card className="max-w-[350px]">
              <CardHeader>
                <CardTitle>Sidebar</CardTitle>
                <CardDescription>Select the items you want to display in the sidebar.</CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="recents"
                    defaultChecked
                  />
                  <label
                    htmlFor="recents"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Recents
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="home"
                    defaultChecked
                  />
                  <label
                    htmlFor="home"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Home
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="app1" />
                  <label
                    htmlFor="app1"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Applications
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="desktop" />
                  <label
                    htmlFor="desktop"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Desktop
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="downloads" />
                  <label
                    htmlFor="downloads"
                    className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Downloads
                  </label>
                </div>
              </CardContent>

              <CardFooter>
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.CHART}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Chart
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.COLLAPSIBLE}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Collapsible
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
