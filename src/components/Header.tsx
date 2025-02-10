import { Badge } from "@ui/badge";
import { Button } from "@ui/button";
import { useTheme } from "@ui/theme";
import { Moon, Sun } from "lucide-preact";

export function Header() {
  return (
    <header className="w-full max-w-[720px] self-center sticky p-2 px-1 top-0 header-height flex bg-background z-10 flex-row rounded border border-primary shadow-md items-center justify-between">
      <HeaderLeftSide />
      <HeaderRightSide />
    </header>
  );
}

function HeaderLeftSide() {
  return (
    <div className="flex h-full flex-1 flex-row items-center max-md:border-none justify-start w-[15%]">
      <div className="flex max-w-fit flex-1 flex-row items-center justify-start gap-2 py-1 relative">
        <Button
          variant="link"
          className="px-2"
        >
          <img
            src={"/favicon.svg"}
            width={18}
            loading="eager"
          />
          <a href="/">
            <h1 className="text-lg text-nowrap text-ellipsis overflow-hidden font-bold">Preact - shadcn/ui</h1>
          </a>
        </Button>
        <Badge
          variant="default"
          className="absolute top-0 -right-12"
        >
          0.0.1
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
          variant="outline"
          className="px-3"
          onClick={() => {
            setTheme(theme === "light" ? "dark" : "light");
          }}
        >
          {theme === "light" && <Sun className="w-4 h-4 text-primary" />}
          {theme === "dark" && <Moon className="w-4 h-4 text-primary" />}
        </Button>
      </div>
    </div>
  );
}
