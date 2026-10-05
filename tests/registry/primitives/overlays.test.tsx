import { expect, test } from "bun:test";

import { useRef, useState } from "preact/hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../registry/ui/alert-dialog";
import { Button } from "../../../registry/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../../registry/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "../../../registry/ui/drawer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../../registry/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "../../../registry/ui/popover";
import { Dialog as PrimitiveDialog } from "../../../registry/ui/primitives/dialog";
import { Drawer as PrimitiveDrawer } from "../../../registry/ui/primitives/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../registry/ui/tooltip";
import { act, fire, render, settle } from "../../utils";

function click(selector: string) {
  act(() => document.querySelector<HTMLElement>(selector)!.click());
}

function escape() {
  fire(
    document.body,
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
}

function press(element: Element, type: string, y = 0, x = 0) {
  fire(
    element,
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerId: 1,
      pointerType: "mouse",
      clientX: x,
      clientY: y,
    }),
  );
}

function outside() {
  press(document.body, "pointerdown");

  press(document.body, "pointerup");
}

function BasicDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Title</DialogTitle>
        <DialogDescription>Description</DialogDescription>
        <DialogClose>Dismiss</DialogClose>
      </DialogContent>
    </Dialog>
  );
}

test("dialog render triggers connect ARIA, focus and return focus through an animated close", async () => {
  render(<BasicDialog />);

  click("[data-slot=dialog-trigger]");

  await settle();
  const popup = document.querySelector<HTMLElement>("[data-slot=dialog-content]")!;
  expect(popup.getAttribute("role")).toBe("dialog");

  expect(popup.getAttribute("aria-labelledby")).toBe(
    document.querySelector("[data-slot=dialog-title]")!.id,
  );

  expect(popup.getAttribute("aria-describedby")).toBe(
    document.querySelector("[data-slot=dialog-description]")!.id,
  );

  expect(document.querySelector("[data-slot=dialog-trigger]")!.getAttribute("aria-controls")).toBe(
    popup.id,
  );

  expect(document.activeElement).toBe(popup.querySelector("[data-slot=dialog-close]"));

  expect(document.body.style.overflow).toBe("clip");

  expect(document.documentElement.style.overflow).toBe("hidden");

  click("[data-slot=dialog-content] [data-slot=dialog-close]");

  await settle(70);

  expect(document.querySelector("[data-slot=dialog-content]")).toBeNull();

  expect(document.activeElement).toBe(document.querySelector("[data-slot=dialog-trigger]"));

  expect(document.body.style.overflow).toBe("");
});

test("controlled dialog cancellation and prevented trigger handlers retain state", async () => {
  const reasons: string[] = [];

  function Subject() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog
        open={open}
        onOpenChange={(next, details) => {
          reasons.push(details.reason);

          if (!next) {
            details.cancel();
          } else {
            setOpen(next);
          }
        }}
      >
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent>
          <DialogTitle>Controlled</DialogTitle>
        </DialogContent>
      </Dialog>
    );
  }

  render(<Subject />);

  click("[data-slot=dialog-trigger]");

  await settle();

  escape();

  outside();

  await settle();

  expect(reasons).toEqual(["trigger-press", "escape-key", "outside-press"]);

  expect(document.querySelector("[data-slot=dialog-content]")).not.toBeNull();
});

test("alert dialog ignores outside dismissal and actions do not close automatically", async () => {
  render(
    <AlertDialog>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>Confirm</AlertDialogTitle>
        <AlertDialogAction>Action</AlertDialogAction>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogContent>
    </AlertDialog>,
  );

  click("[data-slot=alert-dialog-trigger]");

  await settle();

  outside();

  click("[data-slot=alert-dialog-action]");

  await settle();

  expect(document.querySelector("[role=alertdialog]")).not.toBeNull();

  click("[data-slot=alert-dialog-cancel]");

  await settle(70);

  expect(document.querySelector("[role=alertdialog]")).toBeNull();
});

