import { DocsLayout } from "@/components/Layout/DocsLayout";
import { AspectRatioSection } from "./Sections/AspectRatioSection";

export default function AspectRatioPage() {
  return (
    <DocsLayout
      title="Aspect Ratio"
      description="Displays content within a desired ratio."
    >
      <AspectRatioSection />
    </DocsLayout>
  );
}
