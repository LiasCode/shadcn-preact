import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Copy } from "lucide-preact";

export function DialogSection() {
  return (
    <div className="w-full flex flex-col gap-10 items-center">
      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="name"
                className="text-right"
              >
                Name
              </Label>
              <Input
                id="name"
                value="Pedro Duarte"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="username"
                className="text-right"
              >
                Username
              </Label>
              <Input
                id="username"
                value="@peduarte"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger>
          <Button variant="outline">Share</Button>
        </DialogTrigger>

        <DialogContent
          className="sm:max-w-md"
          autoSelect
        >
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
            <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
          </DialogHeader>

          <div className="flex items-end space-x-2 flex-row">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                defaultValue="https://ui.shadcn.com/docs/installation"
                readOnly
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="px-3"
            >
              <span>Copy</span>
              <Copy />
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose>
              <Button
                type="button"
                variant="secondary"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
