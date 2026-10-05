import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerInfo() {
  return (
    <Button variant="outline" onClick={() => toast.info("A new update is available")}>
      Show information
    </Button>
  );
}
