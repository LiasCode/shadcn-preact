import { expect, spyOn, test } from "bun:test";

import { Accordion } from "@registry/ui/primitives/accordion";
import { Checkbox } from "@registry/ui/primitives/checkbox";
import { Collapsible } from "@registry/ui/primitives/collapsible";
import { DirectionProvider } from "@registry/ui/primitives/direction-provider";
import { Radio } from "@registry/ui/primitives/radio";
import { RadioGroup } from "@registry/ui/primitives/radio-group";
import { Slider } from "@registry/ui/primitives/slider";
import { Switch } from "@registry/ui/primitives/switch";
import { Tabs } from "@registry/ui/primitives/tabs";
import { Toggle } from "@registry/ui/primitives/toggle";
import { ToggleGroup } from "@registry/ui/primitives/toggle-group";
import { useState } from "preact/hooks";

import { act, fire, render, settle } from "../../utils";

const key = (value: string) =>
  new KeyboardEvent("keydown", { key: value, bubbles: true, cancelable: true });

const click = (element: HTMLElement) => act(() => element.click());

test("toggles support controlled state, cancellation and render state", () => {
  let changes = 0;
  const container = render(
    <Toggle
      defaultPressed
      onPressedChange={(_, details) => {
        changes++;
        details.cancel();
      }}
      className={(state) => (state.pressed ? "pressed" : "idle")}
    />,
  );
  const toggle = container.querySelector("button")!;
  click(toggle);

  expect(changes).toBe(1);

  expect(toggle.getAttribute("aria-pressed")).toBe("true");

  expect(toggle.className).toBe("pressed");
});

test("toggle groups have one tab stop, skip disabled items and loop in RTL", async () => {
  const container = render(
    <DirectionProvider direction="rtl">
      <ToggleGroup defaultValue={["a"]}>
        <Toggle value="a">A</Toggle>
        <Toggle value="b" disabled>
          B
        </Toggle>
        <Toggle value="c">C</Toggle>
      </ToggleGroup>
    </DirectionProvider>,
  );
  const buttons = [...container.querySelectorAll("button")];
  expect(buttons.map((button) => button.tabIndex)).toEqual([0, -1, -1]);

  act(() => buttons[0]!.focus());

  fire(buttons[0]!, key("ArrowLeft"));

  await settle();

  expect(document.activeElement).toBe(buttons[2]!);

  fire(buttons[2]!, key("ArrowLeft"));

  await settle();

  expect(document.activeElement).toBe(buttons[0]!);

  fire(buttons[0]!, key("End"));

  await settle();

  expect(document.activeElement).toBe(buttons[2]!);

  click(buttons[2]!);

  expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
    "false",
    "false",
    "true",
  ]);
});

test("multiple toggle groups preserve other selections and canceled changes", () => {
  const container = render(
    <ToggleGroup<string>
      multiple
      defaultValue={["a"]}
      onValueChange={(value, details) => {
        if (value.includes("c")) {
          details.cancel();
        }
      }}
    >
      <Toggle value="a" />
      <Toggle value="b" />
      <Toggle value="c" />
    </ToggleGroup>,
  );
  const buttons = [...container.querySelectorAll("button")];
  click(buttons[1]!);

  click(buttons[2]!);

  expect(buttons.map((button) => button.getAttribute("aria-pressed"))).toEqual([
    "true",
    "true",
    "false",
  ]);
});

test("checkbox labels, indeterminate state, form values and reset use the native input", async () => {
  const container = render(
    <form>
      <label htmlFor="check">Terms</label>
      <Checkbox.Root id="check" name="terms" value="yes" indeterminate>
        <Checkbox.Indicator>✓</Checkbox.Indicator>
      </Checkbox.Root>
      <button type="reset">Reset</button>
    </form>,
  );
  const control = container.querySelector<HTMLElement>("[role=checkbox]")!;
  const input = container.querySelector<HTMLInputElement>("#check")!;
  expect(input.indeterminate).toBe(true);

  expect(control.getAttribute("aria-checked")).toBe("mixed");

  expect(control.hasAttribute("data-indeterminate")).toBe(true);

  expect(control.hasAttribute("data-unchecked")).toBe(false);

  click(container.querySelector("label")!);

  expect(input.checked).toBe(true);

  expect(new FormData(container.querySelector("form")!).get("terms")).toBe("yes");

  click(container.querySelector("button")!);

  await settle();

  expect(input.checked).toBe(false);
});

