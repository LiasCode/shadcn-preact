import { DocsLayout } from "@/components/Layout/DocsLayout";
import { PopoverSection } from "./Sections/PopoverSection";

export default function PopoverPage() {
  return (
    <DocsLayout
      title="Popover"
      description="Displays rich content in a portal, triggered by a button."
    >
      <PopoverSection />
    </DocsLayout>
  );
}
