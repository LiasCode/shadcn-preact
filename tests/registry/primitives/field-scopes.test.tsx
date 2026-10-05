import { expect, test } from "bun:test";

import { Checkbox } from "@registry/ui/primitives/checkbox";
import { Combobox } from "@registry/ui/primitives/combobox";
import { Field } from "@registry/ui/primitives/field";
import { Fieldset } from "@registry/ui/primitives/fieldset";
import { Form } from "@registry/ui/primitives/form";
import { Radio } from "@registry/ui/primitives/radio";
import { RadioGroup } from "@registry/ui/primitives/radio-group";
import { Select } from "@registry/ui/primitives/select";
import { Slider } from "@registry/ui/primitives/slider";
import { Switch } from "@registry/ui/primitives/switch";
import { useState } from "preact/hooks";

import { act, fire, render } from "../../utils";

test("Field.Item associates each radio with its own label and description", () => {
  const root = render(
    <Field.Root name="plan">
      <Field.Label>Plan</Field.Label>
      <Field.Description>Choose one</Field.Description>
      <RadioGroup>
        <Field.Item>
          <Radio.Root value="a" />
          <Field.Label>Basic</Field.Label>
          <Field.Description>Basic description</Field.Description>
        </Field.Item>
        <Field.Item>
          <Radio.Root value="b" />
          <Field.Label>Pro</Field.Label>
          <Field.Description>Pro description</Field.Description>
        </Field.Item>
      </RadioGroup>
    </Field.Root>,
  );
  const labels = root.querySelectorAll("label"),
    descriptions = root.querySelectorAll("p"),
    radios = root.querySelectorAll<HTMLElement>("[role=radio]"),
    inputs = root.querySelectorAll("input");
  expect(labels[1]!.htmlFor).toBe(inputs[0]!.id);

  expect(labels[2]!.htmlFor).toBe(inputs[1]!.id);

  expect(radios[0]!.getAttribute("aria-labelledby")).toBe(labels[1]!.id);

  expect(radios[1]!.getAttribute("aria-labelledby")).toBe(labels[2]!.id);

  expect(radios[0]!.getAttribute("aria-describedby")).toBe(descriptions[1]!.id);

  expect(radios[1]!.getAttribute("aria-describedby")).toBe(descriptions[2]!.id);

  expect(root.querySelector("[role=radiogroup]")!.getAttribute("aria-labelledby")).toBe(
    labels[0]!.id,
  );

  act(() => labels[2]!.click());

  expect(inputs[1]!.checked).toBe(true);

  expect(inputs[0]!.checked).toBe(false);
});

test("disabled Field.Item excludes a radio from keyboard and native form selection", () => {
  const root = render(
    <Form>
      <Field.Root name="plan">
        <RadioGroup>
          <Field.Item disabled>
            <Radio.Root value="disabled" />
            <Field.Label>Disabled</Field.Label>
          </Field.Item>
          <Field.Item>
            <Radio.Root value="enabled" />
            <Field.Label>Enabled</Field.Label>
          </Field.Item>
        </RadioGroup>
      </Field.Root>
    </Form>,
  );
  const inputs = root.querySelectorAll("input");
  expect(inputs[0]!.disabled).toBe(true);

  act(() => root.querySelectorAll("label")[0]!.click());

  expect(inputs[0]!.checked).toBe(false);

  act(() => root.querySelectorAll("label")[1]!.click());

  expect(new FormData(root.querySelector("form")!).get("plan")).toBe("enabled");
});

test("item label scopes are removed cleanly and do not leak into a nested Field.Root", () => {
  let hide: () => void = () => {};

  function Subject() {
    const [visible, setVisible] = useState(true);
    hide = () => setVisible(false);
    return (
      <Field.Root>
        <RadioGroup>
          {visible && (
            <Field.Item>
              <Radio.Root value="a" />
              <Field.Label>Removed</Field.Label>
            </Field.Item>
          )}
          <Field.Item>
            <Radio.Root value="b" />
            <Field.Label>Kept</Field.Label>
            <Field.Root>
              <Field.Control />
              <Field.Label>Nested</Field.Label>
            </Field.Root>
          </Field.Item>
        </RadioGroup>
      </Field.Root>
    );
  }

  const root = render(<Subject />);
  act(hide);
  const radio = root.querySelector("[role=radio]")!,
    labels = root.querySelectorAll("label");
  expect(radio.getAttribute("aria-labelledby")).toBe(labels[0]!.id);

  expect(labels[1]!.htmlFor).toBe(root.querySelector("input:not([type=radio])")!.id);
});

