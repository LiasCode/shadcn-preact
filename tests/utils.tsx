import { type ComponentChild, render as preactRender } from "preact";
import { act } from "preact/test-utils";

export { act };

const containers = new Set<HTMLElement>();

/** Unmounts subjects so hook cleanups run before the document is reset. */
export function cleanup() {
  act(() => {
    for (const container of containers) {
      preactRender(null, container);

      container.remove();
    }
  });

  containers.clear();
}

/** Renders `node` into a new container attached to the document and flushes effects. */
export function render(node: ComponentChild): HTMLElement {
  const container = document.createElement("div");
  document.body.appendChild(container);

  containers.add(container);

  act(() => {
    preactRender(node, container);
  });
  return container;
}

/** Dispatches a bubbling event on `element` and flushes the resulting updates. */
export function fire(element: Element, event: Event) {
  act(() => {
    element.dispatchEvent(event);
  });
}

/** Lets pending frames, timers, and promises run. */
export async function settle(ms = 32) {
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, ms));
  });
}
