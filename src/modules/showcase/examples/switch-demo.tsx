import { Label } from "@registry/ui/label";
import { Switch } from "@registry/ui/switch";

export function SwitchDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="switch-demo-airplane-mode" />
      <Label htmlFor="switch-demo-airplane-mode">Airplane Mode</Label>
    </div>
  );
}