import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-preact";

import { type ComponentProps, createContext, type TargetedKeyboardEvent } from "preact";
import { forwardRef, type HTMLAttributes } from "preact/compat";
import { useCallback, useContext, useEffect, useState } from "preact/hooks";
import { Button } from "./button";
import { cn } from "./share/cn";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = createContext<CarouselContextProps | null>(null);

export function useCarousel() {
  const context = useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

export type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
} & HTMLAttributes<HTMLDivElement>;

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  (
    { orientation = "horizontal", opts, setApi, plugins, className, class: classNative, children, ...props },
    forwardedRef
  ) => {
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    );
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback((api: CarouselApi) => {
      if (!api) {
        return;
      }

      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, []);

    const scrollPrev = useCallback(() => {
      api?.scrollPrev();
    }, [api]);

    const scrollNext = useCallback(() => {
      api?.scrollNext();
    }, [api]);

    const handleKeyDown = useCallback(
      (event: TargetedKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          scrollPrev();
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          scrollNext();
        }
      },
      [scrollPrev, scrollNext]
    );

    useEffect(() => {
      if (!api || !setApi) {
        return;
      }

      setApi(api);
    }, [api, setApi]);

    useEffect(() => {
      if (!api) {
        return;
      }

      onSelect(api);
      api.on("reInit", onSelect);
      api.on("select", onSelect);

      return () => {
        api?.off("select", onSelect);
      };
    }, [api, onSelect]);

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        {/** biome-ignore lint/a11y/useAriaPropsSupportedByRole: <> */}
        <section
          // @ts-expect-error ForwardedRef<HTMLDivElement> !=  Ref<HTMLElement>
          ref={forwardedRef}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className, classNative)}
          aria-roledescription="carousel"
          {...props}
        >
          {children}
        </section>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

export type CarouselContentProps = HTMLAttributes<HTMLDivElement>;

const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div
        ref={carouselRef}
        className="overflow-hidden"
      >
        <div
          ref={forwardedRef}
          className={cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className, classNative)}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

export type CarouselItemProps = HTMLAttributes<HTMLDivElement>;

const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ className, class: classNative, ...props }, forwardedRef) => {
    const { orientation } = useCarousel();

    return (
      // biome-ignore lint/a11y/useSemanticElements: <>
      <div
        ref={forwardedRef}
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className,
          classNative
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

export type CarouselPreviousProps = ComponentProps<typeof Button>;

const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  ({ className, class: classNative, variant = "outline", size = "icon", ...props }, forwardedRef) => {
    const { orientation, scrollPrev, canScrollPrev } = useCarousel();

    return (
      <Button
        ref={forwardedRef}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-left-12 -translate-y-1/2 top-1/2"
            : "-top-12 -translate-x-1/2 left-1/2 rotate-90",
          className,
          classNative
        )}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        {...props}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
    );
  }
);
CarouselPrevious.displayName = "CarouselPrevious";

export type CarouselNextProps = ComponentProps<typeof Button>;

const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(
  ({ className, class: classNative, variant = "outline", size = "icon", ...props }, forwardedRef) => {
    const { orientation, scrollNext, canScrollNext } = useCarousel();

    return (
      <Button
        ref={forwardedRef}
        variant={variant}
        size={size}
        className={cn(
          "absolute h-8 w-8 rounded-full",
          orientation === "horizontal"
            ? "-right-12 -translate-y-1/2 top-1/2"
            : "-bottom-12 -translate-x-1/2 left-1/2 rotate-90",
          className,
          classNative
        )}
        disabled={!canScrollNext}
        onClick={scrollNext}
        {...props}
      >
        <ArrowRight className="h-4 w-4" />
        <span className="sr-only">Next slide</span>
      </Button>
    );
  }
);
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi };
