import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export function HoverCardDemo() {
  return (
    <HoverCard openDelay={150}>
      <HoverCardTrigger asChild>
        <Button variant="link">@shadcn-preact</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/LiasCode.png" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">@shadcn-preact</h4>
            <p className="text-sm">An unofficial shadcn/ui port built for Preact projects.</p>
            <p className="text-muted-foreground text-xs">Minimal dependencies, copy-paste components.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}