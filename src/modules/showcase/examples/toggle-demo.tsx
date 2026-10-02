import { Toggle } from "@registry/ui/toggle";
import { BookmarkIcon } from "lucide-preact";

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark" size="sm" variant="outline">
      <BookmarkIcon className="group-aria-pressed/toggle:fill-foreground" />
      Bookmark
    </Toggle>
  );
}