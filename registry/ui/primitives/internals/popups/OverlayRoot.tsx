import { useEffect, useMemo, useRef, useState } from "preact/hooks";

import { createChangeEventDetails } from "../createBaseUIEventDetails";
import { FloatingNode, FloatingTree, useFloatingNodeId, useFloatingTree } from "../FloatingTree";
import { useControlled } from "../useControlled";
import { useDismiss } from "../useDismiss";
import { useFloatingRootContext } from "../useFloatingRootContext";
import { useIsoLayoutEffect } from "../useIsoLayoutEffect";
import { useOpenChangeComplete } from "../useOpenChangeComplete";
import { useScrollLock } from "../useScrollLock";
import { useStableCallback } from "../useStableCallback";
import { useTransitionStatus } from "../useTransitionStatus";
import {
  OverlayContext,
  useOverlayContext,
  type OverlayKind,
  type OverlayRootProps,
  type OverlayReason,
  type OverlayChangeDetails,
  type NestedPopup,
} from "./OverlayContext";
import { PopupHandle } from "./PopupHandle";

export function OverlayRoot<Payload>(props: OverlayRootProps<Payload> & { kind: OverlayKind }) {
  const tree = useFloatingTree();

  if (!tree) {
    return (
      <FloatingTree>
        <OverlayRootInner {...props} />
      </FloatingTree>
    );
  }

  return <OverlayRootInner {...props} />;
}

