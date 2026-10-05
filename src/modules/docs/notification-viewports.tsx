import { Toaster } from "@registry/ui/sonner";
import { Toaster as BaseToaster } from "@registry/ui/toast";

export function NotificationViewports() {
  return (
    <>
      <Toaster />
      <BaseToaster />
    </>
  );
}
