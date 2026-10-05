import { buttonVariants } from "@registry/ui/button";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-preact";
import type { ComponentType } from "preact";
import { lazy } from "preact-iso";

import { DocsLayout } from "@/layouts/docs-layout";
import { componentCatalog } from "@/lib/component-catalog";
import { repositoryUrl } from "@/lib/site";
import { CodeBlock } from "@/modules/showcase/components/code-block";

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
  example: string;
  examplePath: string;
  referenceUrl: string;
  helpers: string[];
  relatedComponents: { slug: string; name: string }[];
};

export function ComponentView({
  documentation: doc,
  Demo,
}: {
  documentation: ComponentDocumentation;
  Demo: ComponentType;
}) {
  const index = componentCatalog.findIndex(({ slug }) => slug === doc.slug);
  const previous = componentCatalog[index - 1];
  const next = componentCatalog[index + 1];

  return (
    <DocsLayout toc={toc}>
      {doc.needsNotifications && <NotificationViewports />}
      <article className="min-w-0 space-y-10">
        <header className="space-y-3">
          <a href="/docs/components" className="text-sm text-muted-foreground hover:underline">
            Components
          </a>
          <h1 className="font-bold text-3xl tracking-tight sm:text-4xl">{doc.name}</h1>
          <p className="text-lg text-muted-foreground">{doc.description}</p>
        </header>
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
            Run this from your project root. It selects {doc.slug}.tsx, its local dependencies, and
            both licenses directly from the repository, then copies them into src/components/ui.
          </p>
          <CodeBlock code={doc.installCommand} />
          <p className="text-sm text-muted-foreground">
            The temporary copy lives in .cache/shadcn-preact/{doc.slug}. Existing components stay in
            place; shared source files are updated from main.
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
        <section id="examples" className="scroll-mt-20 space-y-4" aria-labelledby="examples-title">
          <h2 id="examples-title" className="font-semibold text-2xl tracking-tight">
            Examples
          </h2>
          <div className="flex min-h-44 min-w-0 items-center justify-center rounded-lg border p-4 sm:p-6">
            <Demo />
          </div>
          <details className="rounded-lg border p-4">
            <summary className="cursor-pointer text-sm font-medium">
              View basic example code
            </summary>
            {doc.helpers.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">
                This showcase example also uses app helpers:{" "}
                {doc.helpers.map((path) => (
                  <a
                    key={path}
                    href={`${repositoryUrl}/blob/main/${path}`}
                    className="mr-2 underline underline-offset-4"
                  >
                    {path.split("/").at(-1)}
                  </a>
                ))}
              </p>
            )}
            <div className="mt-4">
              <CodeBlock code={doc.example} />
            </div>
            <a
              href={`${repositoryUrl}/blob/main/${doc.examplePath}`}
              className="mt-3 inline-block text-sm underline underline-offset-4"
            >
              Example source
            </a>
          </details>
        </section>
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
