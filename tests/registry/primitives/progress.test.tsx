import { expect, test } from "bun:test";

import { Progress } from "@registry/ui/primitives/progress";

import { render } from "../../utils";

test("progress connects its label, formats its value, and sizes its indicator", () => {
  const container = render(
    <Progress.Root value={75} min={50} max={100} locale="en-US">
      <Progress.Label>Upload</Progress.Label>
      <Progress.Value />
      <Progress.Track>
        <Progress.Indicator id="indicator" />
      </Progress.Track>
    </Progress.Root>,
  );
  const root = container.firstElementChild!;
  const label = root.querySelector('[role="presentation"]')!;
  const indicator = root.querySelector("#indicator") as HTMLElement;
  expect(root.getAttribute("role")).toBe("progressbar");
  expect(root.getAttribute("aria-labelledby")).toBe(label.id);
  expect(root.getAttribute("aria-valuenow")).toBe("75");
  expect(root.getAttribute("aria-valuetext")).toBe("75%");
  expect(root.hasAttribute("data-progressing")).toBe(true);
  expect(indicator.style.width).toBe("50%");
  expect(root.querySelector('[aria-hidden="true"]')?.textContent).toBe("75%");
});

test("indeterminate progress omits the numeric value and passes its state to the value callback", () => {
  const container = render(
    <Progress.Root value={null}>
      <Progress.Value>{(formatted, value) => `${formatted}:${value}`}</Progress.Value>
      <Progress.Indicator />
    </Progress.Root>,
  );
  const root = container.firstElementChild!;
  expect(root.hasAttribute("data-indeterminate")).toBe(true);
  expect(root.hasAttribute("aria-valuenow")).toBe(false);
  expect(root.getAttribute("aria-valuetext")).toBe("indeterminate progress");
  expect(root.querySelector('[aria-hidden="true"]')?.textContent).toBe("indeterminate:null");
  expect((root.querySelector("div") as HTMLElement).style.width).toBe("");
});

test("complete progress exposes complete state on each part", () => {
  const root = render(
    <Progress.Root value={10} max={10}>
      <Progress.Indicator />
    </Progress.Root>,
  ).firstElementChild!;
  expect(root.hasAttribute("data-complete")).toBe(true);
  expect(root.querySelector("div")!.hasAttribute("data-complete")).toBe(true);
});