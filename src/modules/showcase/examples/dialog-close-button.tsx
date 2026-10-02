import { Button } from "@registry/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/ui/dialog";
import { Input } from "@registry/ui/input";
import { Label } from "@registry/ui/label";

export function DialogCloseButton() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Share</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="dialog-close-button-link" className="sr-only">
              Link
            </Label>
            <Input id="dialog-close-button-link" defaultValue="https://ui.shadcn.com/docs/installation" readOnly />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose render={<Button type="button" />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}