import { CodePreviewTabs } from "@/components/CodePreview/CodePreviewTabs";
import HighlightCode from "@/components/CodePreview/HighlightCode";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@ui/pagination";
import { ToastAction, toast } from "@ui/toast";
import { ChevronLeft, ChevronRight } from "lucide-preact";

export function ToastSection() {
  return (
    <div className="flex w-full flex-col gap-6">
      <CodePreviewTabs
        codeString={`
  import { Button } from "@ui/button"
  import { ToastAction, toast } from "@ui/toast"

  export function ToastDemo() {
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Scheduled: Catch up ",
            description: "Friday, February 10, 2023 at 5:57 PM",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          })
        }}
      >
        Add to calendar
      </Button>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Scheduled: Catch up ",
                  description: "Friday, February 10, 2023 at 5:57 PM",
                  action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
                });
              }}
            >
              Add to calendar
            </Button>
          </div>
        }
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Usage</h2>

      <p>
        Add the global <code className="bg-accent px-1">{"<Toaster />"}</code> in the root of your app
      </p>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { Toaster } from "@ui/toast";

  export function App() {
    return (
      <div>
        <Toaster position="bottom-right" />
      </div>
    );
  }

`}
      />
      <p>
        Now you can start to use the <code className="bg-accent px-1">{"toast()"}</code> method
      </p>

      <HighlightCode
        lang="tsx"
        codeString={`
  import { toast } from "@ui/toast"

`}
      />

      <HighlightCode
        lang="tsx"
        codeString={`
  toast({
    title: "Scheduled: Catch up",
    description: "Friday, February 10, 2023 at 5:57 PM",
  })

`}
      />

      <h2 className="w-full border-b-2 pb-1 font-semibold text-2xl">Examples</h2>

      <h3 className="w-full font-semibold text-xl">Simple</h3>

      <CodePreviewTabs
        codeString={`
  import { toast } from "@ui/toast"
  import { Button } from "@ui/button"
   
  export function ToastSimple() {
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            description: "Your message has been sent.",
          })
        }}
      >
        Show Toast
      </Button>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  description: "Your message has been sent.",
                });
              }}
            >
              Show Toast
            </Button>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">With Title</h3>

      <CodePreviewTabs
        codeString={`
  import { toast } from "@ui/toast"
  import { Button } from "@ui/button"
   
  export function ToastWithTitle() {
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }}
      >
        Show Toast
      </Button>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                });
              }}
            >
              Show Toast
            </Button>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">With Action</h3>

      <CodePreviewTabs
        codeString={`
  import { toast, ToastAction } from "@ui/toast"
  import { Button } from "@ui/button"
   
  export function ToastWithAction() {
    return (
      <Button
        variant="outline"
        onClick={() => {
          toast({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          })
        }}
      >
        Show Toast
      </Button>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                  action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
              }}
            >
              Show Toast
            </Button>
          </div>
        }
      />

      <h3 className="w-full font-semibold text-xl">Destructive</h3>

      <CodePreviewTabs
        codeString={`
  import { toast, ToastAction } from "@ui/toast"
  import { Button } from "@ui/button"
   
  export function ToastDestructive() {
    return (
       <Button
          variant="outline"
          onClick={() => {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem with your request.",
              action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
          }}
        >
          Show Toast
      </Button>
    )
  }

`}
        previewElement={
          <div className="flex w-full flex-col items-center justify-center space-x-2 *:max-w-screen-md">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Uh oh! Something went wrong.",
                  description: "There was a problem with your request.",
                  action: <ToastAction altText="Try again">Try again</ToastAction>,
                });
              }}
            >
              Show Toast
            </Button>
          </div>
        }
      />

      <Pagination className="mt-10">
        <PaginationContent className="flex w-full flex-row justify-between">
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TEXTAREA}>
              <Button
                className="gap-1 pl-1"
                variant="outline"
              >
                <ChevronLeft />
                Textarea
              </Button>
            </a>
          </PaginationItem>
          <PaginationItem>
            <a href={AppRoutes.COMPONENTS.TOGGLE}>
              <Button
                className="gap-1 pr-1 capitalize"
                variant="outline"
              >
                Toggle
                <ChevronRight />
              </Button>
            </a>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
