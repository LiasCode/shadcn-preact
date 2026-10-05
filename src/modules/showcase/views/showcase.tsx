import { Toaster } from "@registry/ui/sonner";
import { Toaster as BaseToaster } from "@registry/ui/toast";

import { DocsLayout } from "@/layouts/docs-layout";

import { showcase } from "../demos";
import { useShowcaseContainment } from "../hooks/use-showcase-containment";

export function ShowcaseView() {
  const sectionsRef = useShowcaseContainment();
  return (
    <DocsLayout>
      <Toaster />
      <BaseToaster />
      <div ref={sectionsRef} className="flex min-w-0 flex-col gap-12">
        <header className="space-y-3">
          <h1 className="font-bold text-3xl tracking-tight">Components</h1>
          <p className="text-muted-foreground">
            Explore the components and their examples. Choose a component from the documentation
            menu to jump to its preview.
          </p>
          <a href="/docs/installation" className="text-sm underline underline-offset-4">
            Install the components
          </a>
        </header>
        {showcase.map(({ slug, name, Demo }) => (
          <section
            key={slug}
            id={slug}
            aria-labelledby={`${slug}-title`}
            className="scroll-mt-20 space-y-3 in-data-[containment-ready]:[content-visibility:auto] [contain-intrinsic-size:auto_var(--showcase-height)]"
          >
            <h2 id={`${slug}-title`} className="font-semibold text-xl tracking-tight">
              <a href={`#${slug}`} className="hover:underline">
                {name}
              </a>
            </h2>
            <div className="flex min-h-44 items-center justify-center rounded-lg border p-6">
              <Demo />
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  );
}
