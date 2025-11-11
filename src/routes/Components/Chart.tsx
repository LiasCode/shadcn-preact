import { DocsLayout } from "@/components/Layout/DocsLayout";
import { Loader } from "lucide-preact";
import { Suspense, lazy } from "preact/compat";

const ChartSection = lazy(() => import("./Sections/ChartSection"));

export default function ChartPage() {
  return (
    <DocsLayout
      title="Charts"
      description="Beautiful charts. Built using Recharts. Copy and paste into your apps."
    >
      <Suspense
        fallback={
          <div className="flex flex-row items-center justify-center">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        }
      >
        <ChartSection />
      </Suspense>
    </DocsLayout>
  );
}
