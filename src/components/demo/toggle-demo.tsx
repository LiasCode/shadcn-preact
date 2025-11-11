import { Toggle } from "@/components/ui/toggle";
import { BookmarkIcon, Italic, Underline } from "lucide-preact";

export function ToggleDemo() {
  return (
    <div className={"flex flex-row flex-wrap gap-8 *:max-w-sm"}>
      <Toggle
        aria-label="Toggle bookmark"
        size="sm"
        variant="outline"
        className="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
      >
        <BookmarkIcon />
        Bookmark
      </Toggle>

      <Toggle
        variant="outline"
        aria-label="Toggle italic"
      >
        <Italic />
      </Toggle>

      <Toggle aria-label="Toggle italic">
        <Italic />
        Italic
      </Toggle>

      <Toggle
        size="sm"
        aria-label="Toggle italic"
      >
        <Italic />
      </Toggle>

      <Toggle
        size="lg"
        aria-label="Toggle italic"
      >
        <Italic />
      </Toggle>

      <Toggle
        aria-label="Toggle italic"
        disabled
      >
        <Underline className="h-4 w-4" />
      </Toggle>
    </div>
  );
}