function OverlayRootInner<Payload>({
  kind,
  ...props
}: OverlayRootProps<Payload> & { kind: OverlayKind }) {
  const parent = useOverlayContext(true) ?? null;
  const dialog = kind === "dialog" || kind === "alert-dialog" || kind === "drawer";
  const modal = kind === "alert-dialog" ? true : (props.modal ?? dialog);
  const id = useFloatingNodeId();
  const [open, setOpen] = useControlled({
    controlled: props.open,
    default: props.defaultOpen ?? false,
    name: kind,
  });
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
  const [reference, setReference] = useState<HTMLElement | null>(null);
  const [popup, setPopup] = useState<HTMLElement | null>(null);
  const popupRef = useRef<HTMLElement | null>(null);
  const setPopupElement = useStableCallback((element: HTMLElement | null) => {
    popupRef.current = element;
    setPopup(element);
  });
  const [backdrop, setBackdrop] = useState<HTMLElement | null>(null);
  const [viewport, setViewport] = useState<HTMLElement | null>(null);
  const [titleId, setTitleId] = useState<string | undefined>();
  const [descriptionId, setDescriptionId] = useState<string | undefined>();
  const [popupId, setPopupId] = useState(`${id}-popup`);
  const [triggerId, setTriggerId] = useState<string | null>(props.defaultTriggerId ?? null);
  const [payload, setPayload] = useState<Payload | undefined>();
  const [nestedPopups, setNestedPopups] = useState(new Map<string, NestedPopup>());
  const internalHandle = useRef(new PopupHandle<Payload>());
  const handle = props.handle ?? internalHandle.current;
  const activeTriggerId = props.triggerId !== undefined ? props.triggerId : triggerId;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const closeDelay = useRef(kind === "preview-card" ? 300 : 0);
  const preventUnmount = useRef(false);
  const hoverCleanup = useRef<(() => void) | null>(null);
  const cancelTimers = useStableCallback(() => {
    clearTimeout(timer.current);

    hoverCleanup.current?.();
    hoverCleanup.current = null;
  });
  const change = useStableCallback(
    (
      next: boolean,
      event: Event,
      reason: OverlayReason,
      trigger?: HTMLElement,
      triggerPayload?: unknown,
    ): OverlayChangeDetails => {
      cancelTimers();
      let prevented = false;
      const details = createChangeEventDetails(reason, event, trigger ?? reference ?? undefined, {
        preventUnmountOnClose() {
          prevented = true;
        },
      });
      props.onOpenChange?.(next, details);

      if (!details.isCanceled) {
        preventUnmount.current = !next && prevented;

        if (next && trigger) {
          setReference(trigger);

          setTriggerId(trigger.id);

          setPayload(triggerPayload as Payload);
        }

        setOpen(next);

        if (next) {
          floatingContext.dataRef.current.openEvent = event;
        } else {
          floatingContext.dataRef.current.closeEvent = event;
          floatingContext.dataRef.current.closeReason =
            reason as typeof floatingContext.dataRef.current.closeReason;
        }
      }

      return details;
    },
  );
  const schedule = useStableCallback(
    (
      next: boolean,
      event: Event,
      reason: OverlayReason,
      delay: number,
      trigger?: HTMLElement,
      payload?: unknown,
    ) => {
      cancelTimers();

      if (delay <= 0) {
        change(next, event, reason, trigger, payload);
      } else {
        timer.current = setTimeout(() => change(next, event, reason, trigger, payload), delay);
      }
    },
  );
  const floatingContext = useFloatingRootContext({
    open,
    nodeId: id,
    elements: { reference, floating: popup },
    onOpenChange(next, details) {
      const result = change(next, details.event, details.reason);

      if (result.isCanceled) {
        details.cancel();
      }

      if (result.isPropagationAllowed) {
        details.allowPropagation();
      }
    },
  });
  useDismiss(floatingContext, {
    enabled: kind !== "tooltip" || !props.disabled,
    outsidePress: kind !== "alert-dialog" && !props.disablePointerDismissal,
    outsidePressEvent: "intentional",
    bubbles: { escapeKey: false, outsidePress: !dialog },
  });

  useScrollLock(modal === true && mounted, reference);

  useOpenChangeComplete({
    open,
    ref: popupRef,
    enabled: mounted && Boolean(popup),
    onComplete() {
      props.onOpenChangeComplete?.(open);

      if (!open && !preventUnmount.current) {
        setMounted(false);
      }
    },
  });
  const registerNested = useStableCallback((childId: string, child: NestedPopup) => {
    setNestedPopups((previous) => {
      const next = new Map(previous);
      next.set(childId, child);
      return next;
    });
    return () =>
      setNestedPopups((previous) => {
        const next = new Map(previous);
        next.delete(childId);
        return next;
      });
  });
  useIsoLayoutEffect(
    () =>
      parent?.registerNested(id, { kind, open: mounted, height: 0, swiping: false, progress: 0 }),
    [parent?.registerNested, id, kind, mounted],
  );

  useIsoLayoutEffect(() => {
    if (activeTriggerId) {
      const trigger = handle.triggers.get(activeTriggerId);

      if (trigger) {
        setReference(trigger.element);

        setPayload(trigger.payload);
      }
    }
  }, [activeTriggerId, handle, mounted]);

  useIsoLayoutEffect(() => {
    if (!props.actionsRef) {
      return undefined;
    }

    props.actionsRef.current = {
      close: () => change(false, new Event("base-ui"), "imperative-action"),
      unmount: () => {
        preventUnmount.current = false;
        setMounted(false);
      },
    };
    return () => {
      if (props.actionsRef) {
        props.actionsRef.current = null;
      }
    };
  }, [props.actionsRef, change, setMounted]);

  useEffect(() => cancelTimers, [cancelTimers]);
  const context = useMemo(
    () => ({
      kind,
      open,
      mounted,
      transitionStatus,
      modal,
      disabled: props.disabled ?? false,
      disablePointerDismissal: props.disablePointerDismissal ?? false,
      disableHoverablePopup: props.disableHoverablePopup ?? false,
      id,
      popupId,
      activeTriggerId,
      reference,
      setReference,
      popupRef,
      setPopup: setPopupElement,
      backdrop,
      setBackdrop,
      viewport,
      setViewport,
      titleId,
      setTitleId,
      descriptionId,
      setDescriptionId,
      setPopupId,
      floatingContext,
      handle,
      change,
      schedule,
      cancelTimers,
      closeDelay,
      hoverCleanup,
      nested: Boolean(parent && dialog),
      nestedPopups,
      registerNested,
      parent,
    }),
    [
      kind,
      open,
      mounted,
      transitionStatus,
      modal,
      props.disabled,
      props.disablePointerDismissal,
      props.disableHoverablePopup,
      id,
      popupId,
      activeTriggerId,
      reference,
      backdrop,
      viewport,
      titleId,
      descriptionId,
      floatingContext,
      handle,
      change,
      schedule,
      cancelTimers,
      nestedPopups,
      registerNested,
      parent,
    ],
  );
  // A mutable association keeps detached triggers current without React store selectors.
  useIsoLayoutEffect(() => {
    handle.context = context;
    handle.notify();
  });

  useIsoLayoutEffect(
    () => () => {
      handle.context = null;
      handle.notify();
    },
    [handle],
  );
  const children = typeof props.children === "function" ? props.children(payload) : props.children;
  return (
    <OverlayContext.Provider value={context}>
      <FloatingNode id={id}>{children}</FloatingNode>
    </OverlayContext.Provider>
  );
}
