import { expect, test } from "bun:test";

import { Combobox } from "@registry/ui/primitives/combobox";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { Select } from "@registry/ui/primitives/select";
import { Slider } from "@registry/ui/primitives/slider";
import { useState } from "preact/hooks";

import { act, fire, render, settle } from "../../utils";

function submit(root: HTMLElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  fire(root.querySelector("form")!, event);
  return event;
}
function choose(root: HTMLElement, index = 0) {
  const trigger = root.querySelector<HTMLElement>("[role=combobox]")!;
  act(() => trigger.click());
  const option = document.querySelectorAll<HTMLElement>("[role=option]")[index]!;
  act(() => option.click());
}

test("Select inherits field name and accessible labels", () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="fruit">
        <Field.Label>Fruit</Field.Label>
        <Field.Description>Pick one</Field.Description>
        <Select.Root>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner>
              <Select.Popup>
                <Select.Item value="apple">
                  <Select.ItemText>Apple</Select.ItemText>
                </Select.Item>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </Field.Root>
    </Form>,
  );
  const trigger = root.querySelector<HTMLElement>("[role=combobox]")!;
  expect(trigger.getAttribute("aria-labelledby")).toBe(root.querySelector("label")!.id);
  expect(root.querySelector("input")!.name).toBe("fruit");
  submit(root);
  expect(values).toEqual({ fruit: "" });
});

for (const [kind, Root, Trigger] of [
  ["Select", Select.Root, Select.Trigger],
  ["Combobox", Combobox.Root, Combobox.Input],
] as const) {
  test(`${kind} validates raw objects and submits serialized values`, () => {
    const item = { id: 1, label: "One" };
    let validated: unknown;
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root
          name="selection"
          validate={(value) => {
            validated = value;
            return null;
          }}
        >
          <Root defaultValue={item} itemToStringValue={(value) => String(value.id)}>
            <Trigger />
          </Root>
        </Field.Root>
      </Form>,
    );
    submit(root);
    expect(validated).toBe(item);
    expect(values).toEqual({ selection: "1" });
    expect(new FormData(root.querySelector("form")!).get("selection")).toBe("1");
  });
  test(`${kind} multiple selections submit string arrays and disabled fields are omitted`, () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="selection">
          <Root multiple defaultValue={["a", "b"]}>
            <Trigger />
          </Root>
        </Field.Root>
        <Field.Root name="disabled" disabled>
          <Root defaultValue="hidden">
            <Trigger />
          </Root>
        </Field.Root>
      </Form>,
    );
    submit(root);
    expect(values).toEqual({ selection: ["a", "b"] });
    expect(new FormData(root.querySelector("form")!).getAll("selection")).toEqual(["a", "b"]);
  });
  test(`${kind} empty required selection prevents submit and focuses a visible control`, () => {
    let calls = 0;
    const root = render(
      <Form
        onFormSubmit={() => {
          calls++;
        }}
      >
        <Field.Root name="selection">
          <Root required>
            <Trigger />
          </Root>
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    submit(root);
    const control = root.querySelector<HTMLElement>("[role=combobox]")!;
    expect(calls).toBe(0);
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(document.activeElement).toBe(control);
  });
  test(`${kind} controlled updates set field state, and returning to initial arrays clears dirty`, () => {
    let update: (value: string[]) => void = () => {};
    function Subject() {
      const [value, setValue] = useState(["a"]);
      update = setValue;
      return (
        <Field.Root>
          <Root multiple value={value}>
            <Trigger />
          </Root>
        </Field.Root>
      );
    }
    const root = render(<Subject />);
    const control = root.querySelector<HTMLElement>("[role=combobox]")!;
    act(() => update(["b"]));
    expect(control.hasAttribute("data-dirty")).toBe(true);
    act(() => update(["a"]));
    expect(control.hasAttribute("data-dirty")).toBe(false);
  });
  test(`${kind} reset restores values and a canceled reset preserves the field`, async () => {
    let update: (value: string) => void = () => {};
    function Subject() {
      const [value, setValue] = useState("a");
      update = setValue;
      return (
        <Form>
          <Field.Root name="selection">
            <Root defaultValue="a" value={value} onValueChange={(next) => setValue(String(next))}>
              <Trigger />
            </Root>
          </Field.Root>
        </Form>
      );
    }
    const root = render(<Subject />);
    act(() => update("b"));
    act(() => root.querySelector("form")!.reset());
    await settle();
    expect(root.querySelector("input")!.value).toBe("a");
    expect(root.querySelector("[role=combobox]")!.hasAttribute("data-dirty")).toBe(false);
    act(() => update("c"));
    const form = root.querySelector("form")!;
    form.addEventListener("reset", (event) => event.preventDefault(), { once: true });
    fire(form, new Event("reset", { bubbles: true, cancelable: true }));
    await settle();
    expect(root.querySelector("input")!.value).toBe("c");
  });
}

