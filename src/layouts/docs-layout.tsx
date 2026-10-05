import type { ComponentChildren } from "preact";
import { useLocation } from "preact-iso";

import { componentCatalog } from "@/lib/component-catalog";

import { SiteLayout } from "./site-layout";

const gettingStarted = [
  { title: "Introduction", href: "/docs" },
  { title: "Installation", href: "/docs/installation" },
  { title: "Components", href: "/docs/components" },
];

type DocsLayoutProps = {
  children: ComponentChildren;
  toc?: readonly { id: string; title: string; nested?: boolean }[];
};

export function DocsLayout({ children, toc }: DocsLayoutProps) {
  return (
    <SiteLayout>
      <div className="grid gap-8 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-10">
        <aside>
          <div className="hidden lg:block lg:sticky lg:top-20">
            <DocsNavigation />
          </div>
          <details className="rounded-lg border p-3 lg:hidden">
            <summary className="cursor-pointer text-sm font-medium">Documentation menu</summary>
            <div className="mt-4">
              <DocsNavigation />
            </div>
          </details>
        </aside>
        <div className={toc ? "grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_11rem]" : "min-w-0"}>
          <div className="min-w-0 max-w-4xl">{children}</div>
          {toc && (
            <nav aria-label="On this page" className="hidden xl:block">
              <div className="sticky top-20 max-h-[calc(100dvh-6rem)] space-y-3 overflow-y-auto pr-2">
                <p className="text-sm font-medium">On this page</p>
                <ul className="space-y-2 text-sm">
                  {toc.map(({ id, title, nested }) => (
                    <li key={id} className={nested ? "pl-3 text-xs" : undefined}>
                      <a
                        href={`#${id}`}
                        className="text-muted-foreground hover:text-foreground hover:underline underline-offset-4"
                      >
                        {title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function DocsNavigation() {
  const { path } = useLocation();
  const currentPath = path === "/components" ? "/docs/components" : path;

  return (
    <nav
      aria-label="Documentation"
      className="max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2 text-sm"
    >
      <p className="mb-2 px-2 font-medium">Getting started</p>
      <ul className="space-y-0.5">
        {gettingStarted.map(({ href, title }) => (
          <li key={href}>
            <a
              href={href}
              aria-current={currentPath === href ? "page" : undefined}
              className="block rounded-md px-2 py-1.5 text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-6 mb-2 px-2 font-medium">Components</p>
      <ul className="space-y-0.5">
        {componentCatalog.map(({ slug, name }) => (
          <li key={slug}>
            <a
              href={`/docs/components/${slug}`}
              aria-current={currentPath === `/docs/components/${slug}` ? "page" : undefined}
              className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:font-medium aria-[current=page]:text-foreground"
            >
              {name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
