import type { VirtualElement } from "@floating-ui/react-dom";
import type { RefObject } from "preact";
import { useMemo, useRef } from "preact/hooks";

import { createChangeEventDetails, type BaseUIChangeEventDetails } from "./createBaseUIEventDetails";
import { useFloatingParentNodeId, useFloatingTree } from "./FloatingTree";
import type { FloatingTreeStore } from "./FloatingTreeStore";
import { isNode } from "./owner";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useStableCallback } from "./useStableCallback";

export type FloatingChangeReason = "escape-key" | "outside-press" | "focus-out" | "trigger-press";
export interface FloatingRootContext {
  open: boolean;
  elements: { reference: Element | VirtualElement | null; floating: HTMLElement | null; domReference: Element | null };
  dataRef: RefObject<{ openEvent?: Event; closeEvent?: Event; closeReason?: FloatingChangeReason }>;
  nodeId?: string;
  tree: FloatingTreeStore | null;
  onOpenChange(
    open: boolean,
    event: Event,
    reason: FloatingChangeReason,
  ): BaseUIChangeEventDetails<FloatingChangeReason>;
}
export interface FloatingRootContextOptions {
  open: boolean;
  elements: { reference: Element | VirtualElement | null; floating: HTMLElement | null };
  nodeId?: string;
  externalTree?: FloatingTreeStore;
  onOpenChange?: (open: boolean, details: BaseUIChangeEventDetails<FloatingChangeReason>) => void;
}
export function useFloatingRootContext(options: FloatingRootContextOptions): FloatingRootContext {
  const parentId = useFloatingParentNodeId();
  const inheritedTree = useFloatingTree();
  const tree = options.externalTree ?? inheritedTree;
  const dataRef = useRef<FloatingRootContext["dataRef"]["current"]>({});
  const change = useStableCallback((open: boolean, event: Event, reason: FloatingChangeReason) => {
    const reference = options.elements.reference;
    const domReference = reference && "nodeType" in reference ? (reference as Element) : null;
    const details = createChangeEventDetails(reason, event, domReference ?? undefined);
    options.onOpenChange?.(open, details);
    if (!details.isCanceled) {
      if (open) {
        dataRef.current.openEvent = event;
        dataRef.current.closeReason = undefined;
      } else {
        dataRef.current.closeEvent = event;
        dataRef.current.closeReason = reason;
      }
    }
    return details;
  });
  const reference = options.elements.reference;
  const domReference =
    reference && "nodeType" in reference ? (reference as Element) : (reference?.contextElement ?? null);
  const context = useMemo(
    () => ({
      open: options.open,
      elements: { ...options.elements, domReference },
      dataRef,
      nodeId: options.nodeId,
      tree,
      onOpenChange: change,
    }),
    [options.open, options.elements.reference, options.elements.floating, domReference, options.nodeId, tree, change],
  );
  useIsoLayoutEffect(() => {
    if (tree && context.nodeId) return tree.register({ id: context.nodeId, parentId, context });
    return undefined;
  }, [tree, context, parentId]);
  return context;
}
export function getFloatingInsideElements(context: FloatingRootContext): Element[] {
  return [
    context.elements.domReference,
    context.elements.floating,
    ...(context.nodeId
      ? (context.tree
          ?.descendants(context.nodeId)
          .filter((node) => node.context.open)
          .flatMap((node) => [node.context.elements.domReference, node.context.elements.floating]) ?? [])
      : []),
  ].filter((element): element is Element => element != null);
}
export function containsEvent(elements: Element[], event: Event) {
  const path = event.composedPath();
  return elements.some((element) => path.includes(element) || (isNode(event.target) && element.contains(event.target)));
}