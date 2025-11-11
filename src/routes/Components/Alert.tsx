import { DocsLayout } from "@/components/Layout/DocsLayout";
import { AlertSection } from "./Sections/AlertSection";

export default function AlertPage() {
  return (
    <DocsLayout
      title="Alert"
      description="Displays a callout for user attention."
    >
      <AlertSection />
    </DocsLayout>
  );
}
