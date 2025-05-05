import { DocsLayout } from "@/components/Layout/DocsLayout";
import { AvatarSection } from "./Sections/AvatarSection";

export default function AvatarPage() {
  return (
    <DocsLayout
      title="Avatar"
      description="An image element with a fallback for representing the user."
    >
      <AvatarSection />
    </DocsLayout>
  );
}
