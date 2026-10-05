import { Badge } from "@registry/ui/badge";
import { Button, buttonVariants } from "@registry/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@registry/ui/card";
import { ArrowRightIcon } from "lucide-preact";

import { SiteLayout } from "@/layouts/site-layout";
import { repositoryUrl } from "@/lib/site";

export function HomeView() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl space-y-16 py-8 sm:py-16">
        <section className="max-w-3xl space-y-6">
          <Badge variant="outline">Preact 11 · Tailwind CSS v4 · Base UI</Badge>
          <h1 className="font-bold text-4xl tracking-tight sm:text-6xl">
            Build your component library with Preact.
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            An unofficial shadcn/ui port with components you can copy, compose, and customize. Your
            design system starts with code you own.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/docs/installation" className={buttonVariants()}>
              Get started <ArrowRightIcon aria-hidden="true" />
            </a>
            <a href="/docs/components" className={buttonVariants({ variant: "outline" })}>
              View components
            </a>
          </div>
        </section>
        <section aria-labelledby="preview-title" className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-2">
              <h2 id="preview-title" className="font-semibold text-2xl tracking-tight">
                Small parts. Your interface.
              </h2>
              <p className="text-sm text-muted-foreground">
                Explore the nova defaults, then make them your own.
              </p>
            </div>
            <a href="/docs/components" className="text-sm underline underline-offset-4">
              Explore all components
            </a>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Consistent actions in several variants.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Compact labels for status and categories.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Compose a header, content, and actions.</CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="/docs/components/card"
                  className={buttonVariants({ variant: "outline", size: "sm" })}
                >
                  View examples <ArrowRightIcon aria-hidden="true" />
                </a>
              </CardContent>
            </Card>
          </div>
        </section>
        <section className="grid gap-8 border-t pt-8 md:grid-cols-3" aria-label="Start building">
          <a href="/docs" className="group space-y-2 rounded-lg p-3 hover:bg-muted">
            <h2 className="font-semibold group-hover:underline">Introduction</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Understand the port, source ownership, and Preact compatibility.
            </p>
          </a>
          <a href="/docs/installation" className="group space-y-2 rounded-lg p-3 hover:bg-muted">
            <h2 className="font-semibold group-hover:underline">Installation</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Configure your project, copy the components, and add the styles.
            </p>
          </a>
          <a href="/docs/components" className="group space-y-2 rounded-lg p-3 hover:bg-muted">
            <h2 className="font-semibold group-hover:underline">Components</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Browse the catalog and try the component examples.
            </p>
          </a>
        </section>
        <footer className="border-t pt-6 text-sm text-muted-foreground">
          An unofficial port of{" "}
          <a href="https://ui.shadcn.com" className="underline underline-offset-4">
            shadcn/ui
          </a>
          . Source available on{" "}
          <a href={repositoryUrl} className="underline underline-offset-4">
            GitHub
          </a>
          .
        </footer>
      </div>
    </SiteLayout>
  );
}