test("checkbox Space toggles while Enter does not toggle", () => {
  const container = render(<Checkbox.Root />);
  const control = container.querySelector<HTMLElement>("[role=checkbox]")!;
  fire(control, key(" "));

  fire(control, new KeyboardEvent("keyup", { key: " ", bubbles: true }));

  expect(control.getAttribute("aria-checked")).toBe("true");

  fire(control, key("Enter"));

  expect(control.getAttribute("aria-checked")).toBe("true");
});

test("switch controlled changes and cancellation restore the native input", () => {
  let changes = 0;
  const container = render(
    <Switch.Root checked={false} onCheckedChange={() => changes++}>
      <Switch.Thumb />
    </Switch.Root>,
  );
  click(container.querySelector<HTMLElement>("[role=switch]")!);

  expect(changes).toBe(1);

  expect(container.querySelector("input")!.checked).toBe(false);

  expect(container.querySelector("[role=switch]")!.getAttribute("aria-checked")).toBe("false");
});

test("read-only and disabled checkables suppress changes; uncheckedValue submits", () => {
  const container = render(
    <form>
      <Switch.Root name="switch" uncheckedValue="off" readOnly />
      <Checkbox.Root name="disabled" disabled />
    </form>,
  );
  click(container.querySelector<HTMLElement>("[role=switch]")!);

  click(container.querySelector<HTMLElement>("[role=checkbox]")!);

  expect(new FormData(container.querySelector("form")!).get("switch")).toBe("off");

  expect(new FormData(container.querySelector("form")!).has("disabled")).toBe(false);
});

test("radio arrows select enabled values while tab focus keeps the selection", async () => {
  const container = render(
    <form>
      <RadioGroup name="plan" defaultValue="b">
        <Radio.Root value="a" disabled />
        <Radio.Root value="b" />
        <Radio.Root value="c" />
      </RadioGroup>
    </form>,
  );
  const controls = [...container.querySelectorAll<HTMLElement>("[role=radio]")];
  expect(controls.map((control) => control.tabIndex)).toEqual([-1, 0, -1]);

  act(() => controls[1]!.focus());

  fire(controls[1]!, key("ArrowDown"));

  await settle();

  expect(controls[2]!.getAttribute("aria-checked")).toBe("true");

  expect(new FormData(container.querySelector("form")!).get("plan")).toBe("c");

  act(() => controls[1]!.focus());

  expect(controls[2]!.getAttribute("aria-checked")).toBe("true");
});

test("collapsible connects ARIA, supports cancellation, mounting and beforematch", async () => {
  const container = render(
    <Collapsible.Root
      onOpenChange={(open, details) => {
        if (!open) {
          details.cancel();
        }
      }}
    >
      <Collapsible.Trigger>Open</Collapsible.Trigger>
      <Collapsible.Panel hiddenUntilFound>Content</Collapsible.Panel>
    </Collapsible.Root>,
  );
  const trigger = container.querySelector("button")!;
  const panel = container.querySelector<HTMLElement>("[hidden]")!;
  expect(panel.getAttribute("hidden")).toBe("until-found");

  fire(panel, new Event("beforematch"));

  await settle();

  expect(trigger.getAttribute("aria-expanded")).toBe("true");

  expect(trigger.getAttribute("aria-controls")).toBe(panel.id);

  click(trigger);

  await settle();

  expect(trigger.getAttribute("aria-expanded")).toBe("true");
});

test("accordion uses independent tab stops and single open state", async () => {
  const container = render(
    <Accordion.Root defaultValue={["a"]} keepMounted>
      <Accordion.Item value="a">
        <Accordion.Header>
          <Accordion.Trigger>A</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>A content</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Header>
          <Accordion.Trigger>B</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Panel>B content</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
  );
  const triggers = [...container.querySelectorAll("button")];
  expect(triggers.map((trigger) => trigger.tabIndex)).toEqual([0, 0]);

  click(triggers[1]!);

  await settle();

  expect(triggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
    "false",
    "true",
  ]);
  const panel = container.querySelector<HTMLElement>(
    `#${triggers[1]!.getAttribute("aria-controls")}`,
  )!;
  expect(panel.getAttribute("aria-labelledby")).toBe(triggers[1]!.id);

  expect(container.querySelectorAll("[role=region][hidden]").length).toBe(1);
});

