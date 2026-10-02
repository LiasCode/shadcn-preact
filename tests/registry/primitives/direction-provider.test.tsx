import { expect, test } from "bun:test";

import { DirectionProvider, useDirection } from "@registry/ui/direction";

import { render } from "../../utils";

test("useDirection reads the nearest DirectionProvider, ltr by default", () => {
  function Show() {
    return <i>{useDirection()}</i>;
  }
  const container = render(
    <div>
      <Show />
      <DirectionProvider direction="rtl">
        <Show />
      </DirectionProvider>
    </div>,
  );
  expect(container.textContent).toBe("ltrrtl");
});