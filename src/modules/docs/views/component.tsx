import { Badge } from "@registry/ui/badge";
import { Button } from "@registry/ui/button";
import { Separator } from "@registry/ui/separator";

import { DocsLayout } from "@/layouts/docs-layout";
import { copyComponentsCommand } from "@/lib/site";

import { getComponent, getNextComponent } from "../catalog";
import { CodeBlock } from "../components/code-block";
import { Section } from "../components/section";
import { TableOfContents } from "../components/table-of-contents";
import { demos } from "../demos";
import { usageSnippet } from "../usage";

const sections = [
  { id: "preview", label: "Preview" },
  { id: "installation", label: "Installation" },
  { id: "usage", label: "Usage" },
  { id: "api", label: "API Reference" },
] as const;

export function ComponentView({ slug }: { slug: string }) {
  const entry = getComponent(slug);

  if (!entry) {
    return (
      <DocsLayout>
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="font-bold text-4xl tracking-tight">Component not found</h1>
          <p className="text-muted-foreground">The requested component does not exist in this port.</p>
          <Button asChild>
            <a href="/docs/components">Back to components</a>
          </Button>
        </div>
      </DocsLayout>
    );
  }

  const Demo = demos[entry.slug];

  return (
    <DocsLayout activeSlug={entry.slug}>
      <article className="mx-auto grid w-full max-w-5xl gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{entry.category}</Badge>
              <span className="text-muted-foreground text-sm">src/components/ui/{entry.slug}.tsx</span>
            </div>
            <h1 className="font-bold text-4xl tracking-tight">{entry.name}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{entry.description}</p>
          </header>

          <section id="preview" className="space-y-3">
            <h2 className="font-semibold text-2xl tracking-tight">Preview</h2>
            <div className="flex min-h-44 items-center justify-center rounded-lg border bg-card p-6">
              <Demo />
            </div>
          </section>

          <Section id="installation" title="Installation">
            <p className="text-muted-foreground">
              Copy the component source into your project with `degit`. This port is intentionally not distributed as an
              npm package.
            </p>
            <CodeBlock code={copyComponentsCommand} />
            {entry.dependencies && (
              <p className="text-muted-foreground text-sm">External dependencies: {entry.dependencies.join(", ")}.</p>
            )}
          </Section>

          <Section id="usage" title="Usage">
            <CodeBlock code={usageSnippet(entry)} />
          </Section>

          <Section id="api" title="API Reference">
            <div className="rounded-lg border">
              <div className="grid grid-cols-[1fr_2fr] border-b bg-muted/50 px-4 py-2 font-medium text-sm">
                <span>Export</span>
                <span>Purpose</span>
              </div>
              {entry.exports.map((item) => (
                <div className="grid grid-cols-[1fr_2fr] gap-4 border-b px-4 py-3 text-sm last:border-b-0">
                  <code className="font-mono">{item}</code>
                  <span className="text-muted-foreground">
                    Composable part exported by `@/components/ui/{entry.slug}`.
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Separator />
          <div className="flex justify-between gap-3">
            <Button variant="outline" asChild>
              <a href="/docs/components">All components</a>
            </Button>
            <Button asChild>
              <a href={`/docs/components/${getNextComponent(entry.slug)?.slug}`}>Next component</a>
            </Button>
          </div>
        </div>
        <TableOfContents items={sections} />
      </article>
    </DocsLayout>
  );
}