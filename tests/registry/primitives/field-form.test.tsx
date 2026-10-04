import { expect, test } from "bun:test";

import { Field } from "@registry/ui/primitives/field";
import { Form } from "@registry/ui/primitives/form";
import { Input } from "@registry/ui/primitives/input";
import { createRef } from "preact";
import { useState } from "preact/hooks";

import { act, cleanup, fire, render, settle } from "../../utils";

function change(input: HTMLInputElement, value: string) {
  input.value = value;
  fire(input, new Event("input", { bubbles: true }));
}
function submit(form: HTMLFormElement) {
  const event = new Event("submit", { bubbles: true, cancelable: true });
  fire(form, event);
  return event;
}

test("Field associates labels, descriptions and invalid messages with the registered input", () => {
  const root = render(
    <Form>
      <Field.Root name="email">
        <Field.Label>Email</Field.Label>
        <Field.Description>Use your work email</Field.Description>
        <Input required type="email" />
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  const label = root.querySelector("label")!;
  expect(label.htmlFor).toBe(input.id);
  expect(input.getAttribute("aria-labelledby")).toBe(label.id);
  expect(input.getAttribute("aria-describedby")).toBe(root.querySelector("p")!.id);
  expect(input.name).toBe("email");
  expect(input.hasAttribute("data-invalid")).toBe(false);
  submit(root.querySelector("form")!);
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.hasAttribute("data-invalid")).toBe(true);
  expect(document.activeElement).toBe(input);
  expect(input.getAttribute("aria-describedby")!.split(" ").length).toBe(2);
});

