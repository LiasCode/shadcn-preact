import { DocsLayout } from "@/components/Layout/DocsLayout";
import { BadgesSection } from "./Sections/BadgeSection";

export default function BadgePage() {
  return (
    <DocsLayout
      title="Badge"
      description="Displays a badge or a component that looks like a badge."
    >
      <BadgesSection />
    </DocsLayout>
  );
}
