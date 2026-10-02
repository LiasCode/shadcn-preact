import { Button } from "@registry/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@registry/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@registry/ui/drawer";
import { Input } from "@registry/ui/input";
import { Label } from "@registry/ui/label";
import type { ComponentProps } from "@registry/ui/primitives/internals/types";
import { cn } from "cn";
import * as React from "preact/compat";

import { useMediaQuery } from "@/lib/use-media-query";

export function DrawerDialogDemo() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" />}>Edit Profile</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <ProfileForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={<Button variant="outline" />}>Edit Profile</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>Make changes to your profile here. Click save when you&apos;re done.</DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="p-4" />
      </DrawerContent>
    </Drawer>
  );
}

function ProfileForm({ className }: ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-6", className)}>
      <div className="grid gap-3">
        <Label htmlFor="drawer-dialog-email">Email</Label>
        <Input type="email" id="drawer-dialog-email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="drawer-dialog-username">Username</Label>
        <Input id="drawer-dialog-username" defaultValue="@shadcn" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}