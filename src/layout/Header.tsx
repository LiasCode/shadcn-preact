import { Badge } from "@ui/badge";
import { Button } from "@ui/button";

export const Header = () => {
  return (
    <header className="fixed top-0 z-10 flex h-12 w-full max-w-[63rem] items-center justify-between rounded-b-md border p-2 [backdrop-filter:blur(5px)_saturate(90%)]">
      <div className={"flex flex-row items-center gap-2"}>
        <span>
          shadcn-<span className={"text-[#b57beb]"}>preact</span>
        </span>
        <Badge variant={"outline"}>{"v4"}</Badge>
      </div>
      <Button
        variant="ghost"
        onClick={() => {
          document.body.classList.toggle("dark");
        }}
      >
        Toggle theme
      </Button>
    </header>
  );
};
