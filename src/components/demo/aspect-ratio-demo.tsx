import { AspectRatio } from "@ui/aspect-ratio";

export function AspectRatioDemo() {
  return (
    <div className="flex h-auto w-full max-w-sm flex-row gap-4">
      <div className="w-full max-w-48">
        <AspectRatio
          ratio={1 / 1}
          className="rounded-lg bg-muted"
        >
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Aspect Ratio Demo"
            className="rounded-lg object-cover grayscale dark:brightness-20"
          />
        </AspectRatio>
      </div>

      <div className="w-full max-w-40">
        <AspectRatio
          ratio={9 / 16}
          className="rounded-lg bg-muted"
        >
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Aspect Ratio Demo 2"
            className="rounded-lg object-cover grayscale dark:brightness-20"
          />
        </AspectRatio>
      </div>
    </div>
  );
}
