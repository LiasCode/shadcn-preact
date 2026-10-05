import { expect, test } from "bun:test";

import { useControlled } from "@registry/ui/primitives/internals/useControlled";

import { act, render } from "../../../utils";

let setValue: (value: string) => void = () => {};

function Field({ value }: { value?: string }) {
  const [current, set] = useControlled({ controlled: value, default: "a", name: "Field" });
  setValue = set;
  return <b>{current}</b>;
}

test("uncontrolled state follows the setter", () => {
  const container = render(<Field />);
  act(() => setValue("b"));

  expect(container.textContent).toBe("b");
});

test("controlled state ignores the setter", () => {
  const container = render(<Field value="z" />);
  act(() => setValue("y"));

  expect(container.textContent).toBe("z");
});
