import { Badge } from "@registry/ui/badge";
import { Button } from "@registry/ui/button";
import { useTheme } from "@registry/ui/theme";
import { GitBranchIcon, MoonIcon, SunIcon } from "lucide-preact";
import type { ComponentChildren } from "preact";
import { useLocation } from "preact-iso";

import { repositoryUrl } from "@/lib/site";

const siteNav = [
  { title: "Introduction", href: "/" },
  { title: "Components", href: "/components" },
];

export function SiteLayout({ children }: { children: ComponentChildren }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-screen-2xl px-4 py-8 md:px-8 lg:px-10">{children}</main>
    </div>
  );
}

function SiteHeader() {
  const { path } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-1 px-3 sm:gap-6 sm:px-4 lg:px-6">
        <a href="/" className="flex shrink-0 items-center gap-2 whitespace-nowrap font-semibold">
          <span>
            shadcn-<span className="text-[#b57beb]">preact</span>
          </span>
          <Badge variant="outline" className="hidden sm:inline-flex">
            v4
          </Badge>
        </a>
        <nav className="flex items-center gap-3 text-xs text-muted-foreground sm:gap-5 sm:text-sm">
          {siteNav.map((item) => (
            <a
              href={item.href}
              aria-current={path === item.href ? "page" : undefined}
              className="transition-colors hover:text-foreground aria-[current=page]:text-foreground"
            >
              {item.title}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden sm:inline-flex"
            nativeButton={false}
            render={<a href={repositoryUrl} aria-label="Open GitHub repository" title="GitHub repository" />}
          >
            <GitBranchIcon />
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Toggle theme"
      title="Toggle theme"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {/* The icon follows the `.dark` class, so the prerendered markup matches after hydration. */}
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  );
}