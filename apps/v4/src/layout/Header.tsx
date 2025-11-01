import { Button } from "@ui/button";

export const Header = () => {
  return (
    <header className="fixed top-1 z-10 flex h-12 w-full max-w-[63rem] items-center justify-between rounded-lg border bg-background p-2">
      <h1 class="font-bold text-[#b57beb] text-lg">shadcn-preact v4</h1>
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
