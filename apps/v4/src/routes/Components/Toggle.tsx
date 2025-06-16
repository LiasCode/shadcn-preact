import { DocsLayout } from "@/components/Layout/DocsLayout";
import { ToggleSection } from "./Sections/ToggleSection";

export default function TogglePage() {
  return (
    <DocsLayout
      title="Toggle"
      description="A two-state button that can be either on or off."
    >
      <ToggleSection />
    </DocsLayout>
  );
}
