import { Button } from "@registry/ui/button";
import { CircleFadingArrowUpIcon } from "lucide-preact";

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <CircleFadingArrowUpIcon />
    </Button>
  );
}
