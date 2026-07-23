import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SelectDemo() {
  return (
    <Select defaultValue="system">
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent align="start">
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="system">System</SelectItem>
      </SelectContent>
    </Select>
  );
}