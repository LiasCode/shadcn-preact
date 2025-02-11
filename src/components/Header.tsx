import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useTheme } from "@ui/theme";
import { Moon, Sun } from "lucide-preact";

export function Header() {
  return (
    <header className="w-full border-b border-dashed border-accent items-center header-height flex flex-row justify-center border-grid sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full h-full flex flex-row flex-1 max-w-screen-2xl border-x px-2 border-dashed border-accent py-2">
        <HeaderLeftSide />
        <HeaderRightSide />
      </div>
    </header>
  );
}

function HeaderLeftSide() {
  return (
    <div className="flex h-full flex-1 flex-row items-center max-md:border-none justify-start">
      <div className="flex max-w-fit flex-1 flex-row items-center justify-start gap-2 py-1 relative">
        <a
          className="mr-4 flex items-center gap-2 lg:mr-6"
          href="/"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 256 256"
            className="h-6 w-6 text-primary"
          >
            <rect
              width="256"
              height="256"
              fill="none"
            ></rect>
            <line
              x1="208"
              y1="128"
              x2="128"
              y2="208"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            ></line>
            <line
              x1="192"
              y1="40"
              x2="40"
              y2="192"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            ></line>
          </svg>
          <span className="text-primary font-bold inline-block">preact-shadcn/ui</span>
        </a>

        <Badge
          variant="outline"
          className="absolute top-0 left-[98%]"
        >
          0.0.17
        </Badge>
      </div>
    </div>
  );
}

function HeaderRightSide() {
  const { setTheme, theme } = useTheme();
  return (
    <div className="flex h-full flex-row items-center justify-center flex-1">
      <div className="flex px-2 flex-1 flex-row justify-end items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" && <Sun className="w-4 h-4 text-primary" />}
          {theme === "light" && <Moon className="w-4 h-4 text-primary" />}
        </Button>
      </div>
    </div>
  );
}