function TabFixture({ automatic = false }: { automatic?: boolean }) {
  return (
    <Tabs.Root defaultValue="a">
      <Tabs.List activateOnFocus={automatic}>
        <Tabs.Tab value="a">A</Tabs.Tab>
        <Tabs.Tab value="b">B</Tabs.Tab>
        <Tabs.Tab value="c" disabled>
          C
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="a">A panel</Tabs.Panel>
      <Tabs.Panel value="b">B panel</Tabs.Panel>
    </Tabs.Root>
  );
}

test("tabs default to manual activation and keep panel ARIA connected", async () => {
  const container = render(<TabFixture />);
  const tabs = [...container.querySelectorAll<HTMLElement>("[role=tab]")];
  act(() => tabs[0]!.focus());

  fire(tabs[0]!, key("ArrowRight"));

  await settle();

  expect(document.activeElement).toBe(tabs[1]!);

  expect(tabs[0]!.getAttribute("aria-selected")).toBe("true");

  click(tabs[1]!);

  await settle();

  expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
  const panel = container.querySelector<HTMLElement>("[role=tabpanel]")!;
  expect(panel.id).toBe(tabs[1]!.getAttribute("aria-controls")!);

  expect(panel.getAttribute("aria-labelledby")).toBe(tabs[1]!.id);

  expect(Number(panel.getAttribute("data-index"))).toBeGreaterThanOrEqual(0);
});

test("automatic tabs activate on arrow focus", async () => {
  const container = render(<TabFixture automatic />);
  const tabs = [...container.querySelectorAll<HTMLElement>("[role=tab]")];
  act(() => tabs[0]!.focus());

  fire(tabs[0]!, key("ArrowRight"));

  await settle();

  expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
});

test("tabs fall back after removal and automatic changes cannot be canceled", async () => {
  const reasons: string[] = [];

  function Fixture() {
    const [show, setShow] = useState(true);
    return (
      <>
        <button onClick={() => setShow(false)}>Remove</button>
        <Tabs.Root
          defaultValue="a"
          onValueChange={(_, details) => {
            reasons.push(details.reason);

            details.cancel();
          }}
        >
          <Tabs.List>
            {show && <Tabs.Tab value="a">A</Tabs.Tab>}
            <Tabs.Tab value="b">B</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="b">B</Tabs.Panel>
        </Tabs.Root>
      </>
    );
  }

  const container = render(<Fixture />);
  click(container.querySelector("button")!);

  await settle();

  expect(container.querySelector("[role=tab]")!.getAttribute("aria-selected")).toBe("true");

  expect(reasons).toEqual(["missing"]);
});

test("slider keyboard respects decimals, range gaps and commits", () => {
  const commits: readonly number[][] = [];
  const mutable = commits as number[][];
  const container = render(
    <Slider.Root
      defaultValue={[0.2, 0.6]}
      min={0}
      max={1}
      step={0.1}
      minStepsBetweenValues={2}
      onValueCommitted={(value) => mutable.push([...value])}
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Indicator />
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>,
  );
  const inputs = [...container.querySelectorAll("input")];
  fire(inputs[0]!, key("ArrowRight"));

  expect(inputs[0]!.value).toBe("0.3");

  fire(inputs[0]!, key("End"));

  expect(inputs[0]!.value).toBe("0.4");

  fire(inputs[0]!, key("ArrowRight"));

  expect(inputs[0]!.value).toBe("0.4");

  expect(commits).toEqual([
    [0.3, 0.6],
    [0.4, 0.6],
  ]);
});

test("slider value changes retain resize subscriptions and center alignment needs no size observer", () => {
  const observe = spyOn(ResizeObserver.prototype, "observe");
  const disconnect = spyOn(ResizeObserver.prototype, "disconnect");

  try {
    const container = render(
      <Slider.Root defaultValue={50} thumbAlignment="edge">
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );
    const input = container.querySelector("input")!;
    observe.mockClear();

    disconnect.mockClear();

    for (let index = 0; index < 5; index++) {
      fire(input, key("ArrowRight"));
    }

    expect(input.value).toBe("55");

    expect(observe).not.toHaveBeenCalled();

    expect(disconnect).not.toHaveBeenCalled();

    render(
      <Slider.Root defaultValue={50} thumbAlignment="center">
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>,
    );

    expect(observe).not.toHaveBeenCalled();
  } finally {
    observe.mockRestore();

    disconnect.mockRestore();
  }
});

test("slider cancellation suppresses commits and restores the input", () => {
  let commits = 0;
  const container = render(
    <Slider.Root
      defaultValue={30}
      onValueChange={(_, details) => details.cancel()}
      onValueCommitted={() => commits++}
    >
      <Slider.Control>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>,
  );
  const input = container.querySelector("input")!;
  fire(input, key("ArrowRight"));

  expect(input.value).toBe("30");

  expect(commits).toBe(0);
});

