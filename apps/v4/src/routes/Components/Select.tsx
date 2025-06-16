import { DocsLayout } from "@/components/Layout/DocsLayout";
import { SelectSection } from "./Sections/SelectSection";

export default function SelectPage() {
  return (
    <DocsLayout
      title="Select"
      description="Displays a list of options for the user to pick from—triggered by a button."
    >
      <SelectSection />
    </DocsLayout>
  );
}
