import { Badge } from "@registry/ui/badge";

import { DocsLayout } from "@/layouts/docs-layout";
import { copyComponentsCommand } from "@/lib/site";

import { CodeBlock } from "../components/code-block";
import { Section } from "../components/section";
import { TableOfContents } from "../components/table-of-contents";

const sections = [
  { id: "create-project", label: "Create project" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "css", label: "Theme tokens" },
  { id: "dependencies", label: "Dependencies" },
  { id: "aliases", label: "Aliases" },
  { id: "copy-utilities", label: "Utilities" },
  { id: "next-steps", label: "Next steps" },
] as const;

export function ViteInstallationView() {
  return (
    <DocsLayout>
      <article className="mx-auto grid w-full max-w-5xl gap-10 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0 space-y-8">
          <header className="space-y-3">
            <Badge variant="outline" className="w-fit">
              Vite
            </Badge>
            <h1 className="font-bold text-4xl tracking-tight">Install with Vite</h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              Configure a Vite + Preact project for copy-paste shadcn-preact components. This follows the same shape as
              the official shadcn/ui Vite guide, but replaces the React CLI flow with this port&apos;s manual copy
              workflow.
            </p>
          </header>

          <Section id="create-project" title="Create a Vite project">
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

          <Section id="tailwind" title="Install Tailwind CSS">
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

          <Section id="css" title="Add theme tokens">
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

          <Section id="dependencies" title="Install component dependencies">
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

          <Section id="aliases" title="Configure import aliases">
            <p className="text-muted-foreground">
              Keep `@/*` in sync between TypeScript and Vite. The React aliases point React-targeting packages at
              `preact/compat`.
            </p>
            <CodeBlock
              code={`// tsconfig.app.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
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
      react: "preact/compat",
      "react-dom": "preact/compat",
    },
  },
});`}
            />
          </Section>

          <Section id="copy-utilities" title="Copy the component source">
            <p className="text-muted-foreground">
              Use `degit` to download the `registry/ui` directory directly from the GitHub repository into your app.
              This copies every implemented component plus the shared primitives in `share/`.
            </p>
            <CodeBlock code={copyComponentsCommand} />
          </Section>

          <Section id="next-steps" title="Next steps">
            <div className="grid gap-3 sm:grid-cols-2">
              <a href="/docs/components" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="font-medium">Browse components</div>
                <p className="mt-1 text-muted-foreground text-sm">Open the component catalog and copy what you need.</p>
              </a>
              <a href="/docs/components/button" className="rounded-lg border p-4 transition-colors hover:bg-muted/50">
                <div className="font-medium">Start with Button</div>
                <p className="mt-1 text-muted-foreground text-sm">Verify aliases, utilities, and Tailwind tokens.</p>
              </a>
            </div>
          </Section>
        </div>
        <TableOfContents items={sections} />
      </article>
    </DocsLayout>
  );
}