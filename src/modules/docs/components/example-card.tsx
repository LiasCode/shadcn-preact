import { Button } from "@registry/ui/button";
import { cn } from "@registry/ui/lib/utils";
import { CodeIcon, ExternalLinkIcon, LinkIcon } from "lucide-preact";
import type { ComponentType } from "preact";
import { Suspense } from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

import type { ComponentExample } from "@/lib/component-examples";
import { repositoryUrl } from "@/lib/site";
import { CodeBlock } from "@/modules/showcase/components/code-block";

export type DocumentationExample = ComponentExample & { Preview: ComponentType };

export function ExampleCard({
  example,
  slug,
  primary = false,
  active,
  onActivate,
}: {
  example: DocumentationExample;
  slug: string;
  primary?: boolean;
  active?: boolean;
  onActivate?: () => void;
}) {
  const { Preview } = example;
  const container = useRef<HTMLDivElement>(null);
  const [visited, setVisited] = useState(primary);
  const [showCode, setShowCode] = useState(false);
  const mounted = onActivate ? active : visited;
  const id = `example-${example.id}`;

  useEffect(() => {
    if (visited || onActivate || !container.current) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisited(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisited(true);
          observer.disconnect();
        }
      },
      { rootMargin: "240px" },
    );
    observer.observe(container.current);

    return () => observer.disconnect();
  }, [visited, onActivate]);

  return (
    <section
      id={id}
      className="min-w-0 scroll-mt-20 space-y-3"
      aria-labelledby={`${id}-title`}
      data-example={example.id}
    >
      {!primary && (
        <div className="space-y-2">
          <h3
            id={`${id}-title`}
            className="group flex items-center gap-2 text-xl font-semibold tracking-tight"
          >
            {example.title}
            <a
              href={`#${id}`}
              aria-label={`Link to ${example.title}`}
              className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <LinkIcon className="size-4" />
            </a>
          </h3>
          {example.description && (
            <p className="text-sm leading-7 text-muted-foreground">{example.description}</p>
          )}
        </div>
      )}
      <div className="min-w-0 overflow-hidden rounded-xl border bg-background">
        <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-2.5">
          <span
            id={primary ? `${id}-title` : undefined}
            className="text-xs font-medium text-muted-foreground"
          >
            {primary ? "Preview" : example.title}
          </span>
          <a
            href={`${repositoryUrl}/blob/main/${example.sourcePath}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            aria-label={`Source for ${example.title}`}
          >
            Source <ExternalLinkIcon className="size-3.5" />
          </a>
        </div>
        <div
          ref={container}
          data-example-preview={example.id}
          className={cn(
            "relative flex min-h-52 w-full min-w-0 items-center justify-center overflow-x-auto p-6 sm:p-10",
            slug === "carousel" && "px-14 py-14 sm:px-16",
            slug === "chart" && "min-h-80 [&>div]:w-full [&>div]:max-w-full",
            slug === "sidebar" &&
              "isolate h-[440px] overflow-hidden p-0 sm:p-0 [transform:translateZ(0)] [&>div]:h-full [&>div]:w-full [&_[data-slot=sidebar-container]]:h-full [&_[data-slot=sidebar-wrapper]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-0",
            ["message", "message-scroller", "questionnaire"].includes(slug) &&
              "items-start [&>div]:w-full [&>div]:min-w-0",
          )}
        >
          {mounted ? (
            <Suspense
              fallback={
                <p role="status" className="text-sm text-muted-foreground">
                  Loading preview…
                </p>
              }
            >
              <Preview />
            </Suspense>
          ) : onActivate ? (
            <Button variant="outline" onClick={onActivate}>
              Show preview
            </Button>
          ) : (
            <span className="text-sm text-muted-foreground">Preview</span>
          )}
        </div>
        <div className="border-t bg-muted/20">
          <Button
            variant="ghost"
            size="sm"
            className="m-2"
            aria-expanded={showCode}
            aria-controls={`${id}-code`}
            onClick={() => setShowCode(!showCode)}
          >
            <CodeIcon /> {showCode ? "Hide code" : "View code"}
          </Button>
          <div
            id={`${id}-code`}
            hidden={!showCode}
            className="max-h-[32rem] overflow-auto border-t p-3 sm:p-4"
          >
            {showCode && <CodeBlock code={example.code} />}
          </div>
        </div>
      </div>
      {(example.components.length > 0 ||
        example.packages.length > 0 ||
        example.helpers.length > 0) && (
        <details className="text-xs leading-6 text-muted-foreground">
          <summary className="w-fit cursor-pointer hover:text-foreground">
            Example requirements
          </summary>
          <div className="mt-2 space-y-2">
            {example.components.length > 0 && (
              <p>
                Also uses:{" "}
                {example.components.map((component, index) => (
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
                .
              </p>
            )}
            {example.packages.length > 0 && (
              <CodeBlock code={`bun add --exact ${example.packages.join(" ")}`} />
            )}
            {example.helpers.length > 0 && (
              <p>
                Copy the example’s local helpers and preserve their relative imports:{" "}
                {example.helpers.map((path, index) => (
                  <span key={path}>
                    {index > 0 && ", "}
                    <a
                      href={`${repositoryUrl}/blob/main/${path}`}
                      className="underline underline-offset-4"
                    >
                      {path.split("/").at(-1)}
                    </a>
                  </span>
                ))}
                .
              </p>
            )}
          </div>
        </details>
      )}
    </section>
  );
}