test("Form rejects invalid native values then sends named values and revalidates after submission", () => {
  const values: unknown[] = [];
  const root = render(
    <Form onFormSubmit={(value) => values.push(value)}>
      <Field.Root name="email">
        <Input required type="email" />
      </Field.Root>
      <Field.Root name="ignored" disabled>
        <Input defaultValue="hidden" />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  expect(submit(root.querySelector("form")!).defaultPrevented).toBe(true);
  expect(values).toEqual([]);
  change(input, "valid@example.com");
  expect(input.hasAttribute("data-valid")).toBe(true);
  expect(input.hasAttribute("data-dirty")).toBe(true);
  submit(root.querySelector("form")!);
  expect(values).toEqual([{ email: "valid@example.com" }]);
});

test("onBlur validates only after focus leaves and Field mode overrides Form", () => {
  const root = render(
    <Form validationMode="onChange">
      <Field.Root validationMode="onBlur">
        <Input required />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  change(input, "edited");
  change(input, "");
  expect(input.hasAttribute("data-invalid")).toBe(false);
  fire(input, new FocusEvent("focusin", { bubbles: true }));
  fire(input, new FocusEvent("focusout", { bubbles: true }));
  expect(input.hasAttribute("data-touched")).toBe(true);
  expect(input.hasAttribute("data-invalid")).toBe(true);
});

test("server errors clear only for the edited field", () => {
  const root = render(
    <Form errors={{ first: "Taken", second: ["Missing", "Invalid"] }}>
      <Field.Root name="first">
        <Input />
        <Field.Error />
      </Field.Root>
      <Field.Root name="second">
        <Input />
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  expect(root.textContent).toContain("Taken");
  expect(root.querySelectorAll("li").length).toBe(2);
  const inputs = root.querySelectorAll("input");
  change(inputs[0]!, "new");
  expect(inputs[0]!.hasAttribute("aria-invalid")).toBe(false);
  expect(inputs[1]!.getAttribute("aria-invalid")).toBe("true");
});

test("Field and Form actions validate selected fields and custom validators see other values", () => {
  const actions = createRef<Form.Actions>();
  const fieldActions = createRef<Field.Root.Actions>();
  let received: unknown;
  const root = render(
    <Form actionsRef={actions}>
      <Field.Root name="first">
        <Input defaultValue="source" />
      </Field.Root>
      <Field.Root
        name="second"
        actionsRef={fieldActions}
        validate={(_value, values) => {
          received = values;
          return "Mismatch";
        }}
      >
        <Input defaultValue="target" />
        <Field.Error />
      </Field.Root>
    </Form>,
  );
  act(() => actions.current!.validate("first"));
  expect(received).toBeUndefined();
  act(() => fieldActions.current!.validate());
  expect(received).toEqual({ first: "source", second: "target" });
  expect(root.textContent).toContain("Mismatch");
});

test("async validation discards stale responses and honors debounce", async () => {
  const resolvers = new Map<string, (value: string | null) => void>();
  const root = render(
    <Field.Root
      validationMode="onChange"
      validationDebounceTime={10}
      validate={(value) =>
        new Promise((resolve) => {
          resolvers.set(String(value), resolve);
        })
      }
    >
      <Input />
      <Field.Error />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  change(input, "old");
  expect(resolvers.size).toBe(0);
  await settle(20);
  change(input, "new");
  await settle(20);
  await act(async () => {
    resolvers.get("new")!(null);
  });
  await act(async () => {
    resolvers.get("old")!("Stale");
  });
  expect(input.hasAttribute("data-valid")).toBe(true);
  expect(root.textContent).not.toContain("Stale");
});

test("canceling input changes preserves field value and prevented native handlers do not update it", () => {
  const root = render(
    <Form onFormSubmit={(values) => expect(values).toEqual({ name: "initial" })}>
      <Field.Root name="name">
        <Input defaultValue="initial" onValueChange={(_value, details) => details.cancel()} />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  change(input, "cancel");
  expect(input.value).toBe("initial");
  expect(input.hasAttribute("data-dirty")).toBe(false);
  submit(root.querySelector("form")!);
});

test("unmounted controls unregister and pending validation does not update removed fields", async () => {
  let hide: () => void = () => {};
  let resolve: (value: string | null) => void = () => {};
  let values: unknown;
  function Subject() {
    const [visible, setVisible] = useState(true);
    hide = () => setVisible(false);
    return (
      <Form
        onFormSubmit={(next) => {
          values = next;
        }}
      >
        {visible && (
          <Field.Root
            name="old"
            validationMode="onChange"
            validate={() =>
              new Promise((done) => {
                resolve = done;
              })
            }
          >
            <Input />
          </Field.Root>
        )}
        <Field.Root name="current">
          <Input defaultValue="yes" />
        </Field.Root>
      </Form>
    );
  }
  const root = render(<Subject />);
  change(root.querySelector("input")!, "pending");
  act(hide);
  await act(async () => resolve("Late"));
  submit(root.querySelector("form")!);
  expect(values).toEqual({ current: "yes" });
});

test("controlled state flags override observed values and root disabled wins", () => {
  const root = render(
    <Field.Root disabled dirty={false} touched={true}>
      <Input disabled={false} />
      <Field.Error match="valueMissing" />
    </Field.Root>,
  );
  const input = root.querySelector("input")!;
  expect(input.disabled).toBe(true);
  expect(input.hasAttribute("data-touched")).toBe(true);
  expect(input.hasAttribute("data-dirty")).toBe(false);
});

test("uncontrolled form reset restores value, validity and state", async () => {
  const root = render(
    <Form>
      <Field.Root name="field">
        <Input defaultValue="initial" required />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  change(input, "");
  submit(root.querySelector("form")!);
  act(() => root.querySelector("form")!.reset());
  await settle();
  expect(input.value).toBe("initial");
  expect(input.hasAttribute("data-dirty")).toBe(false);
  expect(input.hasAttribute("data-invalid")).toBe(false);
  cleanup();
});
test("a controlled input rejected by its owner keeps submitted values and dirty state consistent", () => {
  let values: unknown;
  const root = render(
    <Form
      onFormSubmit={(next) => {
        values = next;
      }}
    >
      <Field.Root name="fixed">
        <Input value="fixed" onValueChange={() => {}} />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  change(input, "rejected");
  expect(input.value).toBe("fixed");
  expect(input.hasAttribute("data-dirty")).toBe(false);
  submit(root.querySelector("form")!);
  expect(values).toEqual({ fixed: "fixed" });
});

test("canceling native reset preserves validity and dirty state", async () => {
  const root = render(
    <Form onReset={(event) => event.preventDefault()}>
      <Field.Root name="email">
        <Input defaultValue="initial" required />
      </Field.Root>
    </Form>,
  );
  const input = root.querySelector("input")!;
  change(input, "");
  submit(root.querySelector("form")!);
  const reset = new Event("reset", { bubbles: true, cancelable: true });
  fire(root.querySelector("form")!, reset);
  expect(reset.defaultPrevented).toBe(true);
  await settle();
  expect(input.value).toBe("");
  expect(input.hasAttribute("data-dirty")).toBe(true);
  expect(input.hasAttribute("data-invalid")).toBe(true);
});

test("a later server error focuses the corresponding registered control", () => {
  let setErrors: (errors: Record<string, string>) => void = () => {};
  function Subject() {
    const [errors, update] = useState<Record<string, string>>({});
    setErrors = update;
    return (
      <Form errors={errors} onFormSubmit={() => {}}>
        <Field.Root name="first">
          <Input />
        </Field.Root>
        <Field.Root name="second">
          <Input />
          <Field.Error />
        </Field.Root>
      </Form>
    );
  }
  const root = render(<Subject />);
  submit(root.querySelector("form")!);
  act(() => setErrors({ second: "Already registered" }));
  expect(document.activeElement).toBe(root.querySelectorAll("input")[1]!);
  expect(root.textContent).toContain("Already registered");
});
test("registering an initial controlled value does not run onChange validation", () => {
  let calls = 0;
  render(
    <Field.Root
      validationMode="onChange"
      validate={() => {
        calls++;
        return null;
      }}
    >
      <Input value="initial" />
    </Field.Root>,
  );
  expect(calls).toBe(0);
});