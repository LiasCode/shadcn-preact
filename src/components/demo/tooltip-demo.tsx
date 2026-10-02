import { Button } from "@registry/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@registry/ui/tooltip";

export function TooltipDemo() {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover or focus</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}