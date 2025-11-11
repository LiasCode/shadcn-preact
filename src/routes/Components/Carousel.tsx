import { DocsLayout } from "@/components/Layout/DocsLayout";
import { CarouselSection } from "./Sections/CarouselSection";

export default function CarouselPage() {
  return (
    <DocsLayout
      title="Carousel"
      description="A carousel with motion and swipe built using Embla."
    >
      <CarouselSection />
    </DocsLayout>
  );
}
