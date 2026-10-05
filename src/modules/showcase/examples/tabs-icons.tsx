import { Tabs, TabsList, TabsTrigger } from "@registry/ui/tabs";
import { AppWindowIcon, CodeIcon } from "lucide-preact";

export function TabsIcons() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">
          <AppWindowIcon />
          Preview
        </TabsTrigger>
        <TabsTrigger value="code">
          <CodeIcon />
          Code
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
