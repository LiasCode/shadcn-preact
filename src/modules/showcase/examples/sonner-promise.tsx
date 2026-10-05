import { Button } from "@registry/ui/button";
import { toast } from "sonner";

export default function SonnerPromise() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.promise(
          new Promise<string>((resolve) => {
            window.setTimeout(() => resolve("Changes saved"), 1500);
          }),
          {
            loading: "Saving changes…",
            success: (message) => message,
            error: "Could not save changes",
          },
        )
      }
    >
      Save changes
    </Button>
  );
}
