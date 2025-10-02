import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { useTheme } from "@ui/theme";
import { Moon, Sun } from "lucide-preact";
import { useLocation } from "preact-iso";
import { lazy, Suspense } from "preact/compat";
import CommandSearchDialog from "./CommandSearchDialog";
import { ShadcnIcon } from "./ShadcnIcon";

const MobileSidebarMenu = lazy(() => import("@/components/MobileSidebarMenu"));

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full flex-row items-center justify-center border-accent border-grid border-b border-dashed bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full w-full max-w-screen-2xl flex-1 flex-row border-accent border-dashed px-0 py-1 md:px-2 md:py-2 2xl:border-x">
        <HeaderLeftSide />
        <HeaderRightSide />
      </div>
    </header>
  );
}

function HeaderLeftSide() {
  const { path } = useLocation();

  const firstAlphaComponentKey = Object.keys(AppRoutes.COMPONENTS).sort()[0] as keyof typeof AppRoutes.COMPONENTS;

  const isActive = (route: string) => path === route;

  return (
    <div className="flex h-full flex-2 flex-row items-center justify-start max-md:border-none md:flex-1">
      <div className="relative flex max-w-fit flex-1 flex-row items-center justify-start gap-2 px-2 py-1">
        <div className="flex h-fit w-fit pl-1 md:hidden">
          <Suspense
            fallback={
              <Button
                size="icon"
                variant="outline"
              >
                <LoadingSpinner />
              </Button>
            }
          >
            <MobileSidebarMenu />
          </Suspense>
        </div>

        <ShadcnIcon />

        <a
          className="flex items-center gap-2"
          href={AppRoutes.HOME}
        >
          <span className="inline-block text-nowrap font-bold text-primary text-sm md:text-base">
            shadcn-<span className="text-purple-500">preact</span>
          </span>
        </a>
      </div>

      <div className="ml-4 hidden h-full flex-1 flex-row items-center justify-start gap-6 text-muted-foreground text-sm md:flex">
        <a
          className="flex items-center data-[route-active=true]:text-primary"
          href={AppRoutes.DOCS.INTRO}
          data-route-active={isActive(AppRoutes.DOCS.INTRO)}
        >
          Docs
        </a>

        <a
          className="flex items-center data-[route-active=true]:text-primary"
          href={AppRoutes.COMPONENTS[firstAlphaComponentKey]}
          data-route-active={isActive(AppRoutes.COMPONENTS[firstAlphaComponentKey])}
        >
          Components
        </a>

        <a
          className="flex items-center data-[route-active=true]:text-primary"
          href={AppRoutes.EXAMPLES}
          data-route-active={isActive(AppRoutes.EXAMPLES)}
        >
          Examples
        </a>
      </div>
    </div>
  );
}

function HeaderRightSide() {
  const { setTheme } = useTheme();

  return (
    <div className="flex h-full flex-1 flex-row items-center justify-center">
      <div className="flex flex-1 flex-row items-center justify-end gap-2 px-2">
        <CommandSearchDialog />

        <a
          href="https://github.com/LiasCode/shadcn-preact"
          target="_blank"
          rel="noreferrer"
        >
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground"
          >
            <svg
              role="img"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>GitHub</title>
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </Button>
        </a>

        <Button
          variant="ghost"
          size="icon"
          className="flex dark:hidden"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4 text-primary" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="hidden dark:flex"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4 text-primary" />
        </Button>
      </div>
    </div>
  );
}
