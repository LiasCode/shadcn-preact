import { Button } from "@registry/ui/button";
import { Card, CardContent } from "@registry/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@registry/ui/collapsible";
import { ChevronDownIcon } from "lucide-preact";

export function CollapsibleBasic() {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible className="rounded-md data-open:bg-muted">
          <CollapsibleTrigger render={<Button variant="ghost" className="w-full" />}>
            Product details
            <ChevronDownIcon className="ml-auto group-data-panel-open/button:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>This panel can be expanded or collapsed to reveal additional content.</div>
            <Button size="xs">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
