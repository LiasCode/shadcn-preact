import { DocsLayout } from "@/components/Layout/DocsLayout";
import { TableSection } from "./Sections/TableSection";

export default function TablePage() {
  return (
    <DocsLayout
      title="Table"
      description="A responsive table component."
    >
      <TableSection />
    </DocsLayout>
  );
}
