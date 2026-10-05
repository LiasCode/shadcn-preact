import { Button } from "@registry/ui/button";
import { ButtonGroup } from "@registry/ui/button-group";
import { Input } from "@registry/ui/input";
import { SearchIcon } from "lucide-preact";

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  );
}
