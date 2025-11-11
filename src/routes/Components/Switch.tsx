import { DocsLayout } from "@/components/Layout/DocsLayout";
import { SwitchSection } from "./Sections/SwitchSection";

export default function SwitchPage() {
  return (
    <DocsLayout
      title="Switch"
      description="A control that allows the user to toggle between checked and not checked."
    >
      <SwitchSection />
    </DocsLayout>
  );
}
