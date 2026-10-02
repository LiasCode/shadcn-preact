import { afterAll, beforeAll, expect, test } from "bun:test";

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { mergeProps } from "@registry/ui/primitives/merge-props";
import { useRender } from "@registry/ui/primitives/use-render";
import { renderToString } from "preact-render-to-string";

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