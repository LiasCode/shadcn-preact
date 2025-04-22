import { DocsLayout } from "@/components/Layout/DocsLayout";
import { LabelSection } from "./Sections/LabelSection";

export default function LabelPage() {
  return (
    <DocsLayout
      title="Label"
      description="Renders an accessible label associated with controls."
    >
      <LabelSection />
    </DocsLayout>
  );
}
