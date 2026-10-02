import { afterAll, beforeAll, expect, test } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { Accordion } from "@registry/ui/primitives/accordion";
import { Checkbox } from "@registry/ui/primitives/checkbox";
import { mergeProps } from "@registry/ui/primitives/merge-props";
import { Slider } from "@registry/ui/primitives/slider";
import { Tabs } from "@registry/ui/primitives/tabs";
import { Toggle } from "@registry/ui/primitives/toggle";
import { ToggleGroup } from "@registry/ui/primitives/toggle-group";
import { useRender } from "@registry/ui/primitives/use-render";
import { renderToString } from "preact-render-to-string";

import { FloatingFocusManager } from "../../../registry/ui/primitives/internals/FloatingFocusManager";
import { FloatingPortal } from "../../../registry/ui/primitives/internals/FloatingPortal";
import { useAnchorPositioning } from "../../../registry/ui/primitives/internals/useAnchorPositioning";
import { useDismiss } from "../../../registry/ui/primitives/internals/useDismiss";
import { useFloatingRootContext } from "../../../registry/ui/primitives/internals/useFloatingRootContext";
import { useScrollLock } from "../../../registry/ui/primitives/internals/useScrollLock";

// Prerendering runs without a document; refs are skipped there.
beforeAll(async () => {
  await GlobalRegistrator.unregister();
});
afterAll(() => {
  GlobalRegistrator.register({ url: "http://localhost/" });
});

function Badge({ className, render: renderProp, ...props }: any) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">({ className: ["b", className].filter(Boolean).join(" ") }, props),
    render: renderProp,
    state: { slot: "badge" },
  });
}

test("useRender renders to a string without a document", () => {
  expect(typeof document).toBe("undefined");
  expect(renderToString(<Badge className="x">Hi</Badge>)).toBe('<span data-slot="badge" class="b x">Hi</span>');
  expect(renderToString(<Badge render={<a href="/a" />}>A</Badge>)).toBe(
    '<a href="/a" data-slot="badge" class="b">A</a>',
  );
});

test("state primitives prerender without browser globals", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(
    <>
      <ToggleGroup defaultValue={["a"]}>
        <Toggle value="a">A</Toggle>
      </ToggleGroup>
      <Checkbox.Root defaultChecked name="terms" />
      <Tabs.Root defaultValue="a">
        <Tabs.List>
          <Tabs.Tab value="a">A</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel</Tabs.Panel>
      </Tabs.Root>
      <Accordion.Root defaultValue={["a"]}>
        <Accordion.Item value="a">
          <Accordion.Trigger>A</Accordion.Trigger>
          <Accordion.Panel>Panel</Accordion.Panel>
        </Accordion.Item>
      </Accordion.Root>
      <Slider.Root defaultValue={[20, 40]}>
        <Slider.Control>
          <Slider.Thumb index={0} />
          <Slider.Thumb index={1} />
        </Slider.Control>
      </Slider.Root>
    </>,
  );
  expect(markup).toContain('aria-pressed="true"');
  expect(markup).toContain('role="tabpanel"');
  expect(markup).toContain('aria-expanded="true"');
  expect(markup).toContain('value="20"');
  expect(markup).toContain('value="40"');
});
function FloatingSubject() {
  const context = useFloatingRootContext({ open: true, elements: { reference: null, floating: null } });
  useDismiss(context);
  useScrollLock(true);
  const position = useAnchorPositioning({ mounted: true });
  return (
    <>
      <div style={position.positionerStyles}>positioner</div>
      <FloatingPortal>
        <FloatingFocusManager context={context}>
          <div>popup</div>
        </FloatingFocusManager>
      </FloatingPortal>
    </>
  );
}
test("floating infrastructure prerenders without browser globals or portal content", () => {
  expect(typeof window).toBe("undefined");
  const markup = renderToString(<FloatingSubject />);
  expect(markup).toContain("positioner");
  expect(markup).toContain("opacity:0");
  expect(markup).not.toContain("popup");
});