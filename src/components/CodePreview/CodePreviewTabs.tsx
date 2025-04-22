import { Skeleton } from "@ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import type { VNode } from "preact";
import { Suspense, lazy } from "preact/compat";
import { LoadingSpinner } from "../LoadingSpinner";

const HighlightCodeInternal = lazy(() => import("./HighlightCodeInternal"));

export function CodePreviewTabs(props: { codeString: string; previewElement: VNode<any> }) {
  return (
    <Tabs
      defaultValue="preview"
      className="w-full self-start"
    >
      <TabsList className="grid max-w-fit grid-cols-2 bg-transparent">
        <TabsTrigger
          value="preview"
          className="rounded-none border-b-primary transition-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Preview
        </TabsTrigger>
        <TabsTrigger
          value="code"
          className="rounded-none border-b-primary transition-none data-[state=active]:border-b-2 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
        >
          Code
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="preview"
        className="broder-border flex min-h-[350px] w-full flex-col items-center justify-center rounded-lg border py-4 md:py-16"
      >
        {props.previewElement}
      </TabsContent>

      <TabsContent
        value="code"
        className="flex max-h-[500px] w-full flex-col items-center justify-center rounded-lg border border-border *:overflow-auto"
      >
        <Suspense
          fallback={
            <Skeleton className="flex h-64 w-full flex-col items-center justify-center">
              <LoadingSpinner />
            </Skeleton>
          }
        >
          <HighlightCodeInternal
            lang="tsx"
            codeString={props.codeString}
          />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
}
