import { expect, test } from "bun:test";

import { Button } from "@registry/ui/primitives/button";

import { fire, render } from "../../utils";

const key = (type: string, value: string) =>
  new KeyboardEvent(type, { key: value, bubbles: true, cancelable: true });

test("disabled native buttons suppress clicks and expose disabled state", () => {
  let clicks = 0;
  const element = render(
    <Button disabled onClick={() => clicks++}>
      Disabled
    </Button>,
  ).firstElementChild as HTMLButtonElement;
  fire(element, new MouseEvent("click", { bubbles: true, cancelable: true }));

  expect(element.disabled).toBe(true);

  expect(element.hasAttribute("data-disabled")).toBe(true);

  expect(clicks).toBe(0);
});

test("focusable disabled buttons remain tabbable but suppress activation", () => {
  let clicks = 0;
  const element = render(<Button disabled focusableWhenDisabled onClick={() => clicks++} />)
    .firstElementChild as HTMLButtonElement;
  expect(element.disabled).toBe(false);

  expect(element.tabIndex).toBe(0);

  expect(element.getAttribute("aria-disabled")).toBe("true");
  const enter = key("keydown", "Enter");
  fire(element, enter);

  fire(element, new MouseEvent("click", { bubbles: true, cancelable: true }));

  expect(enter.defaultPrevented).toBe(true);

  expect(clicks).toBe(0);
  const tab = key("keydown", "Tab");
  fire(element, tab);

  expect(tab.defaultPrevented).toBe(false);
});

test("non-native buttons activate on Enter down and Space up", () => {
  let clicks = 0;
  const element = render(
    <Button nativeButton={false} render={<div />} onClick={() => clicks++} />,
  ).firstElementChild!;
  expect(element.getAttribute("role")).toBe("button");

  fire(element, key("keydown", "Enter"));

  expect(clicks).toBe(1);

  fire(element, key("keydown", " "));

  expect(clicks).toBe(1);

  fire(element, key("keyup", " "));

  expect(clicks).toBe(2);
});

test("preventBaseUIHandler prevents keyboard activation", () => {
  let clicks = 0;
  const element = render(
    <Button
      nativeButton={false}
      render={<div />}
      onClick={() => clicks++}
      onKeyDown={(event) => event.preventBaseUIHandler()}
    />,
  ).firstElementChild!;
  fire(element, key("keydown", "Enter"));

  expect(clicks).toBe(0);
});

test("links keep their href and do not synthesize an Enter click", () => {
  let clicks = 0;
  const element = render(
    <Button nativeButton={false} render={<a href="#go" />} onClick={() => clicks++} />,
  ).firstElementChild!;
  expect(element.getAttribute("href")).toBe("#go");
  const enter = key("keydown", "Enter");
  fire(element, enter);

  expect(enter.defaultPrevented).toBe(false);

  expect(clicks).toBe(0);
});
