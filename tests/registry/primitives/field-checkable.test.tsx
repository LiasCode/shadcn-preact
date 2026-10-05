import { expect, test } from "bun:test";

import { Checkbox } from "@registry/ui/primitives/checkbox";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { Radio } from "@registry/ui/primitives/radio";
import { RadioGroup } from "@registry/ui/primitives/radio-group";
import { Switch } from "@registry/ui/primitives/switch";
import { useState } from "preact/hooks";

import { act, fire, render, settle } from "../../utils";

function submit(form: HTMLFormElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  fire(form, event);
  return event;
}

function click(element: HTMLElement) {
  act(() => element.click());
}

for (const [name, Control] of [
  ["checkbox", Checkbox.Root],
  ["switch", Switch.Root],
] as const) {
  test(`${name} registers boolean values, validates required and focuses its visible control`, () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="enabled">
          <Field.Label>Enable</Field.Label>
          <Field.Description>Required</Field.Description>
          <Control required />
          <Field.Error />
        </Field.Root>
      </Form>,
    );
    const control = root.querySelector<HTMLElement>(`[role=${name}]`)!;
    const input = root.querySelector("input")!;
    expect(input.name).toBe("enabled");

    expect(root.querySelector("label")!.htmlFor).toBe(input.id);

    expect(control.getAttribute("aria-labelledby")).toBe(root.querySelector("label")!.id);

    submit(root.querySelector("form")!);

    expect(values).toBeUndefined();

    expect(control.getAttribute("aria-invalid")).toBe("true");

    expect(document.activeElement).toBe(control);

    click(control);

    expect(control.getAttribute("aria-checked")).toBe("true");

    expect(control.hasAttribute("data-dirty")).toBe(true);

    expect(control.hasAttribute("data-filled")).toBe(true);

    expect(control.hasAttribute("data-valid")).toBe(true);

    submit(root.querySelector("form")!);

    expect(values).toEqual({ enabled: true });

    click(control);

    expect(control.hasAttribute("data-dirty")).toBe(false);

    expect(control.hasAttribute("data-filled")).toBe(false);
  });

  test(`${name} reports false to custom validation and excludes disabled fields`, () => {
    let validated: unknown;
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root
          name="enabled"
          validate={(value) => {
            validated = value;
            return null;
          }}
        >
          <Control uncheckedValue="off" />
        </Field.Root>
        <Field.Root name="disabled" disabled>
          <Control defaultChecked />
        </Field.Root>
      </Form>,
    );
    submit(root.querySelector("form")!);

    expect(validated).toBe(false);

    expect(values).toEqual({ enabled: false });

    expect(new FormData(root.querySelector("form")!).get("enabled")).toBe("off");

    expect(root.querySelectorAll("input[type=checkbox]")[1]!.hasAttribute("disabled")).toBe(true);
  });

  test(`${name} canceled, read-only and rejected controlled changes preserve the field value`, () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="canceled">
          <Control onCheckedChange={(_value, details) => details.cancel()} />
        </Field.Root>
        <Field.Root name="controlled">
          <Control checked={false} onCheckedChange={() => {}} />
        </Field.Root>
        <Field.Root name="readOnly">
          <Control readOnly />
        </Field.Root>
      </Form>,
    );

    for (const control of root.querySelectorAll<HTMLElement>(`[role=${name}]`)) {
      click(control);

      expect(control.getAttribute("aria-checked")).toBe("false");

      expect(control.hasAttribute("data-dirty")).toBe(false);
    }

    submit(root.querySelector("form")!);

    expect(values).toEqual({ canceled: false, controlled: false, readOnly: false });
  });

  test(`${name} reset restores default state and a canceled reset preserves changes`, async () => {
    let values: unknown;
    const root = render(
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="enabled">
          <Control defaultChecked />
        </Field.Root>
      </Form>,
    );
    const form = root.querySelector("form")!;
    const control = root.querySelector<HTMLElement>(`[role=${name}]`)!;
    click(control);

    act(() => form.reset());

    await settle();

    expect(control.getAttribute("aria-checked")).toBe("true");

    expect(control.hasAttribute("data-dirty")).toBe(false);

    expect(control.hasAttribute("data-filled")).toBe(true);

    submit(form);

    expect(values).toEqual({ enabled: true });

    click(control);

    form.addEventListener("reset", (event) => event.preventDefault(), { once: true });

    fire(form, new Event("reset", { bubbles: true, cancelable: true }));

    await settle();

    expect(control.getAttribute("aria-checked")).toBe("false");

    expect(control.hasAttribute("data-dirty")).toBe(true);
  });
}