test("Fieldset inherits disabled state through nesting and excludes field values", () => {
  let enable: () => void = () => {};

  let values: unknown;

  function Subject() {
    const [disabled, setDisabled] = useState(true);
    enable = () => setDisabled(false);
    return (
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Fieldset.Root disabled={disabled}>
          <Fieldset.Legend>Settings</Fieldset.Legend>
          <Fieldset.Root disabled={false}>
            <Field.Root name="name">
              <Field.Control defaultValue="initial" />
            </Field.Root>
            <Field.Root name="terms">
              <Checkbox.Root />
            </Field.Root>
            <Field.Root name="updates">
              <Switch.Root />
            </Field.Root>
            <Field.Root name="plan">
              <RadioGroup>
                <Radio.Root value="a" />
              </RadioGroup>
            </Field.Root>
            <Field.Root name="choice">
              <Select.Root>
                <Select.Trigger />
              </Select.Root>
            </Field.Root>
            <Field.Root name="city">
              <Combobox.Root>
                <Combobox.Input />
              </Combobox.Root>
            </Field.Root>
            <Field.Root name="volume">
              <Slider.Root defaultValue={10}>
                <Slider.Control>
                  <Slider.Thumb />
                </Slider.Control>
              </Slider.Root>
            </Field.Root>
          </Fieldset.Root>
        </Fieldset.Root>
      </Form>
    );
  }

  const root = render(<Subject />);
  const form = root.querySelector("form")!;

  for (const input of root.querySelectorAll("input")) {
    expect(input.disabled).toBe(true);
  }

  for (const control of root.querySelectorAll<HTMLElement>(
    "[role=checkbox],[role=switch],[role=radio],[role=combobox]",
  )) {
    expect(control.hasAttribute("data-disabled")).toBe(true);
  }

  fire(form, new Event("submit", { bubbles: true, cancelable: true }));

  expect(values).toEqual({});

  act(enable);

  fire(form, new Event("submit", { bubbles: true, cancelable: true }));

  expect(values).toEqual({
    name: "initial",
    terms: false,
    updates: false,
    plan: null,
    choice: "",
    city: "",
    volume: 10,
  });
});

test("Fieldset legend labels a group and explicit group labels take precedence", () => {
  const root = render(
    <Fieldset.Root>
      <Fieldset.Legend>Preferences</Fieldset.Legend>
      <RadioGroup>
        <Radio.Root value="a" />
      </RadioGroup>
      <RadioGroup aria-labelledby="external">
        <Radio.Root value="b" />
      </RadioGroup>
    </Fieldset.Root>,
  );
  const legend = root.querySelector("fieldset")!.firstElementChild!;
  expect(legend.tagName).toBe("DIV");

  expect(root.querySelector("fieldset")!.getAttribute("aria-labelledby")).toBe(legend.id);

  expect(root.querySelectorAll("[role=radiogroup]")[0]!.getAttribute("aria-labelledby")).toBe(
    legend.id,
  );

  expect(root.querySelectorAll("[role=radiogroup]")[1]!.getAttribute("aria-labelledby")).toBe(
    "external",
  );
});

test("Fieldset disables standalone controls and preserves explicit disabled children when enabled", () => {
  const root = render(
    <Fieldset.Root disabled render={<div />}>
      <Field.Control />
      <Checkbox.Root />
      <Switch.Root />
      <Select.Root>
        <Select.Trigger />
      </Select.Root>
      <Combobox.Root>
        <Combobox.Input />
      </Combobox.Root>
      <Slider.Root>
        <Slider.Control>
          <Slider.Thumb />
        </Slider.Control>
      </Slider.Root>
    </Fieldset.Root>,
  );

  for (const input of root.querySelectorAll("input")) {
    expect(input.disabled).toBe(true);
  }

  expect(root.firstElementChild!.tagName).toBe("DIV");
});

test("Field.Item associates checkable labels without overwriting the outer Field label", () => {
  const root = render(
    <Field.Root>
      <Field.Label>Outer label</Field.Label>
      <Field.Item>
        <Checkbox.Root />
        <Field.Label>Terms</Field.Label>
        <Field.Description>Read the terms</Field.Description>
      </Field.Item>
    </Field.Root>,
  );
  const labels = root.querySelectorAll("label"),
    input = root.querySelector("input")!,
    control = root.querySelector<HTMLElement>("[role=checkbox]")!;
  expect(labels[1]!.htmlFor).toBe(input.id);

  expect(control.getAttribute("aria-labelledby")).toBe(labels[1]!.id);

  expect(control.getAttribute("aria-describedby")).toBe(root.querySelector("p")!.id);

  act(() => labels[1]!.click());

  expect(control.getAttribute("aria-checked")).toBe("true");
});

test("removing a Fieldset legend clears its association and an explicitly disabled child stays disabled", () => {
  let hide: () => void = () => {};

  function Subject() {
    const [shown, setShown] = useState(true);
    hide = () => setShown(false);
    return (
      <Fieldset.Root>
        {shown && <Fieldset.Legend>Removed legend</Fieldset.Legend>}
        <Field.Control disabled />
        <Field.Control />
      </Fieldset.Root>
    );
  }

  const root = render(<Subject />);
  act(hide);

  expect(root.querySelector("fieldset")!.hasAttribute("aria-labelledby")).toBe(false);

  expect(root.querySelectorAll("input")[0]!.disabled).toBe(true);

  expect(root.querySelectorAll("input")[1]!.disabled).toBe(false);
});
