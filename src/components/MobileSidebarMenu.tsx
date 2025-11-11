import { Button } from "@ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@ui/drawer";
import { Menu } from "lucide-preact";
import NavRoutesLinks from "./NavRoutesLinks";

export default function MobileSidebarMenu() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <Menu />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Navigation</DrawerTitle>
        </DrawerHeader>

        <div className="flex h-full w-full flex-col gap-2 overflow-auto px-4">
          <NavRoutesLinks />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
