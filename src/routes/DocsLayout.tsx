import { GitBranchIcon } from "@/components/GitBranchIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/share/cn";
import { MenuIcon, MoonIcon, SunIcon } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/compat";
import { componentCategories, componentDocs } from "./docs-data";

type DocsLayoutProps = {
  children: ComponentChildren;
  activeSlug?: string;
};

const docsNav = [
  { title: "Introduction", href: "/docs" },
  { title: "Installation", href: "/docs/installation/vite" },
  { title: "Components", href: "/docs/components" },
];

export function DocsLayout({ children, activeSlug }: DocsLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [activeSlug]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader
        mobileNavOpen={mobileNavOpen}
        onMobileNavOpenChange={setMobileNavOpen}
      />
      <div className="mx-auto flex w-full max-w-screen-2xl">
        <aside
          className={cn(
            "fixed inset-x-0 top-14 z-40 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b bg-background p-4 lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)] lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0 lg:pl-6",
            mobileNavOpen ? "block" : "hidden"
          )}
        >
          <DocsSidebar activeSlug={activeSlug} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 md:px-8 lg:px-10">{children}</main>
      </div>
    </div>
  );
}

function SiteHeader({
  mobileNavOpen,
  onMobileNavOpenChange,
}: {
  mobileNavOpen: boolean;
  onMobileNavOpenChange: (open: boolean) => void;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="mr-2 lg:hidden"
          aria-label="Toggle navigation"
          onClick={() => onMobileNavOpenChange(!mobileNavOpen)}
        >
          <MenuIcon />
        </Button>
        <a
          href="/docs"
          className="mr-6 flex items-center gap-2 font-semibold"
        >
          <span>
            shadcn-<span className="text-[#b57beb]">preact</span>
          </span>
          <Badge variant="outline">v4</Badge>
        </a>
        <nav className="hidden items-center gap-5 text-muted-foreground text-sm md:flex">
          <a
            href="/docs"
            className="transition-colors hover:text-foreground"
          >
            Docs
          </a>
          <a
            href="/docs/components"
            className="transition-colors hover:text-foreground"
          >
            Components
          </a>
          <a
            href="https://github.com/LiasCode/shadcn-preact"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
          >
            <a
              href="https://github.com/LiasCode/shadcn-preact"
              aria-label="Open GitHub repository"
            >
              <GitBranchIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      onClick={() => {
        const nextDark = !document.documentElement.classList.contains("dark");
        document.documentElement.classList.toggle("dark", nextDark);
        setDark(nextDark);
      }}
    >
      {dark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

function DocsSidebar({ activeSlug }: { activeSlug?: string }) {
  return (
    <div className="flex flex-col gap-6 text-sm">
      <div className="grid gap-1">
        <div className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">Getting Started</div>
        {docsNav.map((item) => (
          <a
            href={item.href}
            className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {item.title}
          </a>
        ))}
      </div>
      {componentCategories.map((category) => {
        const docs = componentDocs.filter((doc) => doc.category === category);
        return (
          <div className="grid gap-1">
            <div className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">{category}</div>
            {docs.map((doc) => (
              <a
                href={`/docs/components/${doc.slug}`}
                data-active={activeSlug === doc.slug ? "" : undefined}
                className="rounded-md px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active]:bg-muted data-[active]:font-medium data-[active]:text-foreground"
              >
                {doc.name}
              </a>
            ))}
          </div>
        );
      })}
    </div>
  );
}
