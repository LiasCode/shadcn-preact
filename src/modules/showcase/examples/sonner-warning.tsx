import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerWarning() {
  return (
    <Button variant="outline" onClick={() => toast.warning("Your session will expire soon")}>
      Show warning
    </Button>
  );
}
