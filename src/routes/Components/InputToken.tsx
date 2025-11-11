import { DocsLayout } from "@/components/Layout/DocsLayout";
import { InputTokenSection } from "./Sections/InputTokenSection";

export default function InputTokenPage() {
  return (
    <DocsLayout
      title="Input Token"
      description="Displays a form input field with token management."
    >
      <InputTokenSection />
    </DocsLayout>
  );
}
