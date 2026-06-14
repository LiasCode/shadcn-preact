import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, CopyIcon } from "lucide-preact";
import { useState } from "preact/compat";
import { DocsLayout } from "./DocsLayout";
import { componentCategories, componentDocs, getComponentDoc } from "./docs-data";

export function DocsHomePage() {
  return (
    <DocsLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <section className="space-y-4">
          <Badge
            className="w-fit"
            variant="outline"
          >
            Copy-paste components for Preact
          </Badge>
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">Build your own shadcn/ui-style Preact kit.</h1>
          <p className="text-lg text-muted-foreground">
            This project ports the shadcn/ui component patterns to Preact with Tailwind CSS v4 and minimal external
            dependencies. Components are source files you copy into your app, customize, and own.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href="/docs/components">Browse components</a>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <a href="https://github.com/LiasCode/shadcn-preact">View on GitHub</a>
            </Button>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Copy the code</CardTitle>
              <CardDescription>No npm package. Components live in `src/components/ui`.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Preact first</CardTitle>
              <CardDescription>Uses `preact/compat` only where React-compatible APIs are useful.</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Radix-free</CardTitle>
              <CardDescription>Local primitives replace Radix patterns where possible.</CardDescription>
            </CardHeader>
          </Card>
        </section>
        <section className="space-y-4">
          <h2 className="font-semibold text-2xl tracking-tight">Installation</h2>
          <p className="text-muted-foreground">
            Copy the component file and any files it imports from `src/components/ui/share`. Keep the `@ui/*` and `@/*`
            aliases or update imports to match your project.
          </p>
          <CodeBlock code={"bun add preact class-variance-authority clsx tailwind-merge lucide-preact"} />
        </section>
      </div>
    </DocsLayout>
  );
}

export function ComponentsIndexPage() {
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
        {componentCategories.map((category) => {
          const docs = componentDocs.filter((doc) => doc.category === category);
          return (
            <section className="space-y-3">
              <h2 className="font-semibold text-xl tracking-tight">{category}</h2>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {docs.map((doc) => (
                  <a
                    href={`/docs/components/${doc.slug}`}
                    className="block rounded-lg border bg-card p-4 text-card-foreground transition-colors hover:bg-muted/50"
                  >
                    <div className="font-medium">{doc.name}</div>
                    <p className="mt-1 line-clamp-2 text-muted-foreground text-sm">{doc.description}</p>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </DocsLayout>
  );
}

export function ComponentDocPage({ slug }: { slug: string }) {
  const doc = getComponentDoc(slug);

  if (!doc) {
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

  const Demo = doc.demo;

  return (
    <DocsLayout activeSlug={doc.slug}>
      <article className="mx-auto grid w-full max-w-5xl gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 space-y-8">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{doc.category}</Badge>
              <span className="text-muted-foreground text-sm">src/components/ui/{doc.slug}.tsx</span>
            </div>
            <h1 className="font-bold text-4xl tracking-tight">{doc.name}</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">{doc.description}</p>
          </header>

          <section
            id="preview"
            className="space-y-3"
          >
            <h2 className="font-semibold text-2xl tracking-tight">Preview</h2>
            <div className="flex min-h-44 items-center justify-center rounded-lg border bg-card p-6">
              <Demo />
            </div>
          </section>

          <Section
            id="installation"
            title="Installation"
          >
            <p className="text-muted-foreground">
              Copy the component source into your project. This port is intentionally not distributed as an npm package.
            </p>
            <CodeBlock code={`cp src/components/ui/${doc.slug}.tsx your-app/src/components/ui/${doc.slug}.tsx`} />
            {doc.dependencies && (
              <p className="text-muted-foreground text-sm">External dependencies: {doc.dependencies.join(", ")}.</p>
            )}
          </Section>

          <Section
            id="usage"
            title="Usage"
          >
            <CodeBlock code={doc.usage} />
          </Section>

          <Section
            id="api"
            title="API Reference"
          >
            <div className="rounded-lg border">
              <div className="grid grid-cols-[1fr_2fr] border-b bg-muted/50 px-4 py-2 font-medium text-sm">
                <span>Export</span>
                <span>Purpose</span>
              </div>
              {doc.exports.map((item) => (
                <div className="grid grid-cols-[1fr_2fr] gap-4 border-b px-4 py-3 text-sm last:border-b-0">
                  <code className="font-mono">{item}</code>
                  <span className="text-muted-foreground">
                    Composable part exported by `@/components/ui/{doc.slug}`.
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Separator />
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              asChild
            >
              <a href="/docs/components">All components</a>
            </Button>
            <Button asChild>
              <a href={`/docs/components/${nextDoc(doc.slug)?.slug ?? componentDocs[0]?.slug}`}>Next component</a>
            </Button>
          </div>
        </div>
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-2 text-sm">
            <div className="font-medium">On This Page</div>
            {["preview", "installation", "usage", "api"].map((id) => (
              <a
                href={`#${id}`}
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                {id === "api" ? "API Reference" : id[0]!.toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </aside>
      </article>
    </DocsLayout>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: preact.ComponentChildren }) {
  return (
    <section
      id={id}
      className="scroll-mt-20 space-y-3"
    >
      <h2 className="font-semibold text-2xl tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-lg border bg-muted/40">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Copy code"
        className="absolute top-2 right-2"
        onClick={async () => {
          if (typeof navigator === "undefined" || !navigator.clipboard) return;
          await navigator.clipboard.writeText(code);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </Button>
      <pre className="overflow-x-auto p-4 pr-12 text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function nextDoc(slug: string) {
  const index = componentDocs.findIndex((doc) => doc.slug === slug);
  return componentDocs[index + 1] ?? componentDocs[0];
}