test("nested dialogs close only the inner layer and keep the parent active", async () => {
  render(
    <Dialog>
      <DialogTrigger id="outer">Outer</DialogTrigger>
      <DialogContent>
        <DialogTitle>Outer</DialogTitle>
        <Dialog>
          <DialogTrigger id="inner">Inner</DialogTrigger>
          <DialogContent>
            <DialogTitle>Inner</DialogTitle>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>,
  );

  click("#outer");

  await settle();

  click("#inner");

  await settle();

  expect(document.querySelector("[data-nested-dialog-open]")).not.toBeNull();

  escape();

  await settle(70);

  expect(document.querySelectorAll("[data-slot=dialog-content]")).toHaveLength(1);

  expect(document.activeElement?.id).toBe("inner");

  expect(document.body.style.overflow).toBe("clip");

  expect(document.documentElement.style.overflow).toBe("hidden");

  escape();

  await settle(70);

  expect(document.querySelectorAll("[data-slot=dialog-content]")).toHaveLength(0);
});

test("popover defaults to non-modal, preserves focus out, and exposes positioning data", async () => {
  render(
    <>
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Popover</PopoverTitle>
          <input aria-label="value" />
        </PopoverContent>
      </Popover>
      <button id="next">Next</button>
    </>,
  );

  click("[data-slot=popover-trigger]");

  await settle();

  expect(document.body.style.overflow).toBe("");

  expect(document.querySelector("[data-slot=popover-content]")!.hasAttribute("data-side")).toBe(
    true,
  );

  act(() => document.querySelector<HTMLElement>("#next")!.focus());

  await settle(70);

  expect(document.querySelector("[data-slot=popover-content]")).toBeNull();

  expect(document.activeElement?.id).toBe("next");
});

test("tooltip provider delays hover, focus opens immediately, and click closes", async () => {
  render(
    <TooltipProvider delay={25}>
      <Tooltip>
        <TooltipTrigger>Tip</TooltipTrigger>
        <TooltipContent>Text</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  const trigger = document.querySelector("[data-slot=tooltip-trigger]")!;
  fire(trigger, new PointerEvent("pointerenter", { pointerType: "mouse" }));

  expect(document.querySelector("[role=tooltip]")).toBeNull();

  await settle(65);
  const popup = document.querySelector("[role=tooltip]")!;
  expect(popup).not.toBeNull();

  expect(trigger.getAttribute("aria-describedby")).toBe(popup.id);

  click("[data-slot=tooltip-trigger]");

  await settle(70);

  expect(document.querySelector("[role=tooltip]")).toBeNull();

  act(() => (trigger as HTMLElement).focus());

  await settle();

  expect(document.querySelector("[role=tooltip]")).not.toBeNull();

  escape();

  await settle(70);

  expect(document.querySelector("[role=tooltip]")).toBeNull();
});

test("tooltip disabled disables interaction without setting the native disabled attribute", async () => {
  render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger disabled>Tip</TooltipTrigger>
        <TooltipContent>Text</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );
  const trigger = document.querySelector<HTMLElement>("[data-slot=tooltip-trigger]")!;
  expect(trigger.hasAttribute("disabled")).toBe(false);

  act(() => trigger.focus());

  await settle();

  expect(document.querySelector("[role=tooltip]")).toBeNull();
});

test("hover card maintains focus and hover across the portaled popup", async () => {
  render(
    <HoverCard>
      <HoverCardTrigger delay={5} closeDelay={25}>
        Preview
      </HoverCardTrigger>
      <HoverCardContent>
        <a href="#">Details</a>
      </HoverCardContent>
    </HoverCard>,
  );
  const trigger = document.querySelector("[data-slot=hover-card-trigger]")!;
  fire(trigger, new PointerEvent("pointerenter", { pointerType: "mouse" }));

  await settle();
  const popup = document.querySelector("[data-slot=hover-card-content]")!;
  expect(popup).not.toBeNull();

  fire(trigger, new PointerEvent("pointerleave", { pointerType: "mouse" }));

  fire(popup, new PointerEvent("pointerenter", { pointerType: "mouse" }));

  await settle(60);

  expect(document.querySelector("[data-slot=hover-card-content]")).not.toBeNull();

  fire(popup, new PointerEvent("pointerleave", { pointerType: "mouse" }));

  await settle(40);

  await settle(60);

  expect(document.querySelector("[data-slot=hover-card-content]")).toBeNull();
});

