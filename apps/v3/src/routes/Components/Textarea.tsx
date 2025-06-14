import { DocsLayout } from "@/components/Layout/DocsLayout";
import { TextareaSection } from "./Sections/TextareaSection";

export default function TextareaPage() {
  return (
    <DocsLayout
      title="Textarea"
      description="Displays a form textarea or a component that looks like a textarea."
    >
      <TextareaSection />
    </DocsLayout>
  );
}
