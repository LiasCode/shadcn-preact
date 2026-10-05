import { Toaster } from "@registry/ui/sonner";
import { Toaster as BaseToaster } from "@registry/ui/toast";

import { SiteLayout } from "@/layouts/site-layout";

import { showcase } from "../demos";
import { useShowcaseContainment } from "../hooks/use-showcase-containment";

export function ShowcaseView() {
  const sectionsRef = useShowcaseContainment();
  return (
    <SiteLayout>
      <Toaster />
      <BaseToaster />
      <div className="grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <nav aria-label="Components" className="hidden lg:block">
          <ul className="sticky top-20 grid max-h-[calc(100vh-6rem)] gap-0.5 overflow-y-auto text-sm">
            {showcase.map(({ slug, name }) => (
              <li>
                <a
                  href={`#${slug}`}
                  className="block rounded-md px-2 py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div ref={sectionsRef} className="flex min-w-0 flex-col gap-12">
          <h1 className="font-bold text-3xl tracking-tight">Components</h1>
          {showcase.map(({ slug, name, Demo }) => (
            <section
              id={slug}
              aria-labelledby={`${slug}-title`}
              className="scroll-mt-20 space-y-3 in-data-[containment-ready]:[content-visibility:auto] [contain-intrinsic-size:auto_var(--showcase-height)]"
            >
              <h2 id={`${slug}-title`} className="font-semibold text-xl tracking-tight">
                <a href={`#${slug}`} className="hover:underline">
                  {name}
                </a>
              </h2>
              <div className="flex min-h-44 items-center justify-center rounded-lg border p-6">
                <Demo />
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
