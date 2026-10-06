import { buttonVariants } from "@registry/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-preact";
import { lazy } from "preact-iso";
import { useState } from "preact/hooks";

import { DocsLayout } from "@/layouts/docs-layout";
import { componentCatalog } from "@/lib/component-catalog";
import type { ComponentExample } from "@/lib/component-examples";
import { cliCommand, repositoryUrl } from "@/lib/site";
import { CodeBlock } from "@/modules/showcase/components/code-block";

import { ExampleCard, type DocumentationExample } from "../components/example-card";

const NotificationViewports = lazy(() =>
  import("../notification-viewports").then((module) => module.NotificationViewports),
);
const toc = [
  { id: "installation", title: "Installation" },
  { id: "usage", title: "Usage" },
  { id: "examples", title: "Examples" },
  { id: "reference", title: "Reference" },
];

export type ComponentDocumentation = {
  slug: string;
  name: string;
  description: string;
  packages: string[];
  needsNotifications: boolean;
  files: string[];
  installCommand: string;
  usage: string[];
  examples: ComponentExample[];
  referenceUrl: string;
  relatedComponents: { slug: string; name: string }[];
};

export function ComponentView({
  documentation: doc,
  examples,
}: {
  documentation: ComponentDocumentation;
  examples: DocumentationExample[];
}) {
  const primary = examples[0]!;
  const variants = examples.slice(1);
  const [activeExample, setActiveExample] = useState(primary.id);
  const exclusive = [
    "calendar",
    "sidebar",
    "message",
    "message-scroller",
    "questionnaire",
  ].includes(doc.slug);
  const contents = [
    ...toc.slice(0, 2),
    ...(variants.length > 0
      ? [
          { id: "examples", title: "Examples" },
          ...variants.map((example) => ({
            id: `example-${example.id}`,
            title: example.title,
            nested: true,
          })),
        ]
      : []),
    toc[3]!,
  ];

  function renderExample(example: DocumentationExample, primary = false) {
    return (
      <ExampleCard
        key={example.id}
        example={example}
        slug={doc.slug}
        primary={primary}
        active={activeExample === example.id}
        onActivate={exclusive ? () => setActiveExample(example.id) : undefined}
      />
    );
  }

  const index = componentCatalog.findIndex(({ slug }) => slug === doc.slug);
  const previous = componentCatalog[index - 1];
  const next = componentCatalog[index + 1];

  return (
    <DocsLayout toc={contents}>
      {doc.needsNotifications && <NotificationViewports />}
      <article className="min-w-0 space-y-10">
        <header className="space-y-3">
          <a href="/docs/components" className="text-sm text-muted-foreground hover:underline">
            Components
          </a>
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{doc.name}</h1>
          <p className="text-lg text-muted-foreground">{doc.description}</p>
        </header>
        {renderExample(primary, true)}
        <section
          id="installation"
          className="scroll-mt-20 space-y-4"
          aria-labelledby="installation-title"
        >
          <h2 id="installation-title" className="font-semibold text-2xl tracking-tight">
            Installation
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            Complete the{" "}
            <a href="/docs/installation" className="underline underline-offset-4">
              project setup
            </a>{" "}
            first, including Tailwind CSS v4, theme tokens, and Preact compatibility aliases.
          </p>
          <h3 className="font-medium">CLI</h3>
          <p className="text-sm leading-7 text-muted-foreground">
            Run init once using the{" "}
            <a href="/docs/installation#cli" className="underline underline-offset-4">
              installation guide
            </a>
            , then add this component. The CLI copies the required source files and installs their
            exact dependencies with Bun.
          </p>
          <CodeBlock
            code={`${cliCommand} add ${[doc.slug, ...doc.relatedComponents.map((component) => component.slug)].join(" ")}`}
          />
          <p className="text-sm text-muted-foreground">
            Add --dry-run to review the changes. Existing modified files are protected; use
            --overwrite only when you want to replace them.
          </p>
          <details className="rounded-xl border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              Manual installation / degit (optional)
            </summary>
            <div className="mt-5 space-y-4">
              <h3 className="font-medium">1. Install dependencies</h3>
              <CodeBlock code={`bun add --exact ${doc.packages.join(" ")}`} />
              {doc.relatedComponents.length > 0 && (
                <p className="text-sm leading-7 text-muted-foreground">
                  The usage example also needs{" "}
                  {doc.relatedComponents.map((component, index) => (
                    <span key={component.slug}>
                      {index > 0 && ", "}
                      <a
                        href={`/docs/components/${component.slug}`}
                        className="underline underline-offset-4"
                      >
                        {component.name}
                      </a>
                    </span>
                  ))}
                  . Follow their installation guides as well.
                </p>
              )}
              <h3 className="font-medium">2. Copy the component with degit</h3>
              <p className="text-sm leading-7 text-muted-foreground">
                Run this from your project root. It selects {doc.slug}.tsx, its local dependencies,
                and both licenses directly from the repository, then copies them into
                src/components/ui.
              </p>
              <CodeBlock code={doc.installCommand} />
              <p className="text-sm text-muted-foreground">
                The temporary copy lives in .cache/shadcn-preact/{doc.slug}. Existing components
                stay in place; shared source files are updated from main.
              </p>
              <details className="rounded-lg border p-4">
                <summary className="cursor-pointer text-sm font-medium">
                  Selected source files ({doc.files.length})
                </summary>
                <ul className="mt-3 max-h-72 space-y-1 overflow-auto text-xs">
                  {doc.files.map((file) => (
                    <li key={file}>
                      <a
                        className="underline underline-offset-4"
                        href={`${repositoryUrl}/blob/main/registry/ui/${file}`}
                      >
                        {file}
                      </a>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          </details>
          {(doc.slug === "toast" || doc.slug === "sonner") && (
            <div className="space-y-3">
              <h3 className="font-medium">3. Mount the notification viewport</h3>
              <p className="text-sm text-muted-foreground">
                Render Toaster once in your app so notifications are visible.
              </p>
              <CodeBlock
                code={`import { Toaster } from "./components/ui/${doc.slug}";

export function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  );
}`}
              />
            </div>
          )}
        </section>
        <section id="usage" className="scroll-mt-20 space-y-4" aria-labelledby="usage-title">
          <h2 id="usage-title" className="font-semibold text-2xl tracking-tight">
            Usage
          </h2>
          {doc.usage.map((code, index) => (
            <CodeBlock key={index} code={code} />
          ))}
        </section>
        {variants.length > 0 && (
          <section
            id="examples"
            className="scroll-mt-20 space-y-8"
            aria-labelledby="examples-title"
          >
            <h2 id="examples-title" className="font-semibold text-2xl tracking-tight">
              Examples
            </h2>
            {variants.map((example) => renderExample(example))}
          </section>
        )}
        <section
          id="reference"
          className="scroll-mt-20 space-y-3"
          aria-labelledby="reference-title"
        >
          <h2 id="reference-title" className="font-semibold text-2xl tracking-tight">
            Reference
          </h2>
          <p className="text-sm leading-7 text-muted-foreground">
            See the{" "}
            <a href={doc.referenceUrl} className="underline underline-offset-4">
              official {doc.name} documentation
            </a>{" "}
            for composition patterns and API details. This page uses the Preact port and examples
            from the pinned upstream revision.
          </p>
          <a
            href={`${repositoryUrl}/blob/main/registry/ui/${doc.slug}.tsx`}
            className="text-sm underline underline-offset-4"
          >
            Component source
          </a>
        </section>
        <nav
          aria-label="Component pages"
          className="flex flex-wrap justify-between gap-3 border-t pt-6"
        >
          {previous ? (
            <a
              href={`/docs/components/${previous.slug}`}
              className={buttonVariants({ variant: "outline" })}
            >
              <ArrowLeftIcon aria-hidden="true" />
              {previous.name}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a
              href={`/docs/components/${next.slug}`}
              className={buttonVariants({ variant: "outline" })}
            >
              {next.name}
              <ArrowRightIcon aria-hidden="true" />
            </a>
          )}
        </nav>
      </article>
    </DocsLayout>
  );
}
