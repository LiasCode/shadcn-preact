import { buttonVariants } from "@registry/ui/button";
import { ArrowRightIcon } from "lucide-preact";

import { DocsLayout } from "@/layouts/docs-layout";
import { repositoryUrl } from "@/lib/site";

const sections = [
  { id: "open-code", title: "Own your code" },
  { id: "composition", title: "Composition" },
  { id: "preact", title: "Built for Preact" },
];

export function IntroductionView() {
  return (
    <DocsLayout toc={sections}>
      <article className="space-y-10">
        <header className="space-y-4">
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">Introduction</h1>
          <p className="text-lg text-muted-foreground">
            Reusable shadcn/ui components, adapted to Preact 11. Copy the source into your project
            and build your own component library.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            This is an unofficial port of the Base UI base and nova style. Components are
            distributed as source files rather than an npm component package.
          </p>
        </header>
        <section id="open-code" className="scroll-mt-20 space-y-3">
          <h2 className="font-semibold text-2xl tracking-tight">Own your code</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            The wrappers, primitives, and utilities live in your app. Change their styles and
            behavior directly, and keep only the components and supporting files you need.
          </p>
        </section>
        <section id="composition" className="scroll-mt-20 space-y-3">
          <h2 className="font-semibold text-2xl tracking-tight">Composition</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Build interfaces from small parts with the upstream component APIs and Tailwind CSS v4
            classes. Use the component showcase to explore examples, and the official Base UI
            documentation for composition patterns.
          </p>
        </section>
        <section id="preact" className="scroll-mt-20 space-y-3">
          <h2 className="font-semibold text-2xl tracking-tight">Built for Preact</h2>
          <p className="text-sm leading-7 text-muted-foreground">
            The headless primitives are ported to Preact. Calendar, Chart, and other composed
            components retain their upstream libraries through preact/compat. The installation guide
            covers compatibility aliases, styles, and dependencies.
          </p>
          <p className="text-sm leading-7 text-muted-foreground">
            The port follows a pinned upstream revision. See the{" "}
            <a
              className="underline underline-offset-4"
              href={`${repositoryUrl}/blob/main/AGENTS.md`}
            >
              coverage and remaining limitations
            </a>{" "}
            for the current verification scope.
          </p>
        </section>
        <div className="flex justify-end border-t pt-6">
          <a href="/docs/installation" className={buttonVariants({ variant: "outline" })}>
            Installation <ArrowRightIcon aria-hidden="true" />
          </a>
        </div>
      </article>
    </DocsLayout>
  );
}