test("imperative preventUnmountOnClose retains a closed popup until unmount", async () => {
  let actionsRef: { current: PrimitiveDialog.Root.Actions | null };

  function Subject() {
    const ref = useRef<PrimitiveDialog.Root.Actions | null>(null);
    actionsRef = ref;
    return (
      <PrimitiveDialog.Root
        actionsRef={ref}
        onOpenChange={(_, details) => details.preventUnmountOnClose()}
      >
        <PrimitiveDialog.Trigger>Open</PrimitiveDialog.Trigger>
        <PrimitiveDialog.Portal>
          <PrimitiveDialog.Popup>
            <PrimitiveDialog.Close>Close</PrimitiveDialog.Close>
          </PrimitiveDialog.Popup>
        </PrimitiveDialog.Portal>
      </PrimitiveDialog.Root>
    );
  }

  const host = render(<Subject />);
  click("button");

  await settle();

  click("[role=dialog] button");

  await settle(70);

  expect(document.querySelector("[role=dialog]")!.hasAttribute("data-closed")).toBe(true);

  act(() => actionsRef.current?.unmount());

  await settle();

  expect(document.querySelector("[role=dialog]")).toBeNull();

  expect(host.querySelector("button")).not.toBeNull();
});

test("detached dialog handle passes payload and selects the trigger", async () => {
  const handle = PrimitiveDialog.createHandle<string>();
  render(
    <>
      <PrimitiveDialog.Trigger handle={handle} payload="first" id="detached">
        Open
      </PrimitiveDialog.Trigger>
      <PrimitiveDialog.Root handle={handle}>
        {(payload) => (
          <PrimitiveDialog.Portal>
            <PrimitiveDialog.Popup>
              <PrimitiveDialog.Title>{payload}</PrimitiveDialog.Title>
              <PrimitiveDialog.Close>Close</PrimitiveDialog.Close>
            </PrimitiveDialog.Popup>
          </PrimitiveDialog.Portal>
        )}
      </PrimitiveDialog.Root>
    </>,
  );

  click("#detached");

  await settle();

  expect(document.querySelector("h2")!.textContent).toBe("first");

  expect(document.querySelector("#detached")!.getAttribute("aria-expanded")).toBe("true");
});

test("drawer gesture closes after threshold and cancellation restores its position", async () => {
  const reasons: string[] = [];
  render(
    <Drawer
      onOpenChange={(_, details) => {
        reasons.push(details.reason);

        if (details.reason === "swipe") {
          details.cancel();
        }
      }}
      showSwipeHandle
    >
      <DrawerTrigger>Open</DrawerTrigger>
      <DrawerContent>
        <DrawerTitle>Drawer</DrawerTitle>
        <DrawerClose>Close</DrawerClose>
      </DrawerContent>
    </Drawer>,
  );

  click("[data-slot=drawer-trigger]");

  await settle();
  const popup = document.querySelector<HTMLElement>("[data-slot=drawer-popup]")!;
  press(popup, "pointerdown");

  press(popup, "pointermove", 100);

  expect(popup.hasAttribute("data-swiping")).toBe(true);

  press(popup, "pointerup", 100);

  await settle();

  expect(reasons).toEqual(["trigger-press", "swipe"]);

  expect(popup.hasAttribute("data-open")).toBe(true);

  expect(popup.style.getPropertyValue("--drawer-swipe-movement-y")).toBe("0px");
});

test("drawer snap points update from drag and honor controlled snap cancellation", async () => {
  const points: Array<number | string | null> = [];
  render(
    <PrimitiveDrawer.Root
      snapPoints={[100, 300]}
      defaultSnapPoint={100}
      onSnapPointChange={(point) => points.push(point)}
    >
      <PrimitiveDrawer.Trigger>Open</PrimitiveDrawer.Trigger>
      <PrimitiveDrawer.Portal>
        <PrimitiveDrawer.Viewport>
          <PrimitiveDrawer.Popup>
            <PrimitiveDrawer.Title>Snap</PrimitiveDrawer.Title>
          </PrimitiveDrawer.Popup>
        </PrimitiveDrawer.Viewport>
      </PrimitiveDrawer.Portal>
    </PrimitiveDrawer.Root>,
  );

  click("button");

  await settle();
  const popup = document.querySelector<HTMLElement>("[role=dialog]")!;
  Object.defineProperty(popup, "offsetHeight", { configurable: true, value: 400 });

  window.dispatchEvent(new Event("resize"));

  await settle();

  press(popup, "pointerdown", 250);

  press(popup, "pointermove", 50);

  press(popup, "pointerup", 50);

  await settle();

  expect(points).toEqual([300]);
});

test("preventBaseUIHandler on a trigger prevents opening", () => {
  render(
    <Dialog>
      <DialogTrigger onClick={(event) => event.preventBaseUIHandler()}>Open</DialogTrigger>
      <DialogContent />
    </Dialog>,
  );

  click("[data-slot=dialog-trigger]");

  expect(Boolean(document.querySelector("[data-slot=dialog-content]"))).toBe(false);
});

