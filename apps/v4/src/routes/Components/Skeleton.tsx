import { DocsLayout } from "@/components/Layout/DocsLayout";
import { SkeletonSection } from "./Sections/SkeletonSection";

export default function SkeletonPage() {
  return (
    <DocsLayout
      title="Skeleton"
      description="Use to show a placeholder while content is loading."
    >
      <SkeletonSection />
    </DocsLayout>
  );
}