test("Select onBlur validates the chosen value after closing the popup", () => {
  let validated: unknown;
  const root = render(
    <Field.Root
      name="fruit"
      validationMode="onBlur"
      validate={(value) => {
        validated = value;
        return null;
      }}
    >
      <Select.Root required>
        <Select.Trigger />
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="apple">
                <Select.ItemText>Apple</Select.ItemText>
              </Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>,
  );
  choose(root);
  expect(validated).toBe("apple");
  expect(root.querySelector("[role=combobox]")!.hasAttribute("data-valid")).toBe(true);
});

test("Slider registers numbers and ranges without string encoding and compares ranges by contents", () => {
  let values: unknown;
  let update: (value: number[]) => void = () => {};
  function Subject() {
    const [value, setValue] = useState([20, 40]);
    update = setValue;
    return (
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="range">
          <Slider.Root value={value}>
            <Slider.Control>
              <Slider.Thumb index={0} />
              <Slider.Thumb index={1} />
            </Slider.Control>
          </Slider.Root>
        </Field.Root>
        <Field.Root name="single">
          <Slider.Root defaultValue={5}>
            <Slider.Control>
              <Slider.Thumb />
            </Slider.Control>
          </Slider.Root>
        </Field.Root>
      </Form>
    );
  }
  const root = render(<Subject />);
  submit(root);
  expect(values).toEqual({ range: [20, 40], single: 5 });
  act(() => update([21, 40]));
  expect(root.querySelector("[role=group]")!.hasAttribute("data-dirty")).toBe(true);
  act(() => update([20, 40]));
  expect(root.querySelector("[role=group]")!.hasAttribute("data-dirty")).toBe(false);
  expect(new FormData(root.querySelector("form")!).getAll("range")).toEqual(["20", "40"]);
});

test("Slider validates custom constraints, focuses its native range and supports keyboard changes", () => {
  let value: unknown;
  const root = render(
    <Form>
      <Field.Root
        name="volume"
        validationMode="onChange"
        validate={(next) => {
          value = next;
          return Number(next) < 10 ? "Too quiet" : null;
        }}
      >
        <Field.Label>Volume</Field.Label>
        <Slider.Root defaultValue={9}>
          <Slider.Control>
            <Slider.Thumb />
          </Slider.Control>
        </Slider.Root>
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  submit(root);
  const input = root.querySelector("input")!;
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(document.activeElement).toBe(input);
  fire(input, new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  expect(value).toBe(10);
  expect(input.hasAttribute("aria-invalid")).toBe(false);
});
for (const [kind, Root, Trigger] of [
  ["Select", Select.Root, Select.Trigger],
  ["Combobox", Combobox.Root, Combobox.Input],
] as const) {
  test(`${kind} rejected controlled reset retains the native constraint and submitted value`, async () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="selection">
          <Root value="kept" defaultValue="default" required onValueChange={() => {}}>
            <Trigger />
          </Root>
        </Field.Root>
      </Form>,
    );
    act(() => root.querySelector("form")!.reset());
    await settle();
    expect(root.querySelector("input")!.value).toBe("kept");
    submit(root);
    expect(values).toEqual({ selection: "kept" });
  });
}

test("Combobox query text does not become a selected form value", () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="selection">
        <Combobox.Root>
          <Combobox.Input />
        </Combobox.Root>
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector<HTMLInputElement>("[role=combobox]")!;
  input.value = "unselected";
  fire(input, new Event("input", { bubbles: true }));
  submit(root);
  expect(values).toEqual({ selection: "" });
  expect(input.hasAttribute("data-dirty")).toBe(false);
});

