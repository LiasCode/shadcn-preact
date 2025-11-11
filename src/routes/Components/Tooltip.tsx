import { DocsLayout } from "@/components/Layout/DocsLayout";
import { TooltipSection } from "./Sections/TooltipSection";

export default function TooltipPage() {
  return (
    <DocsLayout
      title="Tooltip"
      description="A popup that displays information related to an element when the element receives keyboard focus or the mouse
      hovers over it."
    >
      <TooltipSection />
    </DocsLayout>
  );
}
