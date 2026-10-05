import { expect, test } from "bun:test";

import { Checkbox } from "@registry/ui/primitives/checkbox";
import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { Input } from "@registry/ui/primitives/input";
import { createRef } from "preact";
import { useState } from "preact/hooks";

import { act, fire, render, settle } from "../../utils";

function change(input: HTMLInputElement, value: string) {
  input.value = value;
  fire(input, new Event("input", { bubbles: true }));
}

function blur(input: HTMLInputElement) {
  fire(input, new FocusEvent("focusout", { bubbles: true }));
}

function submit(form: HTMLFormElement) {
  fire(form, new Event("submit", { bubbles: true, cancelable: true }));
}

test("untouched required fields defer missing-value errors on blur, but submission validates them", () => {
  const root = render(
    <Form validationMode="onBlur">
      <Field.Root>
        <Input required />
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  blur(input);

  expect(input.hasAttribute("data-valid")).toBe(true);

  expect(input.hasAttribute("aria-invalid")).toBe(false);

  submit(root.querySelector("form")!);

  expect(input.getAttribute("aria-invalid")).toBe("true");

  expect(document.activeElement).toBe(input);
});

test("returning to the initial empty value retains interaction history for required validation", () => {
  const root = render(
    <Field.Root validationMode="onBlur">
      <Input required />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "edited");

  change(input, "");

  expect(input.hasAttribute("data-dirty")).toBe(false);

  blur(input);

  expect(input.hasAttribute("data-invalid")).toBe(true);
});

for (const validationMode of ["onBlur", "onSubmit"] as const) {
  test(`${validationMode} clears a previous error while editing and defers new native errors`, () => {
    const actions = createRef<Field.Root.Actions>();
    const root = render(
      <Field.Root validationMode={validationMode} actionsRef={actions}>
        <Input required type="email" />
        <Field.Error />
      </Field.Root>,
    );
    const input = root.querySelector("input")!;
    act(() => actions.current!.validate());

    expect(input.hasAttribute("data-invalid")).toBe(true);

    change(input, "partial");

    expect(input.validity.typeMismatch).toBe(true);

    expect(input.hasAttribute("data-valid")).toBe(true);

    act(() => actions.current!.validate());

    expect(input.hasAttribute("data-invalid")).toBe(true);
  });
}

test("editing clears custom errors onBlur without calling the validator until the next blur", () => {
  const calls: unknown[] = [];
  const root = render(
    <Field.Root
      validationMode="onBlur"
      validate={(value) => {
        calls.push(value);
        return value === "taken" ? "Taken" : null;
      }}
    >
      <Input />
      <Field.Error />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "taken");

  blur(input);

  expect(input.validationMessage).toBe("Taken");

  change(input, "available");

  expect(input.validationMessage).toBe("");

  expect(input.hasAttribute("data-valid")).toBe(true);

  expect(calls).toEqual(["taken"]);

  blur(input);

  expect(calls).toEqual(["taken", "available"]);
});

test("onChange runs custom validation even with native errors and exposes native error arrays", () => {
  let received: unknown;
  let errors: string[] = [];
  const root = render(
    <Field.Root
      validationMode="onChange"
      validate={(value) => {
        received = value;
        return null;
      }}
    >
      <Input type="email" required />
      <Field.Validity>
        {(data) => {
          errors = data.errors;
          return null;
        }}
      </Field.Validity>
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "partial");

  expect(received).toBe("partial");

  expect(input.hasAttribute("data-invalid")).toBe(true);

  expect(errors).toEqual([input.validationMessage]);

  change(input, "valid@example.com");

  expect(input.hasAttribute("data-valid")).toBe(true);

  expect(errors).toEqual([]);
});

test("native constraints take priority over custom validation outside onChange", () => {
  let calls = 0;
  let errors: string[] = [];
  const root = render(
    <Field.Root
      validationMode="onBlur"
      validate={() => {
        calls++;
        return "Custom";
      }}
    >
      <Input type="email" defaultValue="partial" />
      <Field.Validity>
        {(data) => {
          errors = data.errors;
          return null;
        }}
      </Field.Validity>
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  blur(input);

  expect(calls).toBe(0);

  expect(errors).toEqual([input.validationMessage]);
});

test("thenable validation discards stale results and accepts the current result", async () => {
  const pending = new Map<string, (error: string | null) => void>();
  const root = render(
    <Field.Root
      validationMode="onChange"
      validate={(value) =>
        ({
          // oxlint-disable-next-line unicorn/no-thenable -- exercise Promise-like validator results
          then(resolve: (error: string | null) => void) {
            pending.set(String(value), resolve);
          },
        }) as Promise<string | null>
      }
    >
      <Input />
      <Field.Error />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "old");

  await settle();

  change(input, "new");

  await settle();

  await act(async () => pending.get("old")!("Stale"));

  expect(input.hasAttribute("data-invalid")).toBe(false);

  await act(async () => pending.get("new")!("Current"));

  expect(input.hasAttribute("data-invalid")).toBe(true);

  expect(input.validationMessage).toBe("Current");
});

test("a submit flushes pending debounce and cancels its scheduled repeat", async () => {
  const calls: unknown[] = [];
  const root = render(
    <Form>
      <Field.Root
        validationMode="onChange"
        validationDebounceTime={40}
        validate={(value) => {
          calls.push(value);
          return null;
        }}
      >
        <Input />
      </Field.Root>
    </Form>,
  );
  change(root.querySelector("input")!, "new");

  expect(calls).toEqual([]);

  submit(root.querySelector("form")!);

  expect(calls).toEqual(["new"]);

  await settle(60);

  expect(calls).toEqual(["new"]);
});

test("boolean false values honor debounce rather than treating unfilled as empty text", async () => {
  const calls: unknown[] = [];
  const root = render(
    <Field.Root
      validationMode="onChange"
      validationDebounceTime={20}
      validate={(value) => {
        calls.push(value);
        return null;
      }}
    >
      <Checkbox.Root defaultChecked>
        <Checkbox.Indicator />
      </Checkbox.Root>
    </Field.Root>,
  );
  act(() => root.querySelector<HTMLElement>("[role=checkbox]")!.click());

  expect(calls).toEqual([]);

  await settle(35);

  expect(calls).toEqual([false]);
});

test("disabled fields expose neither valid nor invalid state, and ignore late validation", async () => {
  let disable = () => {};

  let resolve: (value: string | null) => void = () => {};

  function Subject() {
    const [disabled, setDisabled] = useState(false);
    disable = () => setDisabled(true);
    return (
      <Field.Root
        disabled={disabled}
        validationMode="onChange"
        validate={() =>
          new Promise((done) => {
            resolve = done;
          })
        }
      >
        <Input />
      </Field.Root>
    );
  }

  const root = render(<Subject />);
  const input = root.querySelector("input")!;
  change(input, "pending");

  act(disable);

  await act(async () => resolve("Late"));

  expect(input.hasAttribute("data-invalid")).toBe(false);

  expect(input.hasAttribute("data-valid")).toBe(false);

  expect(input.validationMessage).toBe("");
});

test("controlled dirty=false suppresses required-on-blur noise but imperative validation still runs", () => {
  const actions = createRef<Field.Root.Actions>();
  const root = render(
    <Field.Root dirty={false} validationMode="onBlur" actionsRef={actions}>
      <Input required />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "edited");

  change(input, "");

  blur(input);

  expect(input.hasAttribute("data-invalid")).toBe(false);

  act(() => actions.current!.validate());

  expect(input.hasAttribute("data-invalid")).toBe(true);

  expect(input.hasAttribute("data-dirty")).toBe(false);
});

test("reset reads the latest controlled dirty flag when deciding whether to validate required on blur", async () => {
  let markDirty = () => {};

  function Subject() {
    const [dirty, setDirty] = useState(false);
    markDirty = () => setDirty(true);
    return (
      <Form>
        <Field.Root dirty={dirty} validationMode="onBlur">
          <Input required />
        </Field.Root>
      </Form>
    );
  }

  const root = render(<Subject />);
  act(markDirty);

  act(() => root.querySelector("form")!.reset());

  await settle();
  const input = root.querySelector("input")!;
  blur(input);

  expect(input.hasAttribute("data-dirty")).toBe(true);

  expect(input.hasAttribute("data-invalid")).toBe(true);
});
