import { describe, expect, test } from "bun:test";

import { mergeProps, mergePropsN } from "@registry/ui/primitives/merge-props";

import { fire, render } from "../../utils";

const click = () => new MouseEvent("click", { bubbles: true });

describe("mergeProps", () => {
  test("calls event handlers from right to left", () => {
    const calls: string[] = [];
    const merged: any = mergeProps<"button">(
      { onClick: () => calls.push("ours") },
      { onClick: () => calls.push("theirs") },
    );
    fire(render(<button onClick={merged.onClick} />).firstElementChild!, click());
    expect(calls).toEqual(["theirs", "ours"]);
  });

  test("preventBaseUIHandler stops the handlers on the left, with native events", () => {
    const calls: string[] = [];
    const merged: any = mergeProps<"button">(
      { onClick: () => calls.push("ours") },
      {
        onClick: (event) => {
          calls.push("theirs");
          event.preventBaseUIHandler();
        },
      },
    );
    fire(render(<button onClick={merged.onClick} />).firstElementChild!, click());
    expect(calls).toEqual(["theirs"]);
  });

  test("joins classNames right to left and merges styles", () => {
    const merged: any = mergeProps<"div">(
      { className: "a", style: { color: "red", top: 1 } as any },
      { className: "b", style: { color: "blue" } as any },
    );
    expect(merged.className).toBe("b a");
    expect(merged.style).toEqual({ color: "blue", top: 1 });
  });

  test("other props are overwritten by the rightmost value", () => {
    expect(mergeProps<"div">({ id: "a", title: "t" }, { id: "b" }) as any).toEqual({ id: "b", title: "t" });
  });

  test("a props getter receives the props merged so far", () => {
    const merged: any = mergeProps<"div">({ id: "a" }, (previous: any) => ({
      ...previous,
      title: `from-${previous.id}`,
    }));
    expect(merged.title).toBe("from-a");
  });

  test("mergePropsN merges any number of sets", () => {
    expect(mergePropsN<"div">([{ id: "a" }, { title: "t" }, { id: "c" }]) as any).toEqual({ id: "c", title: "t" });
  });
});