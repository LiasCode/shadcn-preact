import { DocsLayout } from "@/components/Layout/DocsLayout";
import { TabsSection } from "./Sections/TabsSection";

export default function TabsPage() {
  return (
    <DocsLayout
      title="Tabs"
      description="A set of layered sections of content—known as tab panels—that are displayed one at a time."
    >
      <TabsSection />
    </DocsLayout>
  );
}
