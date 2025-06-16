import { DocsLayout } from "@/components/Layout/DocsLayout";
import { BreadcrumbSection } from "./Sections/BreadcrumSection";

export default function BreadcrumbsPage() {
  return (
    <DocsLayout
      title="Breadcrumbs"
      description="Displays the path to the current resource using a hierarchy of links."
    >
      <BreadcrumbSection />
    </DocsLayout>
  );
}
