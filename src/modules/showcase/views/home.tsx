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
            An unofficial port of shadcn/ui to Preact and Tailwind CSS v4, with the same component API and without Radix
            UI. Components are source files you copy into your app, customize, and own.
          </p>
          <Button nativeButton={false} render={<a href="/components" />} className="w-fit">
            Browse components
          </Button>
        </section>
        <section className="space-y-3">
          <h2 className="font-semibold text-xl tracking-tight">Get the components</h2>
          <CodeBlock
            code={`bun add class-variance-authority cn clsx tailwind-merge lucide-preact tw-animate-css shadcn
${copyComponentsCommand}`}
          />
        </section>
      </div>
    </SiteLayout>
  );
}