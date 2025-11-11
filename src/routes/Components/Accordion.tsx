import { DocsLayout } from "@/components/Layout/DocsLayout";
import AccordionSection from "./Sections/AccordionSection";

export default function AccordionPage() {
  return (
    <DocsLayout
      title="Accordion"
      description="A vertically stacked set of interactive headings that each reveal a section of content."
    >
      <AccordionSection />
    </DocsLayout>
  );
}
