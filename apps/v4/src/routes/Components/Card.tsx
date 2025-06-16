import { DocsLayout } from "@/components/Layout/DocsLayout";
import { CardsSection } from "./Sections/CardsSection";

export default function CardPage() {
  return (
    <DocsLayout
      title="Card"
      description="Displays a card with header, content, and footer."
    >
      <CardsSection />
    </DocsLayout>
  );
}
