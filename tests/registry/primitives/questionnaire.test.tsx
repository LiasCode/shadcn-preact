import { expect, test } from "bun:test";

import renderToString from "preact-render-to-string";
import { useState } from "preact/hooks";

import {
  Questionnaire,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "../../../registry/ui/questionnaire";
import { act, fire, render, settle } from "../../utils";

const items = [
  { name: "first", required: true, choices: [{ value: "a" }, { value: "b" }] },
  { name: "second" },
] as const;

function get<T extends HTMLElement = HTMLElement>(selector: string) {
  return document.querySelector<T>(selector)!;
}

function select(value: string) {
  const input = get<HTMLInputElement>(`input[value=${value}]`);
  input.checked = true;
  fire(input, new Event("change", { bubbles: true, cancelable: true }));
}

function Flow(props: any) {
  return (
    <Questionnaire items={items} shortcuts="letters" {...props}>
      <QuestionnaireProgress id="progress" />
      <QuestionnaireItem name="first" required>
        <QuestionnaireTitle>First question</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="a">Alpha</QuestionnaireChoice>
          <QuestionnaireChoice value="b">Beta</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireInput aria-label="Other answer" />
        <QuestionnaireError>Answer required</QuestionnaireError>
      </QuestionnaireItem>
      <QuestionnaireItem name="second">
        <QuestionnaireTitle>Second question</QuestionnaireTitle>
        <QuestionnaireInput aria-label="Detail" />
      </QuestionnaireItem>
      <QuestionnairePrevious id="previous" />
      <QuestionnaireSkip id="skip" />
      <QuestionnaireNext id="next" />
      <QuestionnaireSubmit id="submit" />
    </Questionnaire>
  );
}

test("questionnaire SSR derives progress, shortcuts and active item from definitions", () => {
  const html = renderToString(<Flow defaultItem="second" />);
  expect(html).toContain('aria-valuenow="2"');

  expect(html).toContain('aria-valuemax="2"');

  expect(html).toContain("data-active");

  expect(html).toContain('data-shortcut="A"');
});

test("questionnaire validates, changes steps, retains answers and submits native form data", async () => {
  let answers: FormData | undefined;
  render(
    <Flow
      onSubmit={(event: any) => {
        event.preventDefault();
        answers = new FormData(event.currentTarget);
      }}
    />,
  );

  await settle();

  fire(get("#next"), new MouseEvent("click", { bubbles: true }));

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("1");

  expect(get("fieldset[data-slot=questionnaire-item]").hasAttribute("data-invalid")).toBe(true);

  select("a");

  fire(get("#next"), new MouseEvent("click", { bubbles: true }));

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("2");
  const detail = get<HTMLInputElement>('input[aria-label="Detail"]');
  detail.value = "Context";
  fire(detail, new InputEvent("input", { bubbles: true }));

  fire(get("#previous"), new MouseEvent("click", { bubbles: true }));

  expect(get<HTMLInputElement>("input[value=a]").checked).toBe(true);

  fire(get("#next"), new MouseEvent("click", { bubbles: true }));

  fire(get("form"), new SubmitEvent("submit", { bubbles: true, cancelable: true }));

  expect(answers?.get("first")).toBe("a");

  expect(answers?.get("second")).toBe("Context");
});

test("questionnaire freeform answers update on input and reset to defaults", async () => {
  render(<Flow />);

  await settle();
  const input = get<HTMLInputElement>('input[aria-label="Other answer"]');
  input.value = "Something else";
  fire(input, new InputEvent("input", { bubbles: true }));

  expect(input.getAttribute("name")).toBe("first");

  expect(get("fieldset[data-slot=questionnaire-item]").getAttribute("data-status")).toBe(
    "answered",
  );

  fire(get("#next"), new MouseEvent("click", { bubbles: true }));

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("2");

  act(() => get<HTMLFormElement>("form").reset());

  await settle();

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("1");

  expect(input.value).toBe("");
});

test("questionnaire shortcuts select choices and Enter advances while composing text does not", async () => {
  render(<Flow />);

  await settle();

  fire(get("form"), new KeyboardEvent("keydown", { key: "b", bubbles: true, cancelable: true }));

  expect(get<HTMLInputElement>("input[value=b]").checked).toBe(true);

  fire(
    get<HTMLInputElement>("input[value=b]"),
    new KeyboardEvent("keydown", {
      key: "Enter",
      isComposing: true,
      bubbles: true,
      cancelable: true,
    }),
  );

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("1");

  fire(
    get<HTMLInputElement>("input[value=b]"),
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
  );

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("2");
});

test("questionnaire controlled selection remains authoritative when change is declined", async () => {
  function Controlled() {
    const [item, setItem] = useState("first");
    return (
      <Questionnaire
        items={[{ name: "first", required: true }, { name: "second" }]}
        item={item}
        onItemChange={setItem}
      >
        <QuestionnaireItem name="first" required>
          <QuestionnaireChoice value="a" checked={false}>
            Alpha
          </QuestionnaireChoice>
        </QuestionnaireItem>
        <QuestionnaireItem name="second">
          <QuestionnaireInput />
        </QuestionnaireItem>
        <QuestionnaireNext id="next" />
        <QuestionnaireProgress id="progress" />
      </Questionnaire>
    );
  }

  render(<Controlled />);

  await settle();

  select("a");

  await settle();

  expect(get<HTMLInputElement>("input[value=a]").checked).toBe(false);

  fire(get("#next"), new MouseEvent("click", { bubbles: true }));

  expect(get("#progress").getAttribute("aria-valuenow")).toBe("1");
});

test("questionnaire restores controlled radio siblings after a rejected native selection", async () => {
  render(
    <Questionnaire items={[{ name: "answer" }]}>
      <QuestionnaireItem name="answer">
        <QuestionnaireChoice value="a" checked>
          Alpha
        </QuestionnaireChoice>
        <QuestionnaireChoice value="b" checked={false}>
          Beta
        </QuestionnaireChoice>
      </QuestionnaireItem>
    </Questionnaire>,
  );

  await settle();

  select("b");

  await settle();

  expect(get<HTMLInputElement>("input[value=a]").checked).toBe(true);

  expect(get<HTMLInputElement>("input[value=b]").checked).toBe(false);
});

test("questionnaire controlled text accepts owner updates and restores rejected edits", async () => {
  function Controlled() {
    const [value, setValue] = useState("Saved");
    return (
      <Questionnaire items={[{ name: "answer" }]}>
        <QuestionnaireItem name="answer">
          <QuestionnaireInput
            aria-label="Controlled text"
            value={value}
            onChange={(event) => {
              if (event.currentTarget.value !== "Rejected") {
                setValue(event.currentTarget.value);
              }
            }}
          />
        </QuestionnaireItem>
      </Questionnaire>
    );
  }

  render(<Controlled />);

  await settle();
  const input = get<HTMLInputElement>('input[aria-label="Controlled text"]');
  input.value = "Accepted";
  fire(input, new InputEvent("input", { bubbles: true }));

  await settle();

  expect(input.value).toBe("Accepted");
  input.value = "Rejected";
  fire(input, new InputEvent("input", { bubbles: true }));

  await settle();

  expect(input.value).toBe("Accepted");

  expect(new FormData(get<HTMLFormElement>("form")).get("answer")).toBe("Accepted");
});
