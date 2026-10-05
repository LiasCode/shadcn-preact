import { Button } from "@registry/ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "@registry/ui/button-group";
import { PlusIcon } from "lucide-preact";

export default function ButtonGroupSplit() {
  return (
    <ButtonGroup>
      <Button variant="secondary">Button</Button>
      <ButtonGroupSeparator />
      <Button size="icon" variant="secondary">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
