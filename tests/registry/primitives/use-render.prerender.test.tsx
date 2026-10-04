import { afterAll, beforeAll, expect, test } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { Accordion } from "@registry/ui/primitives/accordion";
import { Checkbox } from "@registry/ui/primitives/checkbox";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { mergeProps } from "@registry/ui/primitives/merge-props";
import { Slider } from "@registry/ui/primitives/slider";
import { Tabs } from "@registry/ui/primitives/tabs";
import { Toggle } from "@registry/ui/primitives/toggle";
import { ToggleGroup } from "@registry/ui/primitives/toggle-group";
import { useRender } from "@registry/ui/primitives/use-render";
import { renderToString } from "preact-render-to-string";

import { Calendar } from "../../../registry/ui/calendar";
import { Carousel, CarouselContent, CarouselItem } from "../../../registry/ui/carousel";
import { ChartContainer } from "../../../registry/ui/chart";
import { Command, CommandInput, CommandItem, CommandList } from "../../../registry/ui/command";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../../../registry/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "../../../registry/ui/drawer";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../registry/ui/input-otp";
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "../../../registry/ui/message-scroller";
import { Popover, PopoverContent, PopoverTrigger } from "../../../registry/ui/popover";
import { Combobox } from "../../../registry/ui/primitives/combobox";
import { FloatingFocusManager } from "../../../registry/ui/primitives/internals/FloatingFocusManager";
import { FloatingPortal } from "../../../registry/ui/primitives/internals/FloatingPortal";
import { useAnchorPositioning } from "../../../registry/ui/primitives/internals/useAnchorPositioning";
import { useDismiss } from "../../../registry/ui/primitives/internals/useDismiss";
import { useFloatingRootContext } from "../../../registry/ui/primitives/internals/useFloatingRootContext";
import { useScrollLock } from "../../../registry/ui/primitives/internals/useScrollLock";
import { Menu } from "../../../registry/ui/primitives/menu";
import { NavigationMenu } from "../../../registry/ui/primitives/navigation-menu";
import { ScrollArea } from "../../../registry/ui/primitives/scroll-area";
import { Select } from "../../../registry/ui/primitives/select";
import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireItem,
  QuestionnaireProgress,
} from "../../../registry/ui/questionnaire";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "../../../registry/ui/resizable";
import { SidebarProvider, Sidebar, SidebarContent } from "../../../registry/ui/sidebar";
import { Toaster as SonnerToaster } from "../../../registry/ui/sonner";
import { Toaster } from "../../../registry/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../registry/ui/tooltip";

// Prerendering runs without a document; refs are skipped there.
beforeAll(async () => {
  await GlobalRegistrator.unregister();
});
afterAll(() => {
  GlobalRegistrator.register({ url: "http://localhost/" });
});

function Badge({ className, render: renderProp, ...props }: any) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: ["b", className].filter(Boolean).join(" ") }, props),
    render: renderProp,
    state: { slot: "badge" },
  });
}

test("useRender renders to a string without a document", () => {
  expect(typeof document).toBe("undefined");
  expect(renderToString(<Badge className="x">Hi</Badge>)).toBe('<span data-slot="badge" class="b x">Hi</span>');
  expect(renderToString(<Badge render={<a href="/a" />}>A</Badge>)).toBe(
    '<a href="/a" data-slot="badge" class="b">A</a>',
  );
});

test("state primitives prerender without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(
    <>
      <ToggleGroup defaultValue={["a"]}>
        <Toggle value="a">A</Toggle>
      </ToggleGroup>
      <Checkbox.Root defaultChecked name="terms" />
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>
      <Accordion.Root defaultValue={["a"]}>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Slider.Root defaultValue={[20, 40]}>
        <Slider.Control>
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Control>
      </Slider.Root>
    </>,
  );
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('role="tabpanel"');
  expect(markup).toContain('aria-expanded="true"');
  expect(markup).toContain('value="20"');
  expect(markup).toContain('value="40"');
});
function FloatingSubject() {
  const context = useFloatingRootContext({ open: true, elements: { reference: null, floating: null } });
  useDismiss(context);
  useScrollLock(true);
  const position = useAnchorPositioning({ mounted: true });
  return (
    <>
      <div style={position.positionerStyles}>positioner</div>
      <FloatingPortal>
        <FloatingFocusManager context={context}>
          <div>popup</div>
        </FloatingFocusManager>
      </FloatingPortal>
    </>
  );
}
test("floating infrastructure prerenders without browser globals or portal content", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(<FloatingSubject />);
  expect(markup).toContain("positioner");
  expect(markup).toContain("opacity:0");
  expect(markup).not.toContain("popup");
});
test("overlay wrappers prerender triggers without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(
    <>
      <Dialog defaultOpen>
        <DialogTrigger>Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
      <Drawer snapPoints={[100, 1]}>
        <DrawerTrigger>Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Title</DrawerTitle>
        </DrawerContent>
      </Drawer>
      <Popover>
        <PopoverTrigger>Popover</PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
      <Tooltip>
        <TooltipTrigger>Tooltip</TooltipTrigger>
        <TooltipContent>Tip</TooltipContent>
      </Tooltip>
    </>,
  );
  expect(markup).toContain('data-slot="dialog-trigger"');
  expect(markup).toContain('data-slot="drawer-trigger"');
  expect(markup).not.toContain('data-slot="dialog-content"');
  expect(markup).not.toContain('data-slot="tooltip-content"');
});