test("trap-focus keeps pointer interaction and page scroll available while wrapping focus", async () => {
  render(
    <Dialog modal="trap-focus">
      <DialogTrigger>Open</DialogTrigger>
      <DialogContent>
        <DialogTitle>Trap</DialogTitle>
        <button id="first">First</button>
        <button id="last">Last</button>
      </DialogContent>
    </Dialog>,
  );

  click("[data-slot=dialog-trigger]");

  await settle();

  expect(document.body.style.overflow).toBe("");

  expect(document.querySelectorAll("[inert]")).toHaveLength(0);

  expect(document.querySelector("[aria-hidden=true]")).not.toBeNull();
  const close = document.querySelector<HTMLElement>(
    "[data-slot=dialog-content] [data-slot=dialog-close]",
  )!;
  act(() => close.focus());

  fire(close, new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));

  expect(document.activeElement?.id).toBe("first");
});

test("dialog initial and final focus refs and state-dependent rendering are honored", async () => {
  function Subject() {
    const initial = useRef<HTMLInputElement | null>(null);
    const final = useRef<HTMLButtonElement | null>(null);
    return (
      <>
        <button ref={final} id="final">
          Final
        </button>
        <PrimitiveDialog.Root>
          <PrimitiveDialog.Trigger>Open</PrimitiveDialog.Trigger>
          <PrimitiveDialog.Portal>
            <PrimitiveDialog.Popup
              initialFocus={initial}
              finalFocus={final}
              className={(state) => (state.open ? "open-popup" : "closed-popup")}
            >
              <button>First</button>
              <input ref={initial} id="initial" />
              <PrimitiveDialog.Close>Close</PrimitiveDialog.Close>
            </PrimitiveDialog.Popup>
          </PrimitiveDialog.Portal>
        </PrimitiveDialog.Root>
      </>
    );
  }

  render(<Subject />);

  click("button:nth-of-type(2)");

  await settle();

  expect(document.activeElement?.id).toBe("initial");

  expect(document.querySelector("[role=dialog]")!.className).toBe("open-popup");

  click("[role=dialog] button:last-child");

  await settle(70);

  expect(document.activeElement?.id).toBe("final");
});

test("a recently opened tooltip gives its neighbor the provider's instant delay", async () => {
  render(
    <TooltipProvider delay={40} timeout={100}>
      <Tooltip>
        <TooltipTrigger id="one">One</TooltipTrigger>
        <TooltipContent>One</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger id="two">Two</TooltipTrigger>
        <TooltipContent>Two</TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  );

  fire(document.querySelector("#one")!, new PointerEvent("pointerenter", { pointerType: "mouse" }));

  await settle(80);

  fire(document.querySelector("#two")!, new PointerEvent("pointerenter", { pointerType: "mouse" }));

  await settle(10);
  const active = document.querySelector("[role=tooltip][data-open]");
  expect(active?.textContent).toBe("Two");
});

test("controlled drawer snap points restore position after a canceled gesture", async () => {
  let requested: number | string | null = null;
  render(
    <PrimitiveDrawer.Root
      snapPoints={[100, 300]}
      snapPoint={100}
      onSnapPointChange={(point, details) => {
        requested = point;
        details.cancel();
      }}
    >
      <PrimitiveDrawer.Trigger>Open</PrimitiveDrawer.Trigger>
      <PrimitiveDrawer.Portal>
        <PrimitiveDrawer.Viewport>
          <PrimitiveDrawer.Popup>
            <PrimitiveDrawer.Title>Snap</PrimitiveDrawer.Title>
          </PrimitiveDrawer.Popup>
        </PrimitiveDrawer.Viewport>
      </PrimitiveDrawer.Portal>
    </PrimitiveDrawer.Root>,
  );

  click("button");

  await settle();
  const popup = document.querySelector<HTMLElement>("[role=dialog]")!;
  Object.defineProperty(popup, "offsetHeight", { configurable: true, value: 400 });

  window.dispatchEvent(new Event("resize"));

  await settle();

  press(popup, "pointerdown", 250);

  press(popup, "pointermove", 50);

  press(popup, "pointerup", 50);

  await settle();

  expect(requested as number | string | null).toBe(300);

  expect(popup.style.getPropertyValue("--drawer-snap-point-offset")).toBe("300px");
});
