import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerError() {
  return (
    <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
      Show error
    </Button>
  );
}
