import { DocsLayout } from "@/components/Layout/DocsLayout";
import { SheetSection } from "./Sections/SheetSection";

export default function SheetPage() {
  return (
    <DocsLayout
      title="Sheet"
      description="Extends the Dialog component to display content that complements the main content of the screen."
    >
      <SheetSection />
    </DocsLayout>
  );
}
