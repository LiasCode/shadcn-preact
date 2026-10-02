import { describe, expect, test } from "bun:test";

import { mergeProps } from "@registry/ui/primitives/merge-props";
import { useRender } from "@registry/ui/primitives/use-render";

import { render } from "../../utils";

function Badge({ className, variant = "default", render: renderProp, ...props }: any) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: ["badge", className].filter(Boolean).join(" ") }, props),
    render: renderProp,
    state: { slot: "badge", variant },
  });
}

describe("useRender", () => {
  test("renders the default tag with state as data attributes and merged props", () => {
    const el = render(
      <Badge className="extra" variant="secondary" id="b">
        Hi
      </Badge>,
    ).firstElementChild!;
    expect(el.tagName).toBe("SPAN");
    expect(el.getAttribute("data-slot")).toBe("badge");
    expect(el.getAttribute("data-variant")).toBe("secondary");
    expect(el.className).toBe("badge extra");
    expect(el.id).toBe("b");
    expect(el.textContent).toBe("Hi");
  });

  test("clones a render element, merging props and both refs", () => {
    const outer: { current: Element | null } = { current: null };
    const inner: { current: HTMLAnchorElement | null } = { current: null };
    const el = render(
      <Badge ref={outer} className="x" render={<a href="#go" className="link" ref={inner} />}>
        Go
      </Badge>,
    ).firstElementChild!;
    expect(el.tagName).toBe("A");
    expect(el.getAttribute("href")).toBe("#go");
    expect(el.getAttribute("data-slot")).toBe("badge");
    expect(el.className.split(" ").sort()).toEqual(["badge", "link", "x"]);
    expect(outer.current).toBe(el);
    expect(inner.current).toBe(el as HTMLAnchorElement);
  });

  test("calls a render function with the props and the state", () => {
    const el = render(
      <Badge variant="outline" render={(props: any, state: any) => <button {...props} data-v={state.variant} />}>
        B
      </Badge>,
    ).firstElementChild!;
    expect(el.tagName).toBe("BUTTON");
    expect(el.getAttribute("data-v")).toBe("outline");
    expect(el.className).toBe("badge");
  });

  test("resolves className and style functions with the state", () => {
    function Open(props: any) {
      return useRender({ ...props, state: { open: true } });
    }
    const el = render(
      <Open className={(state: any) => (state.open ? "is-open" : "")} style={() => ({ color: "red" })} />,
    ).firstElementChild as HTMLElement;
    expect(el.tagName).toBe("DIV");
    expect(el.className).toBe("is-open");
    expect(el.hasAttribute("data-open")).toBe(true);
    expect(el.style.color).toBe("red");
  });

  test("defaults buttons to type=button", () => {
    function Btn() {
      return useRender({ defaultTagName: "button" });
    }
    expect(render(<Btn />).firstElementChild!.getAttribute("type")).toBe("button");
  });

  test("renders nothing when disabled", () => {
    function Off() {
      return useRender({ enabled: false });
    }
    expect(render(<Off />).innerHTML).toBe("");
  });
});