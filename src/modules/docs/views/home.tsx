import { Badge } from "@registry/ui/badge";
import { Button } from "@registry/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@registry/ui/card";

import { DocsLayout } from "@/layouts/docs-layout";
import { copyComponentsCommand } from "@/lib/site";

import { CodeBlock } from "../components/code-block";

export function HomeView() {
  return (
    <DocsLayout>
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
        <section className="space-y-4">
          <Badge className="w-fit" variant="outline">
            Copy-paste components for Preact
          </Badge>
          <h1 className="font-bold text-4xl tracking-tight sm:text-5xl">Build your own shadcn/ui-style Preact kit.</h1>
          <p className="text-lg text-muted-foreground">
            This project ports the shadcn/ui component patterns to Preact with Tailwind CSS v4 and minimal external
            dependencies. Components are source files you copy into your app, customize, and own.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href="/docs/installation/vite">Get started</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/docs/components">Browse components</a>
            </Button>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Copy the code</CardTitle>
              <CardDescription>No npm package. Components live in `registry/ui`.</CardDescription>
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
            Use `degit` to copy the component source from GitHub. Components import each other with relative paths, so
            they work in any folder.
          </p>
          <CodeBlock
            code={`bun add preact class-variance-authority clsx tailwind-merge lucide-preact
${copyComponentsCommand}`}
          />
        </section>
      </div>
    </DocsLayout>
  );
}