test("Combobox onBlur validates the selected object after its popup closes", () => {
  const item = { id: 1, label: "One" };
  let validated: unknown;
  const root = render(
    <Field.Root
      validationMode="onBlur"
      validate={(value) => {
        validated = value;
        return null;
      }}
    >
      <Combobox.Root items={[item]} itemToStringLabel={(item) => item.label}>
        <Combobox.Input />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                <Combobox.Item value={item}>One</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>,
  );
  choose(root);
  expect(validated).toBe(item);
  expect(root.querySelector("[role=combobox]")!.hasAttribute("data-valid")).toBe(true);
});

test("Slider field reset restores its range and canceled changes retain registered values", async () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="range">
        <Slider.Root defaultValue={[20, 40]}>
          <Slider.Control>
            <Slider.Thumb index={0} />
            <Slider.Thumb index={1} />
          </Slider.Control>
        </Slider.Root>
      </Field.Root>
      <Field.Root name="canceled">
        <Slider.Root defaultValue={10} onValueChange={(_value, details) => details.cancel()}>
          <Slider.Control>
            <Slider.Thumb />
          </Slider.Control>
        </Slider.Root>
      </Field.Root>
    </Form>,
  );
  const inputs = root.querySelectorAll("input");
  fire(inputs[0]!, new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  fire(inputs[2]!, new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
  submit(root);
  expect(values).toEqual({ range: [21, 40], canceled: 10 });
  act(() => root.querySelector("form")!.reset());
  await settle();
  submit(root);
  expect(values).toEqual({ range: [20, 40], canceled: 10 });
  expect(root.querySelector("[role=group]")!.hasAttribute("data-dirty")).toBe(false);
});
// The shadcn InputGroup renders another Input primitive inside Combobox.Input.
// Its editable query must not replace the Combobox selection registration.
import { ComboboxInput as StyledComboboxInput } from "@registry/ui/combobox";

test("a rendered InputGroup query keeps selection registration, native values and reset state", async () => {
  let update: (value: string | null) => void = () => {};
  let values: unknown;
  function Subject() {
    const [value, setValue] = useState<string | null>(null);
    update = setValue;
    return (
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="city">
          <Combobox.Root value={value} onValueChange={setValue}>
            <StyledComboboxInput />
          </Combobox.Root>
        </Field.Root>
      </Form>
    );
  }
  const root = render(<Subject />);
  act(() => update("Madrid"));
  submit(root);
  expect(values).toEqual({ city: "Madrid" });
  expect(new FormData(root.querySelector("form")!).getAll("city")).toEqual(["Madrid"]);
  act(() => root.querySelector("form")!.reset());
  await settle();
  expect(root.querySelector("[role=combobox]")!.hasAttribute("data-dirty")).toBe(false);
  submit(root);
  expect(values).toEqual({ city: "" });
});
for (const [kind, Root, Trigger] of [
  ["Select", Select.Root, Select.Trigger],
  ["Combobox", Combobox.Root, Combobox.Input],
] as const) {
  test(`${kind} serializes default objects and skips custom formatters for null selections`, () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="object">
          <Root defaultValue={{ id: 1 }}>
            <Trigger />
          </Root>
        </Field.Root>
        <Field.Root name="valueLabel">
          <Root defaultValue={{ value: "a", label: "A" }}>
            <Trigger />
          </Root>
        </Field.Root>
        <Field.Root name="empty">
          <Root itemToStringValue={(item) => item.id.toString()}>
            <Trigger />
          </Root>
        </Field.Root>
      </Form>,
    );
    submit(root);
    expect(values).toEqual({ object: '{"id":1}', valueLabel: "a", empty: "" });
  });
  test(`${kind} custom equality handles object-valued multiple reset`, async () => {
    let update: (value: { id: number }[]) => void = () => {};
    const initial = [{ id: 1 }];
    function Subject() {
      const [value, setValue] = useState(initial);
      update = setValue;
      return (
        <Form>
          <Field.Root name="selection">
            <Root
              multiple
              value={value}
              defaultValue={initial}
              itemToStringValue={(item) => item.id.toString()}
              isItemEqualToValue={(a, b) => a.id === b.id}
              onValueChange={(next) => setValue(next as { id: number }[])}
            >
              <Trigger />
            </Root>
          </Field.Root>
        </Form>
      );
    }
    const root = render(<Subject />);
    act(() => update([{ id: 2 }]));
    act(() => root.querySelector("form")!.reset());
    await settle();
    expect(root.querySelector<HTMLInputElement>('input[aria-hidden="true"]')!.value).toBe("1");
    expect(root.querySelector("[role=combobox]")!.hasAttribute("data-dirty")).toBe(false);
  });
}