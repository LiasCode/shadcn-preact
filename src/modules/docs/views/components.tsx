import { DocsLayout } from "@/layouts/docs-layout";
import { componentCatalog } from "@/lib/component-catalog";

export function ComponentsView() {
  return (
    <DocsLayout>
      <div className="space-y-8">
        <header className="space-y-3">
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">Components</h1>
          <p className="text-lg text-muted-foreground">
            Explore the catalog. Each component has its own installation guide, usage, and
            interactive examples.
          </p>
        </header>
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {componentCatalog.map(({ slug, name }) => (
            <li key={slug} id={slug} className="scroll-mt-20">
              <a
                href={`/docs/components/${slug}`}
                className="block rounded-lg border p-4 text-sm font-medium hover:bg-muted"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </DocsLayout>
  );
}
