import { Button } from "@registry/ui/button";
import { toast } from "@registry/ui/toast";

export function ToastPromise() {
  function showToast() {
    toast.promise(
      new Promise<{ name: string }>((resolve) => {
        setTimeout(() => resolve({ name: "Event" }), 2000);
      }),
      {
        loading: "Creating event…",
        success: (data) => `${data.name} created.`,
        error: "Could not create event.",
      },
    );
  }

  return (
    <Button variant="outline" onClick={showToast}>
      Create Event
    </Button>
  );
}
