import { expect, spyOn, test } from "bun:test";

import { useState } from "preact/hooks";

import { ContextMenu } from "../../../registry/ui/primitives/context-menu";
import { DirectionProvider } from "../../../registry/ui/primitives/direction-provider";
import { Menu } from "../../../registry/ui/primitives/menu";
import { Menubar } from "../../../registry/ui/primitives/menubar";
import { NavigationMenu } from "../../../registry/ui/primitives/navigation-menu";
import { ScrollArea } from "../../../registry/ui/primitives/scroll-area";
import { Select } from "../../../registry/ui/primitives/select";
import { act, fire, render, settle } from "../../utils";
function get(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}
function click(selector: string) {
  act(() => get(selector).click());
}
function key(value: string, selector?: string) {
  fire(
    selector ? get(selector) : document.activeElement!,
    new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true }),
  );
}
function press(element: Element, type: string, x = 0, y = 0, pointerType = "mouse") {
  fire(
    element,
    new PointerEvent(type, {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerId: 1,
      pointerType,
      clientX: x,
      clientY: y,
    }),
  );
}
function Popup({ children }: any) {
  return (
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>{children}</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  );
}
function Basic() {
  return (
    <Menu.Root>
      <Menu.Trigger id="open">Open</Menu.Trigger>
      <Popup>
        <Menu.Item id="apple">Apple</Menu.Item>
        <Menu.Item disabled id="blocked">
          Blocked
        </Menu.Item>
        <Menu.Item id="banana">Banana</Menu.Item>
        <Menu.Item id="blueberry">Blueberry</Menu.Item>
      </Popup>
    </Menu.Root>
  );
}
test("menu keyboard opening, disabled skipping, Home/End and repeated-letter typeahead", async () => {
  render(<Basic />);
  act(() => get("#open").focus());
  key("ArrowDown");
  await settle();
  expect(document.activeElement?.id).toBe("apple");
  expect(get("[role=menu]").getAttribute("aria-labelledby")).toBe("open");
  key("ArrowDown");
  expect(document.activeElement?.id).toBe("banana");
  key("End");
  expect(document.activeElement?.id).toBe("blueberry");
  key("Home");
  key("b");
  expect(document.activeElement?.id).toBe("banana");
  key("b");
  expect(document.activeElement?.id).toBe("blueberry");
  key("Enter");
  await settle(80);
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(false);
  expect(document.activeElement?.id).toBe("open");
});
test("menu item cancellation and disabled items cannot activate", async () => {
  let count = 0;
  render(
    <Menu.Root>
      <Menu.Trigger id="open">Open</Menu.Trigger>
      <Popup>
        <Menu.Item
          id="cancel"
          onClick={(e) => {
            count++;
            e.preventBaseUIHandler();
          }}
        >
          Cancel
        </Menu.Item>
        <Menu.Item id="disabled" disabled onClick={() => count++}>
          Disabled
        </Menu.Item>
      </Popup>
    </Menu.Root>,
  );
  click("#open");
  await settle();
  click("#cancel");
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(true);
  click("#disabled");
  expect(count).toBe(2);
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(true);
});
test("menu checkbox toggles once on Enter and retains its menu; canceled changes retain checks", async () => {
  let count = 0;
  render(
    <Menu.Root>
      <Menu.Trigger id="open">Open</Menu.Trigger>
      <Popup>
        <Menu.CheckboxItem
          id="check"
          onCheckedChange={(value, details) => {
            count++;
            if (!value) details.cancel();
          }}
        >
          Check<Menu.CheckboxItemIndicator id="indicator">Y</Menu.CheckboxItemIndicator>
        </Menu.CheckboxItem>
      </Popup>
    </Menu.Root>,
  );
  click("#open");
  await settle();
  act(() => get("#check").focus());
  key("Enter");
  await settle();
  expect(count).toBe(1);
  expect(get("#check").getAttribute("aria-checked")).toBe("true");
  expect(Boolean(document.querySelector("#indicator"))).toBe(true);
  click("#check");
  expect(count).toBe(2);
  expect(get("#check").getAttribute("aria-checked")).toBe("true");
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(true);
});
test("radio menu selection is controlled and cancelable without closing", async () => {
  function Subject() {
    const [value, setValue] = useState("a");
    return (
      <Menu.Root>
        <Menu.Trigger id="open">Open</Menu.Trigger>
        <Popup>
          <Menu.RadioGroup
            value={value}
            onValueChange={(v, details) => {
              if (v === "c") details.cancel();
              else setValue(v);
            }}
          >
            {["a", "b", "c"].map((v) => (
              <Menu.RadioItem id={v} value={v}>
                {v}
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
        </Popup>
      </Menu.Root>
    );
  }
  render(<Subject />);
  click("#open");
  await settle();
  click("#b");
  expect(get("#b").getAttribute("aria-checked")).toBe("true");
  click("#c");
  expect(get("#c").getAttribute("aria-checked")).toBe("false");
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(true);
});
function Nested() {
  return (
    <Menu.Root>
      <Menu.Trigger id="open">Open</Menu.Trigger>
      <Popup>
        <Menu.Item>One</Menu.Item>
        <Menu.SubmenuRoot>
          <Menu.SubmenuTrigger id="sub">Sub</Menu.SubmenuTrigger>
          <Popup>
            <Menu.Item id="deep">Deep</Menu.Item>
          </Popup>
        </Menu.SubmenuRoot>
      </Popup>
    </Menu.Root>
  );
}
test("submenu arrows open/return and item activation closes its ancestors", async () => {
  render(<Nested />);
  click("#open");
  await settle();
  act(() => get("#sub").focus());
  key("ArrowRight");
  await settle();
  expect(document.querySelectorAll("[role=menu]").length).toBe(2);
  expect(document.activeElement?.id).toBe("deep");
  key("ArrowLeft");
  await settle(80);
  expect(document.querySelectorAll("[role=menu]").length).toBe(1);
  expect(document.activeElement?.id).toBe("sub");
  key("ArrowRight");
  await settle();
  click("#deep");
  await settle(80);
  expect(document.querySelectorAll("[role=menu]").length).toBe(0);
});
test("RTL submenu keyboard direction is reversed; Escape closes only the child", async () => {
  render(
    <DirectionProvider direction="rtl">
      <Nested />
    </DirectionProvider>,
  );
  click("#open");
  await settle();
  act(() => get("#sub").focus());
  key("ArrowLeft");
  await settle();
  expect(document.querySelectorAll("[role=menu]").length).toBe(2);
  key("Escape");
  await settle(80);
  expect(document.querySelectorAll("[role=menu]").length).toBe(1);
  expect(document.activeElement?.id).toBe("sub");
});
test("context menus open on keyboard invocation, right click, and cancel touch long press after movement", async () => {
  render(
    <ContextMenu.Root>
      <ContextMenu.Trigger id="context" tabIndex={0}>
        Target
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner>
          <ContextMenu.Popup>
            <ContextMenu.Item id="action">Action</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>,
  );
  act(() => get("#context").focus());
  key("ContextMenu");
  await settle();
  expect(document.activeElement?.id).toBe("action");
  key("Escape");
  await settle(80);
  fire(get("#context"), new MouseEvent("contextmenu", { bubbles: true, cancelable: true, clientX: 120, clientY: 80 }));
  await settle();
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(true);
  key("Escape");
  await settle(80);
  press(get("#context"), "pointerdown", 10, 10, "touch");
  press(get("#context"), "pointermove", 50, 50, "touch");
  await settle(730);
  expect(Boolean(document.querySelector("[role=menu]"))).toBe(false);
});
test("menubar keeps one menu open while keyboard navigation switches siblings", async () => {
  render(
    <Menubar>
      {["file", "edit"].map((v) => (
        <Menu.Root>
          <Menu.Trigger id={v}>{v}</Menu.Trigger>
          <Popup>
            <Menu.Item id={v + "-item"}>{v}</Menu.Item>
          </Popup>
        </Menu.Root>
      ))}
    </Menubar>,
  );
  act(() => get("#file").focus());
  key("ArrowRight");
  expect(document.activeElement?.id).toBe("edit");
  key("ArrowDown");
  await settle();
  expect(document.activeElement?.id).toBe("edit-item");
  key("ArrowLeft");
  await settle(80);
  expect(get("#file").getAttribute("aria-expanded")).toBe("true");
  expect(get("#edit").getAttribute("aria-expanded")).toBe("false");
  expect(document.querySelectorAll("[role=menu][data-open]").length).toBe(1);
});
const fruits = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry" },
];
function SelectParts() {
  return (
    <>
      <Select.Trigger id="select">
        <Select.Value placeholder="Choose" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner alignItemWithTrigger={false}>
          <Select.Popup>
            <Select.List>
              {fruits.map((v) => (
                <Select.Item value={v.value} id={"fruit-" + v.value}>
                  <Select.ItemText>{v.label}</Select.ItemText>
                  <Select.ItemIndicator>Y</Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </>
  );
}
test("select labels are present before opening; keyboard selection updates native form data and restores focus", async () => {
  render(
    <form id="form">
      <Select.Root name="fruit" items={fruits} defaultValue="b">
        <SelectParts />
      </Select.Root>
    </form>,
  );
  expect(get("#select").textContent).toBe("Banana");
  expect(new FormData(get("#form") as HTMLFormElement).get("fruit")).toBe("b");
  click("#select");
  await settle();
  expect(get("[role=listbox]").getAttribute("aria-multiselectable")).toBeNull();
  expect(document.activeElement?.id).toBe("fruit-b");
  key("ArrowDown");
  key("Enter");
  await settle(80);
  expect(get("#select").textContent).toBe("Cherry");
  expect(new FormData(get("#form") as HTMLFormElement).get("fruit")).toBe("c");
  expect(Boolean(document.querySelector("[role=listbox]"))).toBe(false);
  expect(document.activeElement?.id).toBe("select");
});
test("select cancellation, readonly state and form reset preserve controlled semantics", async () => {
  function Subject() {
    const [readOnly, setReadOnly] = useState(false);
    return (
      <form id="form">
        <button type="button" id="readonly" onClick={() => setReadOnly(true)}>
          Readonly
        </button>
        <Select.Root
          defaultValue="a"
          items={fruits}
          readOnly={readOnly}
          name="fruit"
          onValueChange={(v, d) => {
            if (v === "c") d.cancel();
          }}
        >
          <SelectParts />
        </Select.Root>
      </form>
    );
  }
  render(<Subject />);
  click("#select");
  await settle();
  click("#fruit-c");
  expect(get("#select").textContent).toBe("Apple");
  expect(Boolean(document.querySelector("[role=listbox]"))).toBe(true);
  click("#fruit-b");
  await settle(80);
  expect(get("#select").textContent).toBe("Banana");
  act(() => (get("#form") as HTMLFormElement).reset());
  await settle();
  expect(get("#select").textContent).toBe("Apple");
  click("#readonly");
  click("#select");
  await settle();
  expect(Boolean(document.querySelector("[role=listbox]"))).toBe(false);
});
test("multiple select toggles choices and serializes repeated form fields without closing", async () => {
  render(
    <form id="form">
      <Select.Root multiple name="fruit" items={fruits} defaultValue={["a"]}>
        <SelectParts />
      </Select.Root>
    </form>,
  );
  click("#select");
  await settle();
  click("#fruit-b");
  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["a", "b"]);
  click("#fruit-a");
  expect(new FormData(get("#form") as HTMLFormElement).getAll("fruit")).toEqual(["b"]);
  expect(get("[role=listbox]").getAttribute("aria-multiselectable")).toBe("true");
});
test("select uses object equality and serialization callbacks", async () => {
  const values = [{ id: 1 }, { id: 2 }];
  render(
    <form id="form">
      <Select.Root
        name="number"
        items={values.map((v) => ({ value: v, label: `Number ${v.id}` }))}
        defaultValue={{ id: 2 }}
        isItemEqualToValue={(a, b) => a?.id === b?.id}
        itemToStringValue={(v) => String(v.id)}
      >
        <Select.Trigger id="select">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.List>
                {values.map((v) => (
                  <Select.Item value={v}>
                    <Select.ItemText>Number {v.id}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </form>,
  );
  expect(get("#select").textContent).toBe("Number 2");
  expect(new FormData(get("#form") as HTMLFormElement).get("number")).toBe("2");
});
function Nav() {
  return (
    <NavigationMenu.Root delay={0}>
      <NavigationMenu.List>
        {["one", "two"].map((v) => (
          <NavigationMenu.Item value={v}>
            <NavigationMenu.Trigger id={v}>{v}</NavigationMenu.Trigger>
            <NavigationMenu.Content>
              <NavigationMenu.Link id={v + "-link"} href={"#" + v}>
                {v} link
              </NavigationMenu.Link>
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner>
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
}
test("navigation menu portals active content, changes panels, and closes on link press", async () => {
  render(<Nav />);
  click("#one");
  await settle();
  expect(Boolean(document.querySelector("#one-link"))).toBe(true);
  expect(Boolean(document.querySelector("#two-link"))).toBe(false);
  expect(get("#one").getAttribute("aria-expanded")).toBe("true");
  click("#two");
  await settle(80);
  expect(Boolean(document.querySelector("#one-link"))).toBe(false);
  expect(Boolean(document.querySelector("#two-link"))).toBe(true);
  click("#two-link");
  await settle(80);
  expect(get("#two").getAttribute("aria-expanded")).toBe("false");
});
test("navigation menu keyboard enters the active panel and Escape restores its trigger", async () => {
  render(<Nav />);
  act(() => get("#one").focus());
  key("ArrowDown");
  await settle();
  expect(document.activeElement?.id).toBe("one-link");
  key("Escape");
  await settle(80);
  expect(document.activeElement?.id).toBe("one");
  expect(get("#one").getAttribute("aria-expanded")).toBe("false");
});
function dimensions(el: HTMLElement, values: Record<string, number>) {
  for (const [key, value] of Object.entries(values)) Object.defineProperty(el, key, { configurable: true, value });
}
function Area() {
  return (
    <ScrollArea.Root id="area">
      <ScrollArea.Viewport id="viewport">
        <div style={{ height: 500, width: 500 }}>Content</div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" id="vertical">
        <ScrollArea.Thumb id="thumb-y" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar orientation="horizontal" id="horizontal">
        <ScrollArea.Thumb id="thumb-x" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner id="corner" />
    </ScrollArea.Root>
  );
}
test("scroll area releases removed content from resize observation and avoids observing it twice", async () => {
  const observe = spyOn(ResizeObserver.prototype, "observe");
  const unobserve = spyOn(ResizeObserver.prototype, "unobserve");
  try {
    render(<Area />);
    await settle();
    const viewport = get("#viewport");
    const original = viewport.firstElementChild!;
    observe.mockClear();
    const added = document.createElement("div");
    viewport.append(added);
    await settle();
    expect(observe.mock.calls.filter(([element]) => element === original)).toHaveLength(0);
    expect(observe.mock.calls.filter(([element]) => element === added)).toHaveLength(1);
    original.remove();
    await settle();
    expect(unobserve).toHaveBeenCalledWith(original);
    expect(observe.mock.calls.filter(([element]) => element === added)).toHaveLength(1);
  } finally {
    observe.mockRestore();
    unobserve.mockRestore();
  }
});

test("scroll area measures overflow, thumb travel, edge attributes and corner dimensions", async () => {
  render(<Area />);
  dimensions(get("#viewport"), { clientWidth: 100, clientHeight: 100, scrollWidth: 500, scrollHeight: 500 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  dimensions(get("#vertical"), { clientHeight: 100, offsetWidth: 10 });
  dimensions(get("#horizontal"), { clientWidth: 100, offsetHeight: 10 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  expect(get("#area").hasAttribute("data-has-overflow-x")).toBe(true);
  expect(get("#area").hasAttribute("data-overflow-y-end")).toBe(true);
  expect(get("#corner").style.width).toBe("var(--scroll-area-corner-width)");
  get("#viewport").scrollTop = 400;
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  expect(get("#area").hasAttribute("data-overflow-y-start")).toBe(true);
  expect(get("#area").hasAttribute("data-overflow-y-end")).toBe(false);
  expect(get("#thumb-y").style.transform).toContain("80px");
});
test("scrollbar thumb dragging, cancellation cleanup and wheel edge chaining", async () => {
  render(<Area />);
  dimensions(get("#viewport"), { clientWidth: 100, clientHeight: 100, scrollWidth: 100, scrollHeight: 500 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  dimensions(get("#vertical"), { clientHeight: 100, offsetWidth: 10 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  press(get("#thumb-y"), "pointerdown", 0, 0);
  press(document.body, "pointermove", 0, 40);
  expect(get("#viewport").scrollTop).toBe(200);
  press(document.body, "pointercancel", 0, 40);
  press(document.body, "pointermove", 0, 60);
  expect(get("#viewport").scrollTop).toBe(200);
  const wheel = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
  fire(get("#vertical"), wheel);
  expect(wheel.defaultPrevented).toBe(true);
  expect(get("#viewport").scrollTop).toBe(220);
  get("#viewport").scrollTop = 400;
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  const edge = new WheelEvent("wheel", { deltaY: 20, bubbles: true, cancelable: true });
  fire(get("#vertical"), edge);
  expect(edge.defaultPrevented).toBe(false);
});
test("select closed typeahead changes values without opening and reports list-navigation", async () => {
  const reasons: string[] = [];
  render(
    <Select.Root items={fruits} defaultValue="a" onValueChange={(_, d) => reasons.push(d.reason)}>
      <SelectParts />
    </Select.Root>,
  );
  act(() => get("#select").focus());
  key("b");
  expect(get("#select").textContent).toBe("Banana");
  expect(Boolean(document.querySelector("[role=listbox]"))).toBe(false);
  expect(reasons).toEqual(["list-navigation"]);
});
test("detached menu handles support keyboard opening and payload children", async () => {
  const handle = Menu.createHandle<string>();
  render(
    <>
      <Menu.Trigger handle={handle} payload="Payload" id="detached">
        Open
      </Menu.Trigger>
      <Menu.Root handle={handle}>
        {(payload) => (
          <Popup>
            <Menu.Item id="payload">{payload}</Menu.Item>
          </Popup>
        )}
      </Menu.Root>
    </>,
  );
  act(() => get("#detached").focus());
  key("ArrowDown");
  await settle();
  expect(get("#payload").textContent).toBe("Payload");
  expect(document.activeElement?.id).toBe("payload");
});
test("scroll track clicks center the thumb and can continue dragging", async () => {
  render(<Area />);
  dimensions(get("#viewport"), { clientWidth: 100, clientHeight: 100, scrollWidth: 100, scrollHeight: 500 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  dimensions(get("#vertical"), { clientHeight: 100, offsetWidth: 10 });
  fire(get("#viewport"), new Event("scroll"));
  await settle();
  press(get("#vertical"), "pointerdown", 0, 50);
  expect(get("#viewport").scrollTop).toBe(200);
  press(document.body, "pointermove", 0, 70);
  expect(get("#viewport").scrollTop).toBe(300);
  press(document.body, "pointerup", 0, 70);
});
test("menubar updates its roving tab stop after focusing another trigger", async () => {
  render(
    <Menubar>
      {["file", "edit"].map((v) => (
        <Menu.Root>
          <Menu.Trigger id={v}>{v}</Menu.Trigger>
          <Popup>
            <Menu.Item>{v}</Menu.Item>
          </Popup>
        </Menu.Root>
      ))}
    </Menubar>,
  );
  act(() => get("#file").focus());
  key("ArrowRight");
  expect(get("#file").tabIndex).toBe(-1);
  expect(get("#edit").tabIndex).toBe(0);
});
test("Tab and Shift+Tab leave modal menus in document order", async () => {
  render(
    <>
      <button id="before">Before</button>
      <Basic />
      <button id="after">After</button>
    </>,
  );
  click("#open");
  await settle();
  key("Tab");
  await settle(80);
  expect(document.activeElement?.id).toBe("after");
  click("#open");
  await settle();
  fire(
    document.activeElement!,
    new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }),
  );
  await settle(80);
  expect(document.activeElement?.id).toBe("before");
});
test("Tab leaves a modal Select after its trigger", async () => {
  render(
    <>
      <Select.Root items={fruits}>
        <SelectParts />
      </Select.Root>
      <button id="after">After</button>
    </>,
  );
  click("#select");
  await settle();
  key("Tab");
  await settle(80);
  expect(document.activeElement?.id).toBe("after");
  expect(Boolean(document.querySelector("[role=listbox]"))).toBe(false);
});