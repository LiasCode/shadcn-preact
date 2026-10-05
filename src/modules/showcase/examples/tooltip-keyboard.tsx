import { Button } from "@registry/ui/button";
import { Kbd } from "@registry/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@registry/ui/tooltip";
import { SaveIcon } from "lucide-preact";

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline" size="icon-sm" />}>
        <SaveIcon />
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
