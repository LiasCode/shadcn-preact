import { DocsLayout } from "@/components/Layout/DocsLayout";
import CalendarSection from "./Sections/CalendarSection";

export default function CalendarPage() {
  return (
    <DocsLayout
      title="Calendar"
      description="A date field component that allows users to enter and edit date."
    >
      <CalendarSection />
    </DocsLayout>
  );
}