test("menu, selection, navigation and scroll primitives prerender without browser globals", () => {
  const markup = renderToString(
    <>
      <Menu.Root defaultOpen>
        <Menu.Trigger>Menu</Menu.Trigger>
        <Menu.Portal>
          <Menu.Popup>Hidden menu</Menu.Popup>
        </Menu.Portal>
      </Menu.Root>
      <Select.Root name="fruit" items={{ apple: "Apple" }} defaultValue="apple">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Popup>Hidden list</Select.Popup>
        </Select.Portal>
      </Select.Root>
      <NavigationMenu.Root defaultValue="a">
        <NavigationMenu.List>
          <NavigationMenu.Item value="a">
            <NavigationMenu.Trigger>Nav</NavigationMenu.Trigger>
            <NavigationMenu.Content>Hidden content</NavigationMenu.Content>
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <ScrollArea.Root>
        <ScrollArea.Viewport>Scroll content</ScrollArea.Viewport>
        <ScrollArea.Scrollbar>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </>,
  );
  expect(markup).toContain("Apple");
  expect(markup).toContain('name="fruit"');
  expect(markup).toContain("Scroll content");
  expect(markup).not.toContain("Hidden menu");
  expect(markup).not.toContain("Hidden list");
  expect(markup).not.toContain("Hidden content");
});
test("phase 7 components and their compatibility libraries prerender without browser globals", () => {
  const html = renderToString(
    <>
      <Calendar mode="single" month={new Date(2026, 9, 1)} />
      <ChartContainer config={{ count: { label: "Count", color: "red" } }}>
        <div />
      </ChartContainer>
      <Combobox.Root items={[{ value: "1", label: "One" }]} itemToStringValue={(value) => value.value}>
        <Combobox.Input />
        <Combobox.Trigger>Open</Combobox.Trigger>
      </Combobox.Root>
      <Command>
        <CommandInput />
        <CommandList>
          <CommandItem>One</CommandItem>
        </CommandList>
      </Command>
      <Carousel>
        <CarouselContent>
          <CarouselItem>Slide</CarouselItem>
        </CarouselContent>
      </Carousel>
      <InputOTP maxLength={1}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
        </InputOTPGroup>
      </InputOTP>
      <ResizablePanelGroup>
        <ResizablePanel>One</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Two</ResizablePanel>
      </ResizablePanelGroup>
      <SidebarProvider>
        <Sidebar>
          <SidebarContent>Navigation</SidebarContent>
        </Sidebar>
      </SidebarProvider>
      <SonnerToaster />
      <Toaster />
    </>,
  );
  expect(html).toContain('data-slot="calendar"');
  expect(html).toContain('data-slot="command"');
  expect(html).toContain('data-slot="resizable-panel"');
  expect(html).toContain('data-slot="input-otp"');
  expect(html).toContain('role="combobox"');
  expect(html).toContain("Navigation");
});

test("phase 8 primitives prerender without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(
    <>
      <MessageScrollerProvider>
        <MessageScroller>
          <MessageScrollerViewport>
            <MessageScrollerContent>
              <MessageScrollerItem messageId="m1">Message</MessageScrollerItem>
            </MessageScrollerContent>
          </MessageScrollerViewport>
        </MessageScroller>
      </MessageScrollerProvider>
      <Questionnaire items={[{ name: "answer", choices: [{ value: "a" }] }]} shortcuts="letters">
        <QuestionnaireProgress />
        <QuestionnaireItem name="answer">
          <QuestionnaireChoice value="a">Answer</QuestionnaireChoice>
        </QuestionnaireItem>
      </Questionnaire>
    </>,
  );
  expect(markup).toContain('role="log"');
  expect(markup).toContain('data-message-id="m1"');
  expect(markup).toContain('aria-valuemax="1"');
  expect(markup).toContain('data-shortcut="A"');
});
test("Field and Form prerender without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const html = renderToString(
    <Form errors={{ email: "Taken" }}>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Control defaultValue="before" />
        <Field.Description>Required</Field.Description>
        <Field.Error />
        <Field.Validity>{(state) => <span>{state.error}</span>}</Field.Validity>
      </Field.Root>
    </Form>,
  );
  expect(html).toContain('name="email"');
  expect(html).toContain('aria-invalid="true"');
  expect(html).toContain("Taken");
});