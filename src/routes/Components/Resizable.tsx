import { DocsLayout } from "@/components/Layout/DocsLayout";
import ResizableSection from "./Sections/ResizableSection";

export default function ResizablePage() {
  return (
    <DocsLayout
      title="Resizable"
      description="Accessible resizable panel groups and layouts with keyboard support."
    >
      <ResizableSection />
    </DocsLayout>
  );
}
