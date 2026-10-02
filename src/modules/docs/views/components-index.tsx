import { DocsLayout } from "@/layouts/docs-layout";

import { componentCategories, components } from "../catalog";

export function ComponentsIndexView() {
  return (
    <DocsLayout>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <section className="space-y-3">
          <h1 className="font-bold text-4xl tracking-tight">Components</h1>
          <p className="max-w-2xl text-muted-foreground">
            All implemented components in this Preact port. Each page includes a live preview, usage snippet, exports,
            and copy-paste notes.
          </p>
        </section>
        {componentCategories.map((category) => (
          <section className="space-y-3">
            <h2 className="font-semibold text-xl tracking-tight">{category}</h2>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {components
                .filter((entry) => entry.category === category)
                .map((entry) => (
                  <a
                    href={`/docs/components/${entry.slug}`}
                    className="block rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50"
                  >
                    <div className="font-medium">{entry.name}</div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">{entry.description}</p>
                  </a>
                ))}
            </div>
          </section>
        ))}
      </div>
    </DocsLayout>
  );
}