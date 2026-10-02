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
import { Field, FieldGroup } from "@registry/ui/field";
import { Input } from "@registry/ui/input";
import { Label } from "@registry/ui/label";

export function DialogDemo() {
  return (
    <Dialog>
      <form>
        <DialogTrigger render={<Button variant="outline" />}>Open Dialog</DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="dialog-demo-name-1">Name</Label>
              <Input id="dialog-demo-name-1" name="name" defaultValue="Pedro Duarte" />
            </Field>
            <Field>
              <Label htmlFor="dialog-demo-username-1">Username</Label>
              <Input id="dialog-demo-username-1" name="username" defaultValue="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}