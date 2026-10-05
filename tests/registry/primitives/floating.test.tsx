import { describe, expect, spyOn, test } from "bun:test";

import { render as preactRender } from "preact";
import { useState } from "preact/hooks";

import { DirectionProvider } from "../../../registry/ui/primitives/direction-provider";
import type { BaseUIChangeEventDetails } from "../../../registry/ui/primitives/internals/createBaseUIEventDetails";
import { FloatingFocusManager } from "../../../registry/ui/primitives/internals/FloatingFocusManager";
import { FloatingPortal } from "../../../registry/ui/primitives/internals/FloatingPortal";
import {
  FloatingTree,
  FloatingNode,
  useFloatingNodeId,
} from "../../../registry/ui/primitives/internals/FloatingTree";
import { markOthers } from "../../../registry/ui/primitives/internals/markOthers";
import { getTabbableElements } from "../../../registry/ui/primitives/internals/tabbable";
import { useAnchorPositioning } from "../../../registry/ui/primitives/internals/useAnchorPositioning";
import { useDismiss } from "../../../registry/ui/primitives/internals/useDismiss";
import type { UseDismissProps } from "../../../registry/ui/primitives/internals/useDismiss";
import { useFloatingRootContext } from "../../../registry/ui/primitives/internals/useFloatingRootContext";
import type { FloatingChangeReason } from "../../../registry/ui/primitives/internals/useFloatingRootContext";
import { lockScroll, useScrollLock } from "../../../registry/ui/primitives/internals/useScrollLock";
import { act, cleanup, fire, render, settle } from "../../utils";

interface OverlayProps {
  name?: string;
  modal?: boolean;
  nested?: boolean;
  dismiss?: UseDismissProps;
  initialFocus?: boolean;
  restoreFocus?: boolean;
  passiveChild?: boolean;
  onChange?: (open: boolean, details: BaseUIChangeEventDetails<FloatingChangeReason>) => void;
}

function PassiveFloating() {
  const id = useFloatingNodeId();
  useFloatingRootContext({ open: true, nodeId: id, elements: { reference: null, floating: null } });
  return null;
}

function Overlay({
  name = "parent",
  modal = true,
  nested,
  dismiss,
  onChange,
  initialFocus,
  restoreFocus,
  passiveChild,
}: OverlayProps) {
  const [open, setOpen] = useState(false);
  const [reference, setReference] = useState<HTMLButtonElement | null>(null);
  const [floating, setFloating] = useState<HTMLDivElement | null>(null);
  const id = useFloatingNodeId();
  const context = useFloatingRootContext({
    open,
    nodeId: id,
    elements: { reference, floating },
    onOpenChange(next, details) {
      onChange?.(next, details);

      if (!details.isCanceled) {
        setOpen(next);
      }
    },
  });
  useDismiss(context, dismiss);

  useScrollLock(open && modal, reference);
  return (
    <FloatingNode id={id}>
      <button ref={setReference} data-trigger={name} onClick={() => setOpen(!open)}>
        {name}
      </button>
      {open && (
        <FloatingPortal>
          <FloatingFocusManager
            context={context}
            modal={modal}
            initialFocus={initialFocus}
            restoreFocus={restoreFocus}
          >
            <div ref={setFloating} data-popup={name} role="dialog">
              <button data-first={name}>first</button>
              {nested && <Overlay name="child" />}
              {passiveChild && <PassiveFloating />}
              <button data-last={name} onClick={() => setOpen(false)}>
                close
              </button>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </FloatingNode>
  );
}

function click(selector: string) {
  act(() => document.querySelector<HTMLElement>(selector)!.click());
}

function pointer(element: Element, type: string, pointerType = "mouse", x = 0, y = 0) {
  fire(
    element,
    new PointerEvent(type, { bubbles: true, button: 0, pointerType, clientX: x, clientY: y }),
  );
}

function escape() {
  fire(
    document.body,
    new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }),
  );
}

describe("floating infrastructure", () => {
  test("portals retain context, nest their hosts, forward refs and clean up", async () => {
    const host = document.createElement("section");
    document.body.append(host);
    let portal: HTMLDivElement | null = null;
    const container = render(
      <FloatingPortal
        container={host}
        ref={(element) => {
          portal = element;
        }}
        className="portal"
        data-test="outer"
      >
        <FloatingPortal>
          <button>nested</button>
        </FloatingPortal>
      </FloatingPortal>,
    );
    await settle();

    expect(portal as HTMLDivElement | null).toBe(
      host.querySelector("[data-test=outer]") as HTMLDivElement,
    );

    expect(host.querySelectorAll("[data-base-ui-portal]")).toHaveLength(2);

    expect(host.querySelector("[data-test=outer] [data-base-ui-portal] button")).not.toBeNull();

    act(() => preactRender(null, container));

    expect(host.children).toHaveLength(0);

    expect(portal).toBeNull();
  });

  test("an explicit null portal container waits without falling back to the body", () => {
    render(
      <FloatingPortal container={null}>
        <button>pending</button>
      </FloatingPortal>,
    );

    expect(document.querySelector("[data-base-ui-portal]")).toBeNull();
  });

  test("modal focuses, wraps Tab, redirects outside focus, and restores the trigger", async () => {
    render(
      <>
        <button data-outside="">outside</button>
        <Overlay />
      </>,
    );

    click("[data-trigger=parent]");

    await settle();
    const popup = document.querySelector<HTMLElement>("[data-popup=parent]")!;
    expect(document.activeElement).toBe(popup.querySelector("[data-first]"));

    act(() => popup.querySelector<HTMLElement>("[data-last]")!.focus());

    fire(popup, new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));

    expect(document.activeElement).toBe(popup.querySelector("[data-first]"));

    fire(
      popup,
      new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true, cancelable: true }),
    );

    expect(document.activeElement).toBe(popup.querySelector("[data-last]"));

    act(() => document.querySelector<HTMLElement>("[data-outside]")!.focus());

    expect(popup.contains(document.activeElement)).toBe(true);

    escape();

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();

    expect(document.activeElement).toBe(document.querySelector("[data-trigger=parent]"));

    expect(document.querySelector("[inert]")).toBeNull();

    expect(document.body.style.overflow).toBe("");
  });

  test("Escape closes only the innermost modal and keeps the parent's locks and focus", async () => {
    render(
      <FloatingTree>
        <Overlay nested />
      </FloatingTree>,
    );

    click("[data-trigger=parent]");

    await settle();

    click("[data-trigger=child]");

    await settle();

    expect(document.activeElement).toBe(document.querySelector("[data-first=child]"));

    escape();

    await settle();

    expect(document.querySelector("[data-popup=child]")).toBeNull();

    expect(document.querySelector("[data-popup=parent]")).not.toBeNull();

    expect(document.body.style.overflow).toBe("clip");

    expect(document.documentElement.style.overflow).toBe("hidden");

    expect(document.activeElement).toBe(document.querySelector("[data-trigger=child]"));

    escape();

    await settle();

    expect(document.querySelector("[data-popup=parent]")).toBeNull();

    expect(document.body.style.overflow).toBe("");
  });

  test("a passive floating descendant does not disable its modal parent's focus or dismissal", async () => {
    render(
      <FloatingTree>
        <Overlay passiveChild />
      </FloatingTree>,
    );

    click("[data-trigger]");

    await settle();

    act(() => document.querySelector<HTMLElement>("[data-last]")!.focus());

    fire(
      document.body,
      new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
    );

    expect(document.activeElement).toBe(document.querySelector("[data-first]"));

    escape();

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();
  });

  test("canceled dismissal and IME Escape leave the popup open", async () => {
    const reasons: string[] = [];
    render(
      <Overlay
        onChange={(_, details) => {
          reasons.push(details.reason);

          details.cancel();
        }}
      />,
    );

    click("[data-trigger]");

    await settle();

    fire(
      document.body,
      new KeyboardEvent("keydown", { key: "Escape", isComposing: true, bubbles: true }),
    );

    expect(reasons).toEqual([]);

    escape();

    expect(reasons).toEqual(["escape-key"]);

    pointer(document.body, "pointerdown");

    expect(reasons).toEqual(["escape-key", "outside-press"]);

    expect(document.querySelector("[data-popup]")).not.toBeNull();
  });

  test("intentional outside presses ignore dragging out, touch scrolling and secondary buttons", async () => {
    render(<Overlay modal={false} dismiss={{ outsidePressEvent: "intentional" }} />);

    click("[data-trigger]");

    await settle();

    pointer(document.querySelector("[data-first]")!, "pointerdown");

    pointer(document.body, "pointerup");

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    pointer(document.body, "pointerdown", "touch", 0, 0);

    pointer(document.body, "pointerup", "touch", 0, 50);

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    fire(document.body, new PointerEvent("pointerdown", { bubbles: true, button: 2 }));

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    pointer(document.body, "pointerdown");

    pointer(document.body, "pointerup");

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();
  });

  test("sloppy touch scroll outside dismisses but a drag inside stays open", async () => {
    render(<Overlay modal={false} />);

    click("[data-trigger]");

    await settle();

    pointer(document.querySelector("[data-first]")!, "pointerdown", "touch");

    fire(document.body, new Event("scroll"));

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    pointer(document.body, "pointerdown", "touch");

    fire(document.body, new Event("scroll"));

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();
  });

  test("non-modal focus out keeps the newly focused control", async () => {
    render(
      <>
        <Overlay modal={false} />
        <button data-outside="">next</button>
      </>,
    );

    click("[data-trigger]");

    await settle();

    click("[data-first]");

    act(() => document.querySelector<HTMLElement>("[data-outside]")!.focus());

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();

    expect(document.activeElement).toBe(document.querySelector("[data-outside]"));
  });

  test("removed focused content restores focus when requested", async () => {
    render(<Overlay restoreFocus />);

    click("[data-trigger]");

    await settle();

    document.querySelector("[data-first]")!.remove();

    await settle();

    expect(document.activeElement).toBe(document.querySelector("[data-last]"));
  });

  test("outside attribute locks preserve live regions, shadow hosts and original values", () => {
    document.body.innerHTML =
      '<main inert="original" aria-hidden="false"><button>outside</button></main><aside aria-live="polite">live</aside><section><div id="popup"></div></section>';
    const popup = document.querySelector("#popup")!;
    const main = document.querySelector("main")!;
    const releaseA = markOthers([popup], { inert: true });
    const releaseB = markOthers([popup], { inert: true });
    expect(document.querySelector("aside")!.hasAttribute("inert")).toBe(false);

    releaseA();

    expect(main.getAttribute("inert")).toBe("");

    releaseB();

    expect(main.getAttribute("inert")).toBe("original");

    releaseB();

    expect(main.getAttribute("inert")).toBe("original");
    const releaseC = markOthers([popup], { ariaHidden: true });
    expect(main.getAttribute("aria-hidden")).toBe("true");

    releaseC();

    expect(main.getAttribute("aria-hidden")).toBe("false");
    const shadowHost = document.createElement("div");
    document.body.append(shadowHost);
    const shadowPopup = document.createElement("div");
    shadowHost.attachShadow({ mode: "open" }).append(shadowPopup);
    const releaseD = markOthers([shadowPopup], { inert: true });
    expect(shadowHost.hasAttribute("inert")).toBe(false);

    releaseD();
  });

  test("updating modal background locks keeps unchanged attributes and reconciles new inside elements", () => {
    document.body.innerHTML =
      '<main><button>outside</button></main><section><div id="popup"></div></section>';
    const popup = document.querySelector("#popup")!;
    const main = document.querySelector("main")!;
    const section = document.querySelector("section")!;
    const release = markOthers([popup], { inert: true });
    const observer = new MutationObserver(() => {});
    observer.observe(document.body, { attributes: true, subtree: true });

    release.update();

    expect(observer.takeRecords()).toHaveLength(0);
    const added = document.createElement("button");
    document.body.append(added);

    release.update();

    expect(added.hasAttribute("inert")).toBe(true);

    expect(observer.takeRecords().some((record) => record.target === main)).toBe(false);

    release.update([main]);

    expect(main.hasAttribute("inert")).toBe(false);

    expect(section.hasAttribute("inert")).toBe(true);

    release();

    expect(document.querySelectorAll("[inert],[data-base-ui-inert]")).toHaveLength(0);

    observer.disconnect();
  });

  test("tabbable traversal reads shared ancestor styles once and refreshes them on the next traversal", () => {
    const container = render(
      <div>
        {Array.from({ length: 20 }, (_, index) => (
          <button key={index}>{index}</button>
        ))}
      </div>,
    );
    const parent = container.firstElementChild as HTMLElement;
    const styles = spyOn(window, "getComputedStyle");

    try {
      expect(getTabbableElements(container)).toHaveLength(20);

      expect(styles.mock.calls.filter(([element]) => element === parent)).toHaveLength(1);
      parent.style.display = "none";
      expect(getTabbableElements(container)).toHaveLength(0);
      parent.style.display = "block";
      expect(getTabbableElements(container)).toHaveLength(20);
    } finally {
      styles.mockRestore();
    }
  });

  test("scroll locks are per-document, reference-counted and restore inline priorities", () => {
    document.body.style.setProperty("overflow", "auto", "important");
    document.body.style.paddingRight = "7px";
    const a = lockScroll(document);
    const b = lockScroll(document);
    expect(document.body.style.overflow).toBe("clip");

    expect(document.documentElement.style.overflow).toBe("hidden");

    a();

    expect(document.body.style.overflow).toBe("clip");

    expect(document.documentElement.style.overflow).toBe("hidden");

    b();

    expect(document.body.style.overflow).toBe("auto");

    expect(document.body.style.getPropertyPriority("overflow")).toBe("important");

    expect(document.body.style.paddingRight).toBe("7px");

    b();

    document.body.removeAttribute("style");
  });

  test("body scrolling documents keep their native scroller locked and restore its overflow", () => {
    const other = document.implementation.createHTMLDocument();
    Object.defineProperty(other, "scrollingElement", { value: other.body });
    other.body.style.overflow = "scroll";
    const release = lockScroll(other);
    expect(other.body.style.overflow).toBe("hidden");

    expect(other.documentElement.style.overflow).toBe("hidden");

    release();

    expect(other.body.style.overflow).toBe("scroll");

    expect(other.documentElement.style.overflow).toBe("");
  });

  test("tab candidates skip disabled fieldsets, hidden ancestors and unselected radio groups", () => {
    const container = render(
      <div>
        <button>first</button>
        <fieldset disabled>
          <input />
        </fieldset>
        <div hidden>
          <button>hidden</button>
        </div>
        <input type="radio" name="r" />
        <input type="radio" name="r" defaultChecked />
        <button tabIndex={2}>priority</button>
      </div>,
    );
    const elements = getTabbableElements(container);
    expect(
      elements.map((element) => element.textContent || (element as HTMLInputElement).type),
    ).toEqual(["priority", "first", "radio"]);
  });

  test("outside presses inside a child portal keep both layers open", async () => {
    render(
      <FloatingTree>
        <Overlay nested />
      </FloatingTree>,
    );

    click("[data-trigger=parent]");

    await settle();

    click("[data-trigger=child]");

    await settle();

    pointer(document.querySelector("[data-first=child]")!, "pointerdown");

    expect(document.querySelectorAll("[data-popup]")).toHaveLength(2);

    pointer(document.body, "pointerdown");

    await settle();

    expect(document.querySelectorAll("[data-popup]")).toHaveLength(0);

    expect(document.querySelectorAll("[inert]")).toHaveLength(0);
  });

  test("modal background inserted after opening becomes inert and is restored", async () => {
    render(<Overlay />);

    click("[data-trigger]");

    await settle();
    const added = document.createElement("button");
    added.textContent = "late background";
    document.body.append(added);

    await settle();

    expect(added.hasAttribute("inert")).toBe(true);

    escape();

    await settle();

    expect(added.hasAttribute("inert")).toBe(false);
  });

  test("non-modal portal guards preserve the trigger's position in Tab order", async () => {
    render(
      <>
        <button data-before="">before</button>
        <Overlay modal={false} />
        <button data-after="">after</button>
      </>,
    );

    click("[data-trigger]");

    await settle();
    const popup = document.querySelector("[data-popup]")!;
    const outsideGuard = document.querySelector("[data-trigger]")!
      .nextElementSibling as HTMLElement;
    act(() => document.querySelector<HTMLElement>("[data-trigger]")!.focus());

    act(() => outsideGuard.focus());

    expect(document.activeElement).toBe(document.querySelector("[data-first]"));
    const host = popup.closest("[data-base-ui-portal]")!;
    const guards = host.querySelectorAll<HTMLElement>("[data-base-ui-focus-guard]");
    act(() => document.querySelector<HTMLElement>("[data-first]")!.focus());

    act(() => guards[0]!.focus());

    await settle();

    expect(document.activeElement).toBe(document.querySelector("[data-trigger]"));

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    escape();

    await settle();

    click("[data-trigger]");

    await settle();
    const newHost = document.querySelector("[data-popup]")!.closest("[data-base-ui-portal]")!;
    act(() => document.querySelector<HTMLElement>("[data-last]")!.focus());

    act(() => newHost.querySelectorAll<HTMLElement>("[data-base-ui-focus-guard]")[1]!.focus());

    await settle();

    expect(document.activeElement).toBe(document.querySelector("[data-after]"));

    expect(document.querySelector("[data-popup]")).toBeNull();
  });

  test("initialFocus false leaves the reference focused and compositionend defers Escape", async () => {
    render(<Overlay initialFocus={false} modal={false} />);

    act(() => document.querySelector<HTMLElement>("[data-trigger]")!.focus());

    click("[data-trigger]");

    await settle();

    expect(document.activeElement).toBe(document.querySelector("[data-trigger]"));

    fire(document.body, new CompositionEvent("compositionstart", { bubbles: true }));

    fire(document.body, new CompositionEvent("compositionend", { bubbles: true }));

    escape();

    expect(document.querySelector("[data-popup]")).not.toBeNull();

    await settle(10);

    escape();

    await settle();

    expect(document.querySelector("[data-popup]")).toBeNull();
  });

  test("scroll lock restores separate overflow longhands and does not affect a different document", () => {
    document.body.style.overflowX = "clip";
    document.body.style.setProperty("overflow-y", "auto", "important");
    const other = document.implementation.createHTMLDocument();
    const release = lockScroll(document);
    const releaseOther = lockScroll(other);
    releaseOther();

    expect(document.body.style.overflow).toBe("clip");

    expect(document.documentElement.style.overflow).toBe("hidden");

    release();

    expect(document.body.style.overflowX).toBe("clip");

    expect(document.body.style.overflowY).toBe("auto");

    expect(document.body.style.getPropertyPriority("overflow-y")).toBe("important");

    document.body.removeAttribute("style");
  });

  test("positioning handles logical RTL sides, dimensions and closed keepMounted elements", async () => {
    let renders = 0;
    let update: (() => Promise<void>) | undefined;

    function Position({ open }: { open: boolean }) {
      renders++;
      const anchor = document.querySelector<HTMLElement>("#anchor")!;
      const positioning = useAnchorPositioning({
        mounted: open,
        anchor,
        side: "inline-start",
        sideOffset: (data) => data.anchor.width / 4,
        collisionAvoidance: { side: "none", align: "none" },
        keepMounted: true,
      });
      update = positioning.update;
      return (
        <div
          ref={positioning.refs.setFloating}
          style={positioning.positionerStyles}
          data-positioned={String(positioning.isPositioned)}
          data-side={positioning.side}
          data-physical={positioning.physicalSide}
        />
      );
    }

    const anchor = document.createElement("button");
    anchor.id = "anchor";
    document.body.append(anchor);
    anchor.getBoundingClientRect = () => ({
      x: 50.25,
      y: 50.25,
      width: 40,
      height: 20,
      left: 50.25,
      top: 50.25,
      right: 90.25,
      bottom: 70.25,
      toJSON() {},
    });
    const container = render(
      <DirectionProvider direction="rtl">
        <Position open />
      </DirectionProvider>,
    );
    await settle();
    const positioner = container.firstElementChild as HTMLElement;
    expect(positioner.dataset.positioned).toBe("true");

    expect(positioner.dataset.side).toBe("inline-start");

    expect(positioner.dataset.physical).toBe("right");

    expect(positioner.style.getPropertyValue("--anchor-width")).toBe("40px");

    expect(Number.parseFloat(positioner.style.left) % 1).toBe(0);

    expect(Number.parseFloat(positioner.style.top) % 1).toBe(0);

    expect(positioner.style.getPropertyValue("--transform-origin")).not.toBe("");
    const positionedRenders = renders;
    await act(async () => {
      await update?.();
    });

    expect(renders).toBe(positionedRenders);

    act(() =>
      preactRender(
        <DirectionProvider direction="rtl">
          <Position open={false} />
        </DirectionProvider>,
        container,
      ),
    );

    await settle();

    expect(positioner.dataset.positioned).toBe("false");

    expect(positioner.style.opacity).toBe("0");

    cleanup();
  });
});
