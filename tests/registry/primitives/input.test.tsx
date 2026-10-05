import { expect, test } from "bun:test";

import { Input } from "@registry/ui/primitives/input";
import { useState } from "preact/hooks";

import { fire, render } from "../../utils";

test("uncontrolled input reports native input events and keeps its value", () => {
  let reported = "";
  let nativeEvent: Event | undefined;
  const element = render(
    <Input
      defaultValue="before"
      onValueChange={(value, details) => {
        reported = value;
        nativeEvent = details.event;
        expect(details.reason).toBe("none");
      }}
    />,
  ).firstElementChild as HTMLInputElement;
  expect(element.value).toBe("before");
  element.value = "after";
  const event = new Event("input", { bubbles: true });
  fire(element, event);

  expect(reported).toBe("after");

  expect(nativeEvent).toBe(event);

  expect(element.value).toBe("after");

  expect(element.id.startsWith("base-ui-")).toBe(true);
});

test("controlled input updates from onValueChange", () => {
  function Subject() {
    const [value, setValue] = useState("first");
    return <Input value={value} onValueChange={setValue} />;
  }

  const element = render(<Subject />).firstElementChild as HTMLInputElement;
  element.value = "second";
  fire(element, new Event("input", { bubbles: true }));

  expect(element.value).toBe("second");
});

test("a user input handler can prevent the internal value callback", () => {
  let calls = 0;
  const element = render(
    <Input onValueChange={() => calls++} onInput={(event) => event.preventBaseUIHandler()} />,
  ).firstElementChild!;
  fire(element, new Event("input", { bubbles: true }));

  expect(calls).toBe(0);
});

test("onChange runs on input before the value callback and can prevent it", () => {
  const calls: string[] = [];
  const element = render(
    <Input
      onValueChange={() => calls.push("value")}
      onChange={(event) => {
        calls.push("change");

        event.preventBaseUIHandler();
      }}
    />,
  ).firstElementChild!;
  fire(element, new Event("input", { bubbles: true }));

  expect(calls).toEqual(["change"]);
});
