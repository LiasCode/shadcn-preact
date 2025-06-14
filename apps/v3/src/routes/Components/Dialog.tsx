import { DocsLayout } from "@/components/Layout/DocsLayout";
import { DialogSection } from "./Sections/DialogSection";

export default function DialogPage() {
  return (
    <DocsLayout
      title="Dialog"
      description="A window overlaid on either the primary window or another dialog window, rendering the content underneath inert."
    >
      <DialogSection />
    </DocsLayout>
  );
}
