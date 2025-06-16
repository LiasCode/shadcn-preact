import { DocsLayout } from "@/components/Layout/DocsLayout";
import CollapsibleSection from "./Sections/CollapsibleSection";

export default function CollapsiblePage() {
  return (
    <DocsLayout
      title="Collapsible"
      description="An interactive component which expands/collapses a panel."
    >
      <CollapsibleSection />
    </DocsLayout>
  );
}
