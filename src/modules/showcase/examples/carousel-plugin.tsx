import { Card, CardContent } from "@registry/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@registry/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import * as React from "preact/compat";

export default function CarouselPlugin() {
  const plugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  const root = React.useRef<HTMLDivElement>(null);
  const visible = React.useRef(false);
  const [api, setApi] = React.useState<CarouselApi>();
  React.useEffect(() => {
    if (!api || !root.current || typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    let resume = plugin.current.isPlaying();
    const observer = new IntersectionObserver(([entry]) => {
      const next = entry?.isIntersecting ?? false;
      if (next === visible.current) {
        if (!next) plugin.current.stop();
        return;
      }
      visible.current = next;
      if (next) {
        if (resume && !root.current?.matches(":hover")) plugin.current.play();
      } else {
        resume = plugin.current.isPlaying();
        plugin.current.stop();
      }
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [api]);

  return (
    <Carousel
      ref={root}
      setApi={setApi}
      plugins={[plugin.current]}
      className="w-full max-w-[10rem] sm:max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={() => {
        if (visible.current || typeof IntersectionObserver === "undefined") plugin.current.reset();
      }}
    >
      <CarouselContent>
        {Array.from({ length: 5 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{index + 1}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}