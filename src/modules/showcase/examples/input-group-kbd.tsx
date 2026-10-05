import { InputGroup, InputGroupAddon, InputGroupInput } from "@registry/ui/input-group";
import { Kbd } from "@registry/ui/kbd";
import { SearchIcon } from "lucide-preact";

export function InputGroupKbd() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon className="text-muted-foreground" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <Kbd>⌘K</Kbd>
      </InputGroupAddon>
    </InputGroup>
  );
}
