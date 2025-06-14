import { DocsLayout } from "@/components/Layout/DocsLayout";
import { InputsSection } from "./Sections/InputsSection";

export default function InputPage() {
  return (
    <DocsLayout
      title="Input"
      description="Displays a form input field or a component that looks like an input field."
    >
      <InputsSection />
    </DocsLayout>
  );
}
