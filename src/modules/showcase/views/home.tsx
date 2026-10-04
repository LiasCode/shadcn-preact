import { Button } from "@registry/ui/button";

import { SiteLayout } from "@/layouts/site-layout";
import { copyComponentsCommand } from "@/lib/site";

import { CodeBlock } from "../components/code-block";

export function HomeView() {
  return (
    <SiteLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8">
        <section className="space-y-4">
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">shadcn/ui for Preact.</h1>
          <p className="text-lg text-muted-foreground">
            An unofficial port of shadcn/ui to Preact and Tailwind CSS v4, with the same component API and Base UI
            primitives ported to Preact. Components are source files you copy into your app, customize, and own.
          </p>
          <Button nativeButton={false} render={<a href="/components" />} className="w-fit">
            Browse components
          </Button>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Get the components</h2>
          <CodeBlock
            code={`bun add class-variance-authority cn lucide-preact @floating-ui/react-dom tw-animate-css shadcn
${copyComponentsCommand}`}
          />
          <p className="text-sm text-muted-foreground">
            Composed components also use their upstream libraries: cmdk, react-day-picker, recharts,
            embla-carousel-react, input-otp, react-resizable-panels, and sonner. Install the ones you use and alias
            React to preact/compat.
          </p>
        </section>
      </div>
    </SiteLayout>
  );
}