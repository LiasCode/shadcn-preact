import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem value="components">
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid w-[420px] gap-2 md:grid-cols-2">
              <NavigationMenuLink href="#button">
                <div className="font-medium text-sm">Button</div>
                <p className="text-muted-foreground text-sm leading-snug">Interactive actions and icon buttons.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#popover">
                <div className="font-medium text-sm">Popover</div>
                <p className="text-muted-foreground text-sm leading-snug">Floating panels anchored to a trigger.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#calendar">
                <div className="font-medium text-sm">Calendar</div>
                <p className="text-muted-foreground text-sm leading-snug">Date selection powered by DayPicker.</p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#tabs">
                <div className="font-medium text-sm">Tabs</div>
                <p className="text-muted-foreground text-sm leading-snug">Layered content with compact controls.</p>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem value="docs">
          <NavigationMenuLink
            href="https://ui.shadcn.com/docs"
            className="px-4 py-2"
          >
            Docs
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
