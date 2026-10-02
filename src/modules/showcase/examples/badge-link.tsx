import { Badge } from "@registry/ui/badge";
import { ArrowUpRightIcon } from "lucide-preact";

export function BadgeAsLink() {
  return (
    <Badge render={<a href="#link" />}>
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </Badge>
  );
}