import type { RefObject, VNode } from "preact";
import { useRef } from "preact/hooks";

import { usePortalContext } from "./FloatingPortal";
import { FocusGuard } from "./FocusGuard";
import { markOthers } from "./markOthers";
import { isHTMLElement, isNode } from "./owner";
import { getTabbableElements } from "./tabbable";
import { getFloatingInsideElements, type FloatingRootContext } from "./useFloatingRootContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

type InteractionType = "mouse" | "touch" | "pen" | "keyboard";
type FocusTarget =
  | boolean
  | RefObject<HTMLElement | null>
  | ((type: InteractionType) => boolean | HTMLElement | null | void);
export interface FloatingFocusManagerProps {
  children: VNode;
  context: FloatingRootContext;
  disabled?: boolean;
  modal?: boolean;
  outsideElementsInert?: boolean;
  referenceInside?: boolean;
  initialFocus?: FocusTarget;
  returnFocus?: FocusTarget;
  restoreFocus?: boolean | "popup";
  closeOnFocusOut?: boolean;
  openInteractionType?: InteractionType | null;
  nextFocusableElement?: HTMLElement | RefObject<HTMLElement | null> | null;
  previousFocusableElement?: HTMLElement | RefObject<HTMLElement | null> | null;
  beforeContentFocusGuardRef?: RefObject<HTMLSpanElement | null>;
  getInsideElements?: () => Array<Element | null | undefined>;
}
interface FocusLayer {
  context: () => FloatingRootContext;
  floating: HTMLElement;
}
const focusLayers = new WeakMap<Document, FocusLayer[]>();
function interaction(event?: Event): InteractionType {
  if (event?.type.startsWith("key")) return "keyboard";
  return event && "pointerType" in event && ["mouse", "pen", "touch"].includes(String(event.pointerType))
    ? (event.pointerType as InteractionType)
    : "mouse";
}
function resolve(target: FocusTarget, type: InteractionType, fallback: HTMLElement | null) {
  const value = typeof target === "function" ? target(type) : typeof target === "object" ? target.current : target;
  return value === true || value === null ? fallback : value || null;
}
export function FloatingFocusManager(props: FloatingFocusManagerProps) {
  const { context, children, disabled = false, modal = true } = props;
  const portal = usePortalContext();
  const beforeInsideRef = useRef<HTMLSpanElement | null>(null);
  const afterInsideRef = useRef<HTMLSpanElement | null>(null);
  const latest = useStableCallback(() => props);
  const lastFocused = useRef<HTMLElement | null>(null);
  const focusEdge = useStableCallback((end: boolean) => {
    const popup = context.elements.floating;
    if (!popup) return;
    const tabbables = getTabbableElements(popup).filter((element) => !element.hasAttribute("data-base-ui-focus-guard"));
    (end ? (tabbables.at(-1) ?? popup) : (tabbables[0] ?? popup)).focus({ preventScroll: true });
  });
  const leave = (backwards: boolean) => {
    const override = backwards ? props.previousFocusableElement : props.nextFocusableElement;
    const explicit = override && "current" in override ? override.current : override;
    const reference = context.elements.domReference;
    const popup = context.elements.floating;
    const elements = popup
      ? getTabbableElements(popup.ownerDocument.body).filter(
          (element) => !popup.contains(element) && !element.hasAttribute("data-base-ui-focus-guard"),
        )
      : [];
    const index = elements.indexOf(reference as HTMLElement);
    const next = explicit ?? (backwards ? (reference as HTMLElement | null) : elements[index + 1]);
    next?.focus();
  };
  useIsoLayoutEffect(() => {
    const popup = context.elements.floating;
    if (disabled || !context.open || !popup || typeof window === "undefined") return undefined;
    const doc = popup.ownerDocument;
    const previous = isHTMLElement(doc.activeElement) ? doc.activeElement : null;
    const originalTabIndex = popup.getAttribute("tabindex");
    if (originalTabIndex === null) popup.tabIndex = -1;
    let active = true;
    let redirecting = false;
    let stack = focusLayers.get(doc);
    if (!stack) {
      stack = [];
      focusLayers.set(doc, stack);
    }
    const layer = { context: () => latest().context, floating: popup };
    stack.push(layer);
    const isTop = () => {
      const current = latest().context;
      if (
        current.nodeId &&
        current.tree
          ?.descendants(current.nodeId)
          .some((node) => node.context.open && stack.some((entry) => entry.context().nodeId === node.id))
      )
        return false;
      return (
        stack
          .filter((entry) => {
            const context = entry.context();
            return (
              !context.nodeId ||
              !context.tree
                ?.descendants(context.nodeId)
                .some((node) => node.context.open && stack.some((entry) => entry.context().nodeId === node.id))
            );
          })
          .at(-1) === layer
      );
    };
    const inside = () => [
      ...getFloatingInsideElements(latest().context),
      ...(latest().getInsideElements?.() ?? []).filter((e): e is Element => Boolean(e)),
    ];
    const within = (target: EventTarget | null) =>
      isNode(target) &&
      [
        ...inside().filter(
          (element) => !modal || latest().referenceInside || element !== latest().context.elements.domReference,
        ),
        portal?.beforeOutsideRef.current,
        portal?.afterOutsideRef.current,
        beforeInsideRef.current,
        afterInsideRef.current,
      ].some((element) => element?.contains(target));
    const focusInside = () => {
      const items = getTabbableElements(popup).filter((element) => !element.hasAttribute("data-base-ui-focus-guard"));
      return items[0] ?? popup;
    };
    // Wait until all refs (including a parent's trigger ref) are attached.
    queueMicrotask(() => {
      if (!active) return;
      const current = latest();
      const target = resolve(
        current.initialFocus ?? true,
        current.openInteractionType ?? interaction(current.context.dataRef.current.openEvent),
        focusInside(),
      );
      if (target && !popup.contains(doc.activeElement)) target.focus({ preventScroll: true });
    });
    // Each nested portal lives within its parent's host, so it remains accessible through parent locks.
    const outsideElements = () => [
      popup,
      ...inside().filter((element) => latest().referenceInside || element !== context.elements.domReference),
      ...[beforeInsideRef.current, afterInsideRef.current].filter(
        (element): element is HTMLSpanElement => element != null,
      ),
    ];
    const release = modal
      ? markOthers(outsideElements(), { inert: latest().outsideElementsInert !== false, ariaHidden: true })
      : null;
    const outsideObserver = new MutationObserver(() => {
      release?.update(outsideElements());
    });
    if (modal) outsideObserver.observe(doc.body, { childList: true, subtree: true });
    const keydown = (event: KeyboardEvent) => {
      if (!modal || !isTop() || event.key !== "Tab") return;
      const tabbables = inside()
        .filter((element) => element !== latest().context.elements.domReference)
        .flatMap((element) => getTabbableElements(element))
        .filter((element) => !element.hasAttribute("data-base-ui-focus-guard"));
      const unique = [...new Set(tabbables)];
      const first = unique[0] ?? popup;
      const last = unique.at(-1) ?? popup;
      if (
        !unique.length ||
        (event.shiftKey
          ? doc.activeElement === first || doc.activeElement === popup
          : doc.activeElement === last || doc.activeElement === popup)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };
    const focusin = (event: FocusEvent) => {
      if (!isTop() || redirecting) return;
      if (within(event.target)) {
        if (isHTMLElement(event.target)) lastFocused.current = event.target;
        return;
      }
      if (modal) {
        redirecting = true;
        (lastFocused.current?.isConnected ? lastFocused.current : focusInside()).focus({ preventScroll: true });
        redirecting = false;
      } else if (latest().closeOnFocusOut !== false) latest().context.onOpenChange(false, event, "focus-out");
    };
    const observer = new MutationObserver(() => {
      if (!active || !isTop() || !latest().restoreFocus || !lastFocused.current || lastFocused.current.isConnected)
        return;
      (latest().restoreFocus === "popup" ? popup : focusInside()).focus({ preventScroll: true });
    });
    observer.observe(popup, { childList: true, subtree: true });
    doc.addEventListener("keydown", keydown);
    doc.addEventListener("focusin", focusin);
    return () => {
      active = false;
      observer.disconnect();
      outsideObserver.disconnect();
      doc.removeEventListener("keydown", keydown);
      doc.removeEventListener("focusin", focusin);
      const wasTop = isTop();
      stack.splice(stack.indexOf(layer), 1);
      release?.();
      if (originalTabIndex === null) popup.removeAttribute("tabindex");
      queueMicrotask(() => {
        if (!wasTop) return;
        const current = latest();
        // Clicking or tabbing onto another control keeps its focus.
        const focused = doc.activeElement;
        if (
          focused &&
          focused !== doc.body &&
          !popup.contains(focused) &&
          focused !== current.context.elements.domReference
        )
          return;
        const reference = current.context.elements.domReference;
        const fallback =
          isHTMLElement(reference) && reference.isConnected ? reference : previous?.isConnected ? previous : null;
        const target = resolve(
          current.returnFocus ?? true,
          interaction(current.context.dataRef.current.closeEvent),
          fallback,
        );
        if (target?.isConnected) target.focus({ preventScroll: true });
      });
    };
  }, [context.open, context.elements.floating, disabled, modal, props.outsideElementsInert, latest]);
  useIsoLayoutEffect(() => {
    if (!portal || disabled || modal || !context.open) return undefined;
    portal.setFocusHandlers({ first: () => focusEdge(false), last: () => focusEdge(true) });
    return () => portal.setFocusHandlers(null);
  }, [portal?.setFocusHandlers, disabled, modal, context.open, focusEdge]);
  if (disabled || !context.open) return children;
  return (
    <>
      <FocusGuard
        ref={(element) => {
          beforeInsideRef.current = element;
          if (props.beforeContentFocusGuardRef) props.beforeContentFocusGuardRef.current = element;
        }}
        onFocus={(event) =>
          modal
            ? focusEdge(true)
            : context.elements.floating?.contains(event.relatedTarget as Node)
              ? leave(true)
              : focusEdge(false)
        }
      />
      {children}
      <FocusGuard
        ref={afterInsideRef}
        onFocus={(event) =>
          modal
            ? focusEdge(false)
            : context.elements.floating?.contains(event.relatedTarget as Node)
              ? leave(false)
              : focusEdge(true)
        }
        onKeyDown={(event) => {
          if (!modal && event.key === "Tab" && event.shiftKey) {
            event.preventDefault();
            leave(true);
          }
        }}
      />
    </>
  );
}