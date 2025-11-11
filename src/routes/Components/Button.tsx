import { DocsLayout } from "@/components/Layout/DocsLayout";
import { ButtonsSection } from "./Sections/ButtonsSection";

export default function ButtonPage() {
  return (
    <DocsLayout
      title="Button"
      description="Displays a button or a component that looks like a button."
    >
      <ButtonsSection />
    </DocsLayout>
  );
}
