import { AppRoutes } from "@/routes/AppRoutes";
import { Button } from "@ui/button";
import { useLocation } from "preact-iso";

export default function NavRoutesLinks() {
  const { path } = useLocation();

  const isActive = (route: string) => path === route;

  return (
    <>
      <div className="flex w-full flex-col gap-[2px]">
        <span className="flex h-9 w-full flex-row items-center justify-start p-1 font-semibold text-sm">
          Getting Started
        </span>
        <a
          href={AppRoutes.DOCS.INTRO}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.INTRO)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Introduction
          </Button>
        </a>

        <a
          href={AppRoutes.DOCS.INSTALLATION}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.INSTALLATION)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Installation
          </Button>
        </a>

        <a
          href={AppRoutes.DOCS.THEMING}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.THEMING)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Theming
          </Button>
        </a>

        <a
          href={AppRoutes.DOCS.DARK_MODE}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.DARK_MODE)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Dark Mode
          </Button>
        </a>

        <a
          href={AppRoutes.EXAMPLES}
          className="group w-full"
          data-route-active={isActive(AppRoutes.EXAMPLES)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Examples
          </Button>
        </a>

        <a
          rel="noreferrer"
          target="_blank"
          href="https://v4-shadcn-preact.onrender.com/"
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground group-data-[route-active=true]:text-foreground"
          >
            Tailwind v4
          </Button>
        </a>
      </div>

      <div className="flex w-full flex-col gap-[2px]">
        <span className="flex h-9 w-full flex-row items-center justify-start p-1 font-semibold text-sm">
          Installation
        </span>

        <a
          href={AppRoutes.DOCS.INSTALLATION_VITE}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.INSTALLATION_VITE)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Vite
          </Button>
        </a>

        <a
          href={AppRoutes.DOCS.INSTALLATION_ASTRO}
          className="group w-full"
          data-route-active={isActive(AppRoutes.DOCS.INSTALLATION_ASTRO)}
        >
          <Button
            variant="link"
            size="default"
            className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
          >
            Astro
          </Button>
        </a>
      </div>

      <div className="flex w-full flex-col gap-[2px] pb-4">
        <span className="flex h-9 w-full flex-row items-center justify-start p-1 font-semibold text-sm">
          Components
        </span>

        {Object.entries(AppRoutes.COMPONENTS)
          .sort()
          .map(([name, route]) => {
            return (
              <a
                href={route}
                className="group w-full"
                key={name}
                data-route-active={isActive(route)}
              >
                <Button
                  variant="link"
                  size="default"
                  className="w-full justify-start px-2 py-1 font-normal text-muted-foreground capitalize group-data-[route-active=true]:text-foreground"
                >
                  {name.split("_").join(" ").toLocaleLowerCase()}
                </Button>
              </a>
            );
          })}
      </div>
    </>
  );
}
