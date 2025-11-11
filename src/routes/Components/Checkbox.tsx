import { DocsLayout } from "@/components/Layout/DocsLayout";
import { CheckboxSection } from "./Sections/CheckBoxSection";

export default function CheckboxPage() {
  return (
    <DocsLayout
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not checked."
    >
      <CheckboxSection />
    </DocsLayout>
  );
}
