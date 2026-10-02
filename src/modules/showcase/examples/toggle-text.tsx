import { Toggle } from "@registry/ui/toggle";
import { ItalicIcon } from "lucide-preact";

export function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <ItalicIcon />
      Italic
    </Toggle>
  );
}