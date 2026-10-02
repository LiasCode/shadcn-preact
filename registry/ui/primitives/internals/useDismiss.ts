import { containsEvent, getFloatingInsideElements, type FloatingRootContext } from "./useFloatingRootContext";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

type PressType = "intentional" | "sloppy";
export interface UseDismissProps {
  enabled?: boolean;
  escapeKey?: boolean;
  referencePress?: () => boolean;
  outsidePress?: boolean | ((event: MouseEvent | TouchEvent) => boolean);
  outsidePressEvent?:
    | PressType
    | { mouse: PressType; touch: PressType }
    | (() => PressType | { mouse: PressType; touch: PressType });
  bubbles?: boolean | { escapeKey?: boolean; outsidePress?: boolean };
}
interface Layer {
  get: () => { context: FloatingRootContext; options: UseDismissProps };
}
const layers = new WeakMap<Document, Layer[]>();
const handled = new WeakSet<Event>();
export function normalizeProp(value?: UseDismissProps["bubbles"]) {
  return typeof value === "boolean"
    ? { escapeKey: value, outsidePress: value }
    : { escapeKey: value?.escapeKey ?? false, outsidePress: value?.outsidePress ?? true };
}
export function useDismiss(context: FloatingRootContext, options: UseDismissProps = {}) {
  const { enabled = true } = options;
  const getLayer = useStableCallback(() => ({ context, options }));
  useIsoLayoutEffect(() => {
    if (!enabled || !context.open || typeof window === "undefined") return undefined;
    const doc =
      context.elements.floating?.ownerDocument ?? context.elements.domReference?.ownerDocument ?? window.document;
    let stack = layers.get(doc);
    if (!stack) {
      stack = [];
      layers.set(doc, stack);
    }
    // Keep stacking order stable across ref/state updates.
    const entry: Layer = { get: getLayer };
    stack.push(entry);
    let press: {
      inside: boolean;
      x: number;
      y: number;
      time: number;
      type: string;
      distance: number;
      event: PointerEvent;
    } | null = null;
    let composing = false;
    const isTop = () =>
      stack
        .filter((layer) => {
          const current = layer.get().context;
          return (
            !current.nodeId ||
            !current.tree
              ?.descendants(current.nodeId)
              .some((node) => node.context.open && stack.some((layer) => layer.get().context.nodeId === node.id))
          );
        })
        .at(-1) === entry;
    const dismissChain = () => {
      const current = getLayer().context;
      const ancestors = new Set<string>();
      let parent = current.nodeId ? current.tree?.nodes.get(current.nodeId)?.parentId : null;
      while (parent && !ancestors.has(parent)) {
        ancestors.add(parent);
        parent = current.tree?.nodes.get(parent)?.parentId;
      }
      return [
        entry,
        ...stack
          .filter((layer) => {
            if (layer === entry) return false;
            const candidate = layer.get().context;
            return (
              (candidate.nodeId && ancestors.has(candidate.nodeId)) ||
              Boolean(
                current.elements.domReference && candidate.elements.floating?.contains(current.elements.domReference),
              )
            );
          })
          .reverse(),
      ];
    };
    const escape = (event: KeyboardEvent) => {
      if (!isTop() || handled.has(event) || event.key !== "Escape" || event.isComposing || composing) return;
      handled.add(event);
      for (const layer of dismissChain()) {
        const current = layer.get();
        if (current.options.escapeKey === false) break;
        const details = current.context.onOpenChange(false, event, "escape-key");
        if (details.isCanceled) break;
        event.preventDefault();
        if (!normalizeProp(current.options.bubbles).escapeKey && !details.isPropagationAllowed) {
          event.stopPropagation();
          break;
        }
      }
    };
    const outside = (event: PointerEvent, down: boolean) => {
      if (!isTop() || handled.has(event) || event.button !== 0) return;
      const currentEntry = getLayer();
      const modeProp = currentEntry.options.outsidePressEvent;
      const mode = typeof modeProp === "function" ? modeProp() : modeProp;
      const type = event.pointerType === "touch" ? "touch" : "mouse";
      const policy = typeof mode === "object" ? mode[type] : (mode ?? "sloppy");
      const immediate = type === "mouse" && policy === "sloppy";
      if (down !== immediate) return;
      if (
        !down &&
        (!press ||
          press.inside ||
          press.type !== event.pointerType ||
          Date.now() - press.time > 1000 ||
          Math.max(press.distance, Math.hypot(event.clientX - press.x, event.clientY - press.y)) >
            (policy === "intentional" ? 5 : 10))
      )
        return;
      // Ignore native scrollbar interaction, including a horizontal scrollbar.
      const html = doc.documentElement;
      if (
        (html.clientWidth && event.clientX >= html.clientWidth) ||
        (html.clientHeight && event.clientY >= html.clientHeight)
      )
        return;
      handled.add(event);
      for (const layer of dismissChain()) {
        const current = layer.get();
        if (containsEvent(getFloatingInsideElements(current.context), event)) break;
        const guard = current.options.outsidePress;
        if (guard === false || (typeof guard === "function" && !guard(event))) break;
        const details = current.context.onOpenChange(false, event, "outside-press");
        if (
          details.isCanceled ||
          (!normalizeProp(current.options.bubbles).outsidePress && !details.isPropagationAllowed)
        )
          break;
      }
    };
    const down = (event: PointerEvent) => {
      press = {
        inside: containsEvent(getFloatingInsideElements(getLayer().context), event),
        x: event.clientX,
        y: event.clientY,
        time: Date.now(),
        type: event.pointerType,
        distance: 0,
        event,
      };
      outside(event, true);
    };
    const move = (event: PointerEvent) => {
      if (press && press.type === event.pointerType)
        press.distance = Math.max(press.distance, Math.hypot(event.clientX - press.x, event.clientY - press.y));
    };
    const scroll = () => {
      if (!press || press.type !== "touch" || press.inside) return;
      const modeProp = getLayer().options.outsidePressEvent;
      const mode = typeof modeProp === "function" ? modeProp() : modeProp;
      const policy = typeof mode === "object" ? mode.touch : (mode ?? "sloppy");
      if (policy === "sloppy") {
        press.distance = 0;
        outside(press.event, false);
        press = null;
      }
    };
    const up = (event: PointerEvent) => {
      outside(event, false);
      press = null;
    };
    const cancel = () => {
      press = null;
    };
    const compositionStart = () => {
      clearTimeout(compositionTimer);
      composing = true;
    };
    let compositionTimer: ReturnType<typeof setTimeout> | undefined;
    const compositionEnd = () => {
      compositionTimer = setTimeout(() => {
        composing = false;
      }, 5);
    };
    doc.addEventListener("keydown", escape);
    doc.addEventListener("pointerdown", down);
    doc.addEventListener("pointerup", up);
    doc.addEventListener("pointermove", move);
    doc.addEventListener("scroll", scroll, true);
    doc.addEventListener("pointercancel", cancel);
    doc.addEventListener("compositionstart", compositionStart);
    doc.addEventListener("compositionend", compositionEnd);
    return () => {
      clearTimeout(compositionTimer);
      stack.splice(stack.indexOf(entry), 1);
      doc.removeEventListener("keydown", escape);
      doc.removeEventListener("pointerdown", down);
      doc.removeEventListener("pointerup", up);
      doc.removeEventListener("pointermove", move);
      doc.removeEventListener("scroll", scroll, true);
      doc.removeEventListener("pointercancel", cancel);
      doc.removeEventListener("compositionstart", compositionStart);
      doc.removeEventListener("compositionend", compositionEnd);
    };
  }, [enabled, context.open, context.elements.domReference?.ownerDocument, getLayer]);
  return {
    reference: {
      onClick(event: MouseEvent) {
        if (enabled && context.open && options.referencePress?.()) context.onOpenChange(false, event, "trigger-press");
      },
    },
  };
}