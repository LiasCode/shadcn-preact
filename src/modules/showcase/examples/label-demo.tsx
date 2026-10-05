import { Checkbox } from "@registry/ui/checkbox";
import { Label } from "@registry/ui/label";

export default function LabelDemo() {
  return (
    <div className="flex gap-2">
      <Checkbox id="label-demo-terms" />
      <Label htmlFor="label-demo-terms">Accept terms and conditions</Label>
    </div>
  );
}
