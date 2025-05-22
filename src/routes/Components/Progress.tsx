import { DocsLayout } from "@/components/Layout/DocsLayout";
import { ProgressSection } from "./Sections/ProgressSection";

export default function ProgressPage() {
  return (
    <DocsLayout
      title="Progress"
      description="Displays an indicator showing the completion progress of a task, typically displayed as a progress bar."
    >
      <ProgressSection />
    </DocsLayout>
  );
}
