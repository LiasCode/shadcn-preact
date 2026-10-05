import { TooltipProvider } from "@registry/ui/tooltip";

import { TooltipDemo as Example1 } from "../examples/tooltip-demo";
import { TooltipDisabled as Example2 } from "../examples/tooltip-disabled";
import { TooltipKeyboard as Example3 } from "../examples/tooltip-keyboard";
import { TooltipSides as Example4 } from "../examples/tooltip-sides";

export function TooltipDemo() {
  return (
    <TooltipProvider>
      <div className="relative flex w-full min-w-0 flex-wrap items-start gap-8">
        <Example1 />
        <Example2 />
        <Example3 />
        <Example4 />
      </div>
    </TooltipProvider>
  );
}