test("controlled checkable updates clear server errors and onBlur validation follows the visible control", () => {
  let update: (value: boolean) => void = () => {};

  const serverErrors = { terms: "Rejected" };

  function Subject() {
    const [checked, setChecked] = useState(false);
    update = setChecked;
    return (
      <Form errors={serverErrors}>
        <Field.Root name="terms" validationMode="onBlur">
          <Checkbox.Root checked={checked} required />
          <Field.Error />
        </Field.Root>
      </Form>
    );
  }

  const root = render(<Subject />);
  const control = root.querySelector<HTMLElement>("[role=checkbox]")!;
  expect(control.getAttribute("aria-invalid")).toBe("true");

  act(() => update(true));

  expect(control.hasAttribute("aria-invalid")).toBe(false);

  fire(control, new FocusEvent("focusout", { bubbles: true }));

  expect(control.hasAttribute("data-touched")).toBe(true);

  expect(control.hasAttribute("data-valid")).toBe(true);
});

test("RadioGroup registers its selected value and native required validation focuses a visible radio", () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="plan">
        <Field.Label>Plan</Field.Label>
        <Field.Description>Choose one</Field.Description>
        <RadioGroup required>
          <Radio.Root value="a" />
          <Radio.Root value="b" />
        </RadioGroup>
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  const form = root.querySelector("form")!;
  const group = root.querySelector<HTMLElement>("[role=radiogroup]")!;
  const radios = root.querySelectorAll<HTMLElement>("[role=radio]");
  submit(form);

  expect(group.getAttribute("aria-invalid")).toBe("true");

  expect(document.activeElement).toBe(radios[0]!);

  click(radios[1]!);

  expect(group.hasAttribute("data-valid")).toBe(true);

  expect(radios[1]!.hasAttribute("data-filled")).toBe(true);

  submit(form);

  expect(values).toEqual({ plan: "b" });

  expect(new FormData(form).get("plan")).toBe("b");
});

test("RadioGroup keeps object values intact and excludes a disabled selection from form values", () => {
  const selected = { id: 1 };
  let values: unknown;
  let validated: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root
        name="plan"
        validate={(value) => {
          validated = value;
          return null;
        }}
      >
        <RadioGroup defaultValue={selected}>
          <Radio.Root value={selected} />
          <Radio.Root value={{ id: 2 }} />
        </RadioGroup>
      </Field.Root>
      <Field.Root name="disabledSelection">
        <RadioGroup defaultValue="disabled">
          <Radio.Root value="disabled" disabled />
          <Radio.Root value="enabled" />
        </RadioGroup>
      </Field.Root>
    </Form>,
  );
  submit(root.querySelector("form")!);

  expect(validated).toBe(selected);

  expect(values).toEqual({ plan: selected, disabledSelection: null });
});

test("RadioGroup changes canceled by the owner leave form and field state unchanged", () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="plan">
        <RadioGroup defaultValue="a" onValueChange={(_value, details) => details.cancel()}>
          <Radio.Root value="a" />
          <Radio.Root value="b" />
        </RadioGroup>
      </Field.Root>
    </Form>,
  );
  click(root.querySelectorAll<HTMLElement>("[role=radio]")[1]!);

  submit(root.querySelector("form")!);

  expect(values).toEqual({ plan: "a" });

  expect(root.querySelector("[role=radiogroup]")!.hasAttribute("data-dirty")).toBe(false);
});

test("RadioGroup reset clears dirty state, restores selection and preserves initial value", async () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="plan">
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" />
          <Radio.Root value="b" />
        </RadioGroup>
        <Field.Validity>
          {(data) => <span data-initial-value>{String(data.initialValue)}</span>}
        </Field.Validity>
      </Field.Root>
    </Form>,
  );
  click(root.querySelectorAll<HTMLElement>("[role=radio]")[1]!);

  act(() => root.querySelector("form")!.reset());

  await settle();

  expect(root.querySelector("[role=radiogroup]")!.hasAttribute("data-dirty")).toBe(false);

  expect(root.querySelector("[data-initial-value]")!.textContent).toBe("a");

  submit(root.querySelector("form")!);

  expect(values).toEqual({ plan: "a" });
});

