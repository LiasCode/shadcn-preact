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
              <a href="/docs/installation/vite">Get started</a>
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <a href="/docs/components">Browse components</a>
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
            Use `degit` to copy the component source from GitHub. Keep the `@ui/*` and `@/*` aliases or update imports
            to match your project.
          </p>
          <CodeBlock
            code={`bun add preact class-variance-authority clsx tailwind-merge lucide-preact
bunx degit https://github.com/LiasCode/shadcn-preact/src/components/ui#main ./src/components/ui`}
          />
        </section>
      </div>
    </DocsLayout>
  );
}

export function ViteInstallationPage() {
  return (
    <DocsLayout>
      <article className="mx-auto grid w-full max-w-5xl gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 space-y-8">
          <header className="space-y-3">
            <Badge
              variant="outline"
              className="w-fit"
            >
              Vite
            </Badge>
            <h1 className="font-bold text-4xl tracking-tight">Install with Vite</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Configure a Vite + Preact project for copy-paste shadcn-preact components. This follows the same shape as
              the official shadcn/ui Vite guide, but replaces the React CLI flow with this port&apos;s manual copy
              workflow.
            </p>
          </header>

          <Section
            id="create-project"
            title="Create a Vite project"
          >
            <p className="text-muted-foreground">
              Start from the Preact TypeScript template. The components in this repository are TypeScript-first and use
              JSX with `preact/compat` where needed.
            </p>
            <CodeBlock
              code={`bun create vite my-app --template preact-ts
cd my-app
bun install`}
            />
          </Section>

          <Section
            id="tailwind"
            title="Install Tailwind CSS"
          >
            <p className="text-muted-foreground">
              This project uses Tailwind CSS v4 through PostCSS. Add Tailwind and the animation utilities used by the
              components.
            </p>
            <CodeBlock code={"bun add -d tailwindcss @tailwindcss/postcss postcss tw-animate-css"} />
            <p className="text-muted-foreground">Create `postcss.config.js`:</p>
            <CodeBlock
              code={`export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
}`}
            />
          </Section>

          <Section
            id="css"
            title="Add theme tokens"
          >
            <p className="text-muted-foreground">
              Replace your global CSS with Tailwind imports and the shadcn-compatible CSS variables. You can copy the
              full token block from this repository&apos;s `src/index.css`.
            </p>
            <CodeBlock
              code={`@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}`}
            />
          </Section>

          <Section
            id="dependencies"
            title="Install component dependencies"
          >
            <p className="text-muted-foreground">
              Install the shared dependencies used across the implemented components. Add optional dependencies only
              when you copy components that need them.
            </p>
            <CodeBlock
              code={`bun add class-variance-authority clsx tailwind-merge lucide-preact

# floating overlays
bun add @floating-ui/react-dom

# calendar
bun add react-day-picker date-fns

# charts
bun add recharts`}
            />
          </Section>

          <Section
            id="aliases"
            title="Configure import aliases"
          >
            <p className="text-muted-foreground">
              Keep `@/*` and `@ui/*` in sync between TypeScript and Vite. The React aliases point React-targeting
              packages at `preact/compat`.
            </p>
            <CodeBlock
              code={`// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@ui/*": ["./src/components/ui/*"],
      "react": ["./node_modules/preact/compat/"],
      "react-dom": ["./node_modules/preact/compat/"]
    }
  }
}`}
            />
            <CodeBlock
              code={`// vite.config.ts
import preact from "@preact/preset-vite";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src/"),
      "@ui": resolve(__dirname, "./src/components/ui/"),
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
});`}
            />
          </Section>

          <Section
            id="copy-utilities"
            title="Copy the component source"
          >
            <p className="text-muted-foreground">
              Use `degit` to download the `src/components/ui` directory directly from the GitHub repository into your
              app. This copies every implemented component plus the shared primitives in `share/`.
            </p>
            <CodeBlock
              code={"bunx degit https://github.com/LiasCode/shadcn-preact/src/components/ui#main ./src/components/ui"}
            />
          </Section>

          <Section
            id="next-steps"
            title="Next steps"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/docs/components"
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="font-medium">Browse components</div>
                <p className="mt-1 text-muted-foreground text-sm">Open the component catalog and copy what you need.</p>
              </a>
              <a
                href="/docs/components/button"
                className="rounded-lg border p-4 transition-colors hover:bg-muted/50"
              >
                <div className="font-medium">Start with Button</div>
                <p className="mt-1 text-muted-foreground text-sm">Verify aliases, utilities, and Tailwind tokens.</p>
              </a>
            </div>
          </Section>
        </div>
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-2 text-sm">
            <div className="font-medium">On This Page</div>
            {[
              ["create-project", "Create project"],
              ["tailwind", "Tailwind CSS"],
              ["css", "Theme tokens"],
              ["dependencies", "Dependencies"],
              ["aliases", "Aliases"],
              ["copy-utilities", "Utilities"],
              ["next-steps", "Next steps"],
            ].map(([id, label]) => (
              <a
                href={`#${id}`}
                className="block text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </a>
            ))}
          </div>
        </aside>
      </article>
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
              Copy the component source into your project with `degit`. This port is intentionally not distributed as an
              npm package.
            </p>
            <CodeBlock
              code={"bunx degit https://github.com/LiasCode/shadcn-preact/src/components/ui#main ./src/components/ui"}
            />
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
