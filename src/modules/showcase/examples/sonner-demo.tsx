import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerExample() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast("Event has been created", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: { label: "Undo", onClick: () => toast.info("Event undone") },
        })
      }
    >
      Show notification
    </Button>
  );
}