test("RadioGroup registers options added later and unregisters when all options disappear", () => {
  let update: (visible: boolean) => void = () => {};

  let values: unknown;

  function Subject() {
    const [visible, setVisible] = useState(false);
    update = setVisible;
    return (
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        <Field.Root name="plan">
          <RadioGroup>{visible && <Radio.Root value="a" />}</RadioGroup>
        </Field.Root>
      </Form>
    );
  }

  const root = render(<Subject />);
  submit(root.querySelector("form")!);

  expect(values).toEqual({});

  act(() => update(true));

  click(root.querySelector<HTMLElement>("[role=radio]")!);

  submit(root.querySelector("form")!);

  expect(values).toEqual({ plan: "a" });

  act(() => update(false));

  submit(root.querySelector("form")!);

  expect(values).toEqual({});
});

test("RadioGroup blur within its options preserves focus and does not run onBlur validation", () => {
  let calls = 0;
  const root = render(
    <Field.Root
      validationMode="onBlur"
      validate={() => {
        calls++;
        return null;
      }}
    >
      <RadioGroup>
        <Radio.Root value="a" />
        <Radio.Root value="b" />
      </RadioGroup>
    </Field.Root>,
  );
  const radios = root.querySelectorAll<HTMLElement>("[role=radio]");
  fire(radios[0]!, new FocusEvent("focusin", { bubbles: true }));

  fire(radios[0]!, new FocusEvent("focusout", { bubbles: true, relatedTarget: radios[1]! }));

  expect(calls).toBe(0);

  expect(root.querySelector("[role=radiogroup]")!.hasAttribute("data-focused")).toBe(true);

  fire(radios[1]!, new FocusEvent("focusout", { bubbles: true }));

  expect(calls).toBe(1);

  expect(root.querySelector("[role=radiogroup]")!.hasAttribute("data-touched")).toBe(true);
});

test("radio values canceled on reset and controlled checkable values survive native reset", async () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="plan">
        <RadioGroup defaultValue="a">
          <Radio.Root value="a" />
          <Radio.Root value="b" />
        </RadioGroup>
      </Field.Root>
      <Field.Root name="checked">
        <Checkbox.Root checked={true} defaultChecked={false} />
      </Field.Root>
    </Form>,
  );
  const form = root.querySelector("form")!;
  click(root.querySelectorAll<HTMLElement>("[role=radio]")[1]!);

  form.addEventListener("reset", (event) => event.preventDefault(), { once: true });

  fire(form, new Event("reset", { bubbles: true, cancelable: true }));

  await settle();

  submit(form);

  expect(values).toEqual({ plan: "b", checked: true });

  act(() => form.reset());

  await settle();

  submit(form);

  expect(values).toEqual({ plan: "a", checked: true });
});

test("async checkable validation receives booleans and discards an older checked result", async () => {
  const resolvers = new Map<boolean, (error: string | null) => void>();
  const root = render(
    <Field.Root
      validationMode="onChange"
      validate={(value) =>
        new Promise((resolve) => {
          resolvers.set(value as boolean, resolve);
        })
      }
    >
      <Checkbox.Root />
      <Field.Error />
    </Field.Root>,
  );
  const control = root.querySelector<HTMLElement>("[role=checkbox]")!;
  click(control);

  click(control);

  expect([...resolvers.keys()]).toEqual([true, false]);

  await act(async () => {
    resolvers.get(false)!(null);
  });

  await act(async () => {
    resolvers.get(true)!("Stale");
  });

  expect(control.hasAttribute("data-valid")).toBe(true);

  expect(root.textContent).not.toContain("Stale");
});

test("explicit checkable ids retain native label associations inside Field", () => {
  const root = render(
    <Field.Root name="terms">
      <label htmlFor="custom-terms">External terms</label>
      <Checkbox.Root id="custom-terms" />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  expect(input.id).toBe("custom-terms");

  expect(root.querySelectorAll("#custom-terms").length).toBe(1);

  click(root.querySelector("label")!);

  expect(input.checked).toBe(true);
});
