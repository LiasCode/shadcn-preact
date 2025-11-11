import { DocsLayout } from "@/components/Layout/DocsLayout";
import { ToastSection } from "./Sections/ToastSection";

export default function ToastPage() {
  return (
    <DocsLayout
      title="Toast"
      description="A succinct message that is displayed temporarily."
    >
      <ToastSection />
    </DocsLayout>
  );
}
