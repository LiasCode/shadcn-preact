import { DocsLayout } from "@/components/Layout/DocsLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Suspense, lazy } from "preact/compat";

const CommandSection = lazy(() => import("./Sections/CommandSection"));

export default function CommandPage() {
  return (
    <DocsLayout
      title="Command"
      description="Fast, composable, unstyled command menu for Preact."
    >
      <Suspense
        fallback={
          <div className="flex w-full flex-col items-center justify-center">
            <LoadingSpinner />
          </div>
        }
      >
        <CommandSection />
      </Suspense>
    </DocsLayout>
  );
}
