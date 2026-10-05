import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerSuccess() {
  return (
    <Button variant="outline" onClick={() => toast.success("Saved successfully")}>
      Show success
    </Button>
  );
}
