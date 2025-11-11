import { DocsLayout } from "@/components/Layout/DocsLayout";
import { SeparatorSection } from "./Sections/SeparatorSection";

export default function SeparatorPage() {
  return (
    <DocsLayout
      title="Separator"
      description="Visually or semantically separates content."
    >
      <SeparatorSection />
    </DocsLayout>
  );
}
