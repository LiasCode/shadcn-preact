import { Label } from "@registry/ui/label";
import { RadioGroup, RadioGroupItem } from "@registry/ui/radio-group";

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="comfortable" className="w-fit">
      <div className="flex items-center gap-3">
        <RadioGroupItem value="default" id="radio-group-demo-r1" />
        <Label htmlFor="radio-group-demo-r1">Default</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="comfortable" id="radio-group-demo-r2" />
        <Label htmlFor="radio-group-demo-r2">Comfortable</Label>
      </div>
      <div className="flex items-center gap-3">
        <RadioGroupItem value="compact" id="radio-group-demo-r3" />
        <Label htmlFor="radio-group-demo-r3">Compact</Label>
      </div>
    </RadioGroup>
  );
}