test("controlled and canceled radio changes keep native form values consistent", () => {
  const container = render(
    <form>
      <RadioGroup name="controlled" value="a">
        <Radio.Root value="a" />
        <Radio.Root value="b" />
      </RadioGroup>
      <RadioGroup name="canceled" defaultValue="a" onValueChange={(_, details) => details.cancel()}>
        <Radio.Root value="a" />
        <Radio.Root value="b" />
      </RadioGroup>
    </form>,
  );
  const controls = [...container.querySelectorAll<HTMLElement>("[role=radio]")];
  click(controls[1]!);

  click(controls[3]!);
  const formData = new FormData(container.querySelector("form")!);
  expect(formData.get("controlled")).toBe("a");

  expect(formData.get("canceled")).toBe("a");
});

test("range slider pointer collisions push neighboring thumbs and commit only applied values", () => {
  const changes: number[][] = [];
  const commits: number[][] = [];
  const container = render(
    <Slider.Root
      defaultValue={[20, 40]}
      minStepsBetweenValues={10}
      onValueChange={(value) => changes.push([...value])}
      onValueCommitted={(value) => commits.push([...value])}
    >
      <Slider.Control>
        <Slider.Thumb index={0} />
        <Slider.Thumb index={1} />
      </Slider.Control>
    </Slider.Root>,
  );
  const control = container.querySelector<HTMLElement>("[data-orientation]")!
    .firstElementChild as HTMLElement;
  const inputs = [...container.querySelectorAll("input")];

  const rect = (left: number, width: number) => ({
    left,
    right: left + width,
    top: 0,
    bottom: 20,
    width,
    height: 20,
    x: left,
    y: 0,
    toJSON() {},
  });

  control.getBoundingClientRect = () => rect(0, 100);
  inputs[0]!.parentElement!.getBoundingClientRect = () => rect(10, 20);
  inputs[1]!.parentElement!.getBoundingClientRect = () => rect(30, 20);

  const pointer = (type: string, x: number) =>
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: 10,
      bubbles: true,
      cancelable: true,
    });

  fire(inputs[0]!.parentElement!, pointer("pointerdown", 20));

  fire(control, pointer("pointermove", 60));

  fire(control, pointer("pointerup", 60));

  expect(inputs.map((input) => Number(input.value))).toEqual([60, 70]);

  expect(changes).toEqual([[60, 70]]);

  expect(commits).toEqual([[60, 70]]);
});

test("controlled sliders restore native inputs and reset without losing their value", async () => {
  const container = render(
    <form>
      <Slider.Root value={30} name="volume">
        <Slider.Control>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
      <button type="reset">Reset</button>
    </form>,
  );
  const input = container.querySelector("input")!;
  input.value = "50";
  fire(input, new Event("input", { bubbles: true }));

  expect(input.value).toBe("30");

  click(container.querySelector("button")!);

  await settle();

  expect(input.value).toBe("30");
});

test("disabled sliders suppress keyboard and pointer updates", () => {
  let changes = 0;
  const container = render(
    <Slider.Root defaultValue={30} disabled onValueChange={() => changes++}>
      <Slider.Control>
        <Slider.Thumb />
      </Slider.Control>
    </Slider.Root>,
  );
  const input = container.querySelector("input")!;
  fire(input, key("ArrowRight"));

  fire(
    input.parentElement!,
    new PointerEvent("pointerdown", { pointerId: 1, button: 0, clientX: 50, bubbles: true }),
  );

  expect(input.disabled).toBe(true);

  expect(input.value).toBe("30");

  expect(changes).toBe(0);
});

test("multiple accordions retain the other open items", () => {
  const container = render(
    <Accordion.Root multiple defaultValue={["a"]}>
      <Accordion.Item value="a">
        <Accordion.Trigger>A</Accordion.Trigger>
        <Accordion.Panel>A</Accordion.Panel>
      </Accordion.Item>
      <Accordion.Item value="b">
        <Accordion.Trigger>B</Accordion.Trigger>
        <Accordion.Panel>B</Accordion.Panel>
      </Accordion.Item>
    </Accordion.Root>,
  );
  const triggers = [...container.querySelectorAll("button")];
  click(triggers[1]!);

  expect(triggers.map((trigger) => trigger.getAttribute("aria-expanded"))).toEqual([
    "true",
    "true",
  ]);
});
