import { DocsLayout } from "@/components/Layout/DocsLayout";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Suspense, lazy } from "preact/compat";

const DrawerSection = lazy(() => import("./Sections/DrawerSection"));

export default function DrawerPage() {
  return (
    <DocsLayout
      title="Drawer"
      description="A drawer component for preact."
    >
      <Suspense fallback={<LoadingSpinner />}>
        <DrawerSection />
      </Suspense>
    </DocsLayout>
  );
}
