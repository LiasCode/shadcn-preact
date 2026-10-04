import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export function SonnerDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: { label: "Undo", onClick: () => toast.info("Event undone") },
          })
        }
      >
        Show Toast
      </Button>
      <Button variant="outline" onClick={() => toast.success("Saved successfully")}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.error("Something went wrong")}>
        Error
      </Button>
    </div>
  );
}