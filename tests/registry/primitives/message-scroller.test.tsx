import { expect, test } from "bun:test";

import { useState } from "preact/hooks";

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "../../../registry/ui/message-scroller";
import {
  areScrollStatesEqual,
  createMessageScrollerStore,
  createMessageScrollerVisibilityStore,
} from "../../../registry/ui/primitives/message-scroller/stores";
import { act, cleanup, fire, render, settle } from "../../utils";

function get(selector: string) {
  return document.querySelector<HTMLElement>(selector)!;
}
function rect(top: number, height: number) {
  return {
    top,
    bottom: top + height,
    height,
    left: 0,
    right: 300,
    width: 300,
    x: 0,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}
function viewportRef(element: HTMLDivElement | null) {
  if (!element) return;
  Object.defineProperty(element, "clientHeight", { configurable: true, value: 100 });
  Object.defineProperty(element, "scrollHeight", { configurable: true, value: 600 });
  element.getBoundingClientRect = () => rect(0, 100);
  element.scrollTo = (options?: ScrollToOptions | number, y?: number) => {
    element.scrollTop = typeof options === "number" ? (y ?? 0) : (options?.top ?? 0);
  };
}
function rowRef(element: HTMLDivElement | null) {
  if (!element) return;
  element.getBoundingClientRect = () =>
    rect(Number(element.dataset.position) * 100 - (element.closest("#viewport")?.scrollTop ?? 0), 100);
}
function Visibility() {
  const { visibleMessageIds } = useMessageScrollerVisibility();
  return <output>{visibleMessageIds.join(",")}</output>;
}
function Commands() {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller();
  return (
    <>
      <button id="start" onClick={() => scrollToStart()}>
        Start
      </button>
      <button id="end" onClick={() => scrollToEnd()}>
        End
      </button>
      <button id="jump" onClick={() => scrollToMessage("row-3")}>
        Jump
      </button>
    </>
  );
}
let forwardedRoot: HTMLDivElement | null = null;
function Fixture() {
  const [ids, setIds] = useState([0, 1, 2, 3, 4, 5]);
  return (
    <MessageScrollerProvider defaultScrollPosition="start">
      <Commands />
      <Visibility />
      <button id="remove" onClick={() => setIds([0, 1, 2])}>
        Remove rows
      </button>
      <MessageScroller
        id="scroller-root"
        ref={(element) => {
          forwardedRoot = element;
        }}
      >
        <MessageScrollerViewport id="viewport" ref={viewportRef}>
          <MessageScrollerContent>
            {ids.map((id) => (
              <MessageScrollerItem key={id} messageId={`row-${id}`} data-position={id} ref={rowRef}>
                Row {id}
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton behavior="auto" />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
function click(selector: string) {
  fire(get(selector), new MouseEvent("click", { bubbles: true }));
}

test("message scroller commands use viewport geometry and unregister removed messages", async () => {
  render(<Fixture />);
  await settle();
  expect(get("#viewport").scrollTop).toBe(0);
  expect(forwardedRoot).toBe(get("#scroller-root") as HTMLDivElement);
  click("#end");
  await settle();
  expect(get("#viewport").scrollTop).toBe(500);
  expect(get("#scroller-root").getAttribute("data-scrollable")).toBe("start");
  click("#start");
  await settle();
  expect(get("#viewport").scrollTop).toBe(0);
  click("#jump");
  await settle();
  expect(get("#viewport").scrollTop).toBe(300);
  click("#remove");
  await settle();
  expect(document.querySelector('[data-message-id="row-3"]')).toBeNull();
  cleanup();
  await settle();
});

test("message scroller batches native scroll visibility updates into one frame", async () => {
  render(<Fixture />);
  await settle();
  const original = window.requestAnimationFrame;
  let count = 0;
  window.requestAnimationFrame = (callback) => {
    count++;
    return original.call(window, callback);
  };
  try {
    act(() => {
      for (let i = 0; i < 20; i++) get("#viewport").dispatchEvent(new Event("scroll"));
    });
    expect(count).toBe(1);
    await settle();
  } finally {
    window.requestAnimationFrame = original;
  }
});

test("message scroller keeps equal snapshots stable and only notifies real edge changes", () => {
  const initial = { start: false, end: true };
  const store = createMessageScrollerStore(initial, areScrollStatesEqual);
  let changes = 0;
  const unsubscribe = store.subscribe(() => changes++);
  store.setSnapshot({ start: false, end: true });
  expect(store.getSnapshot()).toBe(initial);
  expect(changes).toBe(0);
  store.setSnapshot({ start: true, end: false });
  expect(changes).toBe(1);
  unsubscribe();
  store.setSnapshot(initial);
  expect(changes).toBe(1);
});

test("message scroller visibility tracking starts once and stops with the last subscriber", () => {
  const store = createMessageScrollerVisibilityStore();
  let started = 0,
    stopped = 0,
    changes = 0;
  const initial = store.getSnapshot();
  const first = store.subscribe(
    () => changes++,
    () => started++,
    () => stopped++,
  );
  const second = store.subscribe(
    () => {},
    () => started++,
    () => stopped++,
  );
  expect(started).toBe(1);
  store.setSnapshot({ currentAnchorId: null, visibleMessageIds: [] });
  expect(store.getSnapshot()).toBe(initial);
  store.setSnapshot({ currentAnchorId: "a", visibleMessageIds: ["a", "b"] });
  expect(changes).toBe(1);
  first();
  expect(stopped).toBe(0);
  second();
  expect(stopped).toBe(1);
  expect(store.hasListeners()).toBe(false);
});