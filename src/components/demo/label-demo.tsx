import { Label } from "@/components/ui/label";
import { Input } from "@ui/input";

export function LabelDemo() {
  return (
    <div className={"flex flex-row flex-wrap gap-8"}>
      <div className="flex flex-col gap-2">
        <Label htmlFor="terms">Introduce your name</Label>
        <Input id={"terms"} />
      </div>
    </div>
  );
}
