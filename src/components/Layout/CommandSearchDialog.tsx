import { AppRoutes } from "@/routes/AppRoutes";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@ui/command";
import { CommandSeparator } from "cmdk";
import { Circle, StickyNote } from "lucide-preact";
import { useLocation } from "preact-iso";
import { useEffect, useState } from "preact/compat";

export default function CommandSearchDialog() {
  const [open, setOpen] = useState(false);
  const { route } = useLocation();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <div className="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
        <button
          type="button"
          className="relative inline-flex h-8 w-full items-center justify-start gap-2 whitespace-nowrap rounded-[0.5rem] border border-input bg-muted/50 px-4 py-2 font-normal text-muted-foreground text-sm shadow-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 sm:pr-12 md:w-40 lg:w-56 xl:w-64 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0"
          onClick={() => setOpen(true)}
        >
          <span className="hidden lg:inline-flex">Search documentation...</span>
          <span className="inline-flex lg:hidden">Search...</span>
          <kbd className="pointer-events-none absolute top-[0.3.5rem] right-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Docs">
            {Object.entries(AppRoutes.DOCS).map(([k, v]) => (
              <CommandItem
                key={k}
                onSelect={() => route(v)}
              >
                <StickyNote />
                <span className="capitalize">{k.toLowerCase().split("_").join(" ")}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Components">
            {Object.entries(AppRoutes.COMPONENTS)
              .sort()
              .map(([k, v]) => (
                <CommandItem
                  key={k}
                  onSelect={() => route(v)}
                >
                  <Circle />
                  <span className="capitalize">{k.toLowerCase().split("_").join(" ")}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
