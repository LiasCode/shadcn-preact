import { DocsLayout } from "@/components/Layout/DocsLayout";
import { AlertDialogSection } from "./Sections/AlertDialogSection";

export default function AlertDialogPage() {
  return (
    <DocsLayout
      title="Alert Dialog"
      description="A modal dialog that interrupts the user with important content and expects a response."
    >
      <AlertDialogSection />
    </DocsLayout>
  );
}
