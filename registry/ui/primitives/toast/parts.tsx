import { createContext, type ComponentChildren } from "preact";
import { useContext, useEffect, useRef, useState } from "preact/hooks";

import { FloatingPortal } from "../internals/FloatingPortal";
import { getElementProps } from "../internals/popups/getElementProps";
import { transitionStatusMapping } from "../internals/stateAttributesMapping";
import {
  createToastManager,
  type ToastManager,
  type ToastObject,
  type ToastManagerEvent,
} from "../internals/ToastManager";
import type { BaseUIComponentProps, NativeButtonProps } from "../internals/types";
import { useAnimationsFinished } from "../internals/useAnimationsFinished";
import { useButton } from "../internals/useButton";
import { useBaseUiId } from "../internals/useId";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";
export { createToastManager };
export type { ToastObject };

interface ToastContextValue {
  toasts: ToastObject[];
  manager: ToastManager;
  limit: number;
  expanded: boolean;
  setExpanded(value: boolean): void;
  paused: boolean;
  pause(value: boolean, reason?: "hover" | "focus" | "window" | "visibility" | "swipe"): void;
  remove(id: string): void;
  measure(id: string, height: number): void;
}

const Context = createContext<ToastContextValue | null>(null);

function useToasts() {
  const c = useContext(Context);

  if (!c) {
    throw new Error("Base UI: Toast parts require Provider.");
  }

  return c;
}

interface Timer {
  handle?: ReturnType<typeof setTimeout>;
  started: number;
  remaining: number;
}

export function Provider({
  children,
  toastManager,
  timeout = 5000,
  limit = 3,
}: {
  children?: ComponentChildren;
  toastManager?: ToastManager;
  timeout?: number;
  limit?: number;
}) {
  const local = useRef(createToastManager());
  const manager = toastManager ?? local.current;
  const [toasts, setToasts] = useState<ToastObject[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [paused, setPaused] = useState(false);
  const timers = useRef(new Map<string, Timer>());
  const pausedReasons = useRef(new Set<string>());
  const remove = useStableCallback((id: string) => {
    clearTimeout(timers.current.get(id)?.handle);

    timers.current.delete(id);

    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      toast?.onRemove?.();
      return prev.filter((t) => t.id !== id);
    });
  });
  const pause = useStableCallback((value: boolean, reason = "hover") => {
    const wasPaused = pausedReasons.current.size > 0;

    if (value) {
      pausedReasons.current.add(reason);
    } else {
      pausedReasons.current.delete(reason);
    }

    const isPaused = pausedReasons.current.size > 0;

    if (isPaused === wasPaused) {
      return;
    }

    setPaused(isPaused);

    for (const [id, timer] of timers.current) {
      if (isPaused) {
        clearTimeout(timer.handle);
        timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started));
        timer.handle = undefined;
      } else {
        timer.started = Date.now();
        timer.handle = setTimeout(() => manager.close(id), timer.remaining);
      }
    }
  });
  const receive = useStableCallback(({ action, options }: ToastManagerEvent) => {
    if (action === "close") {
      setToasts((prev) =>
        prev.map((t) => {
          if (t.transitionStatus === "ending" || (options.id && options.id !== t.id)) {
            return t;
          }

          clearTimeout(timers.current.get(t.id)?.handle);

          timers.current.delete(t.id);

          t.onClose?.();
          return { ...t, transitionStatus: "ending" };
        }),
      );
      return;
    }

    setToasts((prev) => {
      const existing = prev.find((t) => t.id === options.id);

      if (action === "update" && !existing) {
        return prev;
      }

      const toast: ToastObject = {
        ...existing,
        ...options,
        updateKey: (existing?.updateKey ?? 0) + 1,
        transitionStatus: existing ? undefined : "starting",
      };
      clearTimeout(timers.current.get(toast.id)?.handle);

      timers.current.delete(toast.id);
      const duration = toast.timeout ?? timeout;

      if (duration > 0 && toast.type !== "loading") {
        const timer: Timer = { remaining: duration, started: Date.now() };

        if (pausedReasons.current.size === 0) {
          timer.handle = setTimeout(() => manager.close(toast.id), duration);
        }

        timers.current.set(toast.id, timer);
      }

      return existing ? prev.map((t) => (t.id === toast.id ? toast : t)) : [toast, ...prev];
    });
  });
  useIsoLayoutEffect(() => manager[" subscribe"](receive), [manager, receive]);

  useEffect(
    () => () => {
      for (const timer of timers.current.values()) {
        clearTimeout(timer.handle);
      }

      timers.current.clear();
    },
    [manager],
  );
  const measure = useStableCallback((id: string, height: number) =>
    setToasts((prev) =>
      prev.map((t) => (t.id === id && t.height !== height ? { ...t, height } : t)),
    ),
  );
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const blur = () => pause(true, "window"),
      focus = () => pause(false, "window");

    const visibility = () => pause(document.hidden, "visibility");

    window.addEventListener("blur", blur);

    window.addEventListener("focus", focus);

    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("blur", blur);

      window.removeEventListener("focus", focus);

      document.removeEventListener("visibilitychange", visibility);
    };
  }, [pause]);
  return (
    <Context.Provider
      value={{ toasts, manager, limit, expanded, setExpanded, paused, pause, remove, measure }}
    >
      {children}
    </Context.Provider>
  );
}

export namespace Provider {
  export type Props = Parameters<typeof Provider>[0];
}

export function useToastManager<D extends object = any>() {
  const c = useToasts();
  return {
    toasts: c.toasts as ToastObject<D>[],
    add: c.manager.add,
    update: c.manager.update,
    close: c.manager.close,
    promise: c.manager.promise,
  };
}

export function Portal(props: FloatingPortal.Props) {
  return <FloatingPortal {...props} />;
}

export namespace Portal {
  export type Props = FloatingPortal.Props;
}

export function Viewport(props: BaseUIComponentProps<"div", { expanded: boolean }>) {
  const c = useToasts();
  const hovering = useRef(false),
    focused = useRef(false);
  return useRenderElement("div", props, {
    state: { expanded: c.expanded },
    ref: props.ref,
    props: [
      {
        role: "region",
        "aria-label": "Notifications",
        tabIndex: -1,
        onPointerEnter() {
          hovering.current = true;
          c.setExpanded(true);

          c.pause(true, "hover");
        },
        onPointerLeave() {
          hovering.current = false;
          c.setExpanded(focused.current);

          c.pause(false, "hover");
        },
        onFocus() {
          focused.current = true;
          c.setExpanded(true);

          c.pause(true, "focus");
        },
        onBlur(event: FocusEvent) {
          if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
            focused.current = false;
            c.setExpanded(hovering.current);

            c.pause(false, "focus");
          }
        },
        onKeyDown(event: KeyboardEvent) {
          if (event.key === "Escape") {
            c.manager.close();
          }
        },
      },
      getElementProps(props),
    ],
  });
}

export namespace Viewport {
  export type Props = Parameters<typeof Viewport>[0];
}

interface ToastState {
  expanded: boolean;
  limited: boolean;
  type?: string;
  transitionStatus?: "starting" | "ending";
  swiping: boolean;
  swipeDirection?: string;
}

interface RootContextValue {
  toast: ToastObject;
  titleId: string;
  descriptionId: string;
  setTitleId(id: string | undefined): void;
  setDescriptionId(id: string | undefined): void;
  index: number;
  state: ToastState;
}

const RootContext = createContext<RootContextValue | null>(null);

function useToast() {
  const c = useContext(RootContext);

  if (!c) {
    throw new Error("Base UI: Toast parts require Root.");
  }

  return c;
}

export function Root({
  toast,
  swipeDirection = ["down", "right"],
  ...props
}: BaseUIComponentProps<"div", ToastState> & {
  toast: ToastObject;
  swipeDirection?: "up" | "down" | "left" | "right" | ("up" | "down" | "left" | "right")[];
}) {
  const c = useToasts(),
    element = useRef<HTMLElement | null>(null);
  const id = useBaseUiId(props.id);
  const [titleId, setTitleId] = useState<string>();
  const [descriptionId, setDescriptionId] = useState<string>();
  const index = c.toasts.findIndex((t) => t.id === toast.id);
  const [starting, setStarting] = useState(true);
  const [swipe, setSwipe] = useState({ x: 0, y: 0, direction: undefined as string | undefined });
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const state: ToastState = {
    expanded: c.expanded,
    limited: index >= c.limit,
    type: toast.type,
    transitionStatus:
      toast.transitionStatus === "ending" ? "ending" : starting ? "starting" : undefined,
    swiping: !!drag.current,
    swipeDirection: swipe.direction,
  };
  const animations = useAnimationsFinished(element);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const frame = requestAnimationFrame(() => setStarting(false));
    return () => cancelAnimationFrame(frame);
  }, []);

  useIsoLayoutEffect(() => {
    if (toast.transitionStatus !== "ending") {
      return;
    }

    return animations(() => c.remove(toast.id));
  }, [toast.transitionStatus, toast.id, c.remove, animations]);

  useIsoLayoutEffect(() => {
    const node = element.current;

    if (!node) {
      return;
    }
    // CSS fixes the stack height and adds an overflow gap pseudo-element. Measure natural border-box height,
    // not scrollHeight: feeding that gap back into the height would grow the toast on every observer delivery.
    const measure = () => {
      const height = node.style.height,
        transition = node.style.transition;
      node.style.transition = "none";
      node.style.height = "auto";
      const naturalHeight = node.offsetHeight;
      node.style.height = height;
      node.style.transition = transition;
      c.measure(toast.id, naturalHeight);
    };

    measure();
    let width = node.offsetWidth;
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            if (width !== node.offsetWidth) {
              width = node.offsetWidth;
              measure();
            }
          })
        : null;
    observer?.observe(node);
    const mutations =
      typeof MutationObserver !== "undefined" ? new MutationObserver(measure) : null;
    mutations?.observe(node, { childList: true, subtree: true, characterData: true });
    return () => {
      observer?.disconnect();

      mutations?.disconnect();
    };
  }, [toast.id, toast.updateKey, c.measure]);
  const node = useRenderElement("div", props, {
    state,
    stateAttributesMapping: {
      ...transitionStatusMapping,
      swipeDirection: (value) => (value ? { "data-swipe-direction": value } : null),
    },
    ref: [props.ref ?? null, element],
    props: [
      {
        id,
        role: toast.priority === "high" ? "alert" : "status",
        "aria-live": toast.priority === "high" ? "assertive" : "polite",
        "aria-atomic": true,
        "aria-labelledby": titleId,
        "aria-describedby": descriptionId,
        tabIndex: 0,
        style: {
          "--toast-index": index,
          "--toast-height": `${toast.height ?? 0}px`,
          "--toast-frontmost-height": `${c.toasts[0]?.height ?? 0}px`,
          "--toast-offset-y": `${c.toasts.slice(0, index).reduce((sum, t) => sum + (t.height ?? 0), 0)}px`,
          "--toast-swipe-movement-x": `${swipe.x}px`,
          "--toast-swipe-movement-y": `${swipe.y}px`,
        },
        onPointerDown(event: PointerEvent) {
          if (event.button !== 0 || (event.target as HTMLElement).closest("button,a,input")) {
            return;
          }

          drag.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
          element.current?.setPointerCapture?.(event.pointerId);

          c.pause(true, "swipe");
        },
        onPointerMove(event: PointerEvent) {
          if (!drag.current || drag.current.id !== event.pointerId) {
            return;
          }

          const x = event.clientX - drag.current.x,
            y = event.clientY - drag.current.y;
          setSwipe({ x, y, direction: undefined });
        },
        onPointerUp(event: PointerEvent) {
          if (!drag.current) {
            return;
          }

          const x = event.clientX - drag.current.x,
            y = event.clientY - drag.current.y;
          drag.current = null;
          const direction =
            Math.abs(x) > Math.abs(y) ? (x > 0 ? "right" : "left") : y > 0 ? "down" : "up";

          if (
            Math.max(Math.abs(x), Math.abs(y)) > 40 &&
            (Array.isArray(swipeDirection) ? swipeDirection : [swipeDirection]).includes(direction)
          ) {
            setSwipe({ x, y, direction });

            c.manager.close(toast.id);
          } else {
            setSwipe({ x: 0, y: 0, direction: undefined });
          }

          c.pause(false, "swipe");
        },
        onPointerCancel() {
          drag.current = null;
          setSwipe({ x: 0, y: 0, direction: undefined });

          c.pause(false, "swipe");
        },
      },
      getElementProps(props),
    ],
  });
  return (
    <RootContext.Provider
      value={{
        toast,
        titleId: `${id}-title`,
        descriptionId: `${id}-description`,
        setTitleId,
        setDescriptionId,
        index,
        state,
      }}
    >
      {node}
    </RootContext.Provider>
  );
}

export namespace Root {
  export type Props = Parameters<typeof Root>[0];
}

export function Content(
  props: BaseUIComponentProps<"div", { expanded: boolean; behind: boolean }>,
) {
  const c = useToast();
  return useRenderElement("div", props, {
    state: { expanded: c.state.expanded, behind: c.index > 0 },
    ref: props.ref,
    props: getElementProps(props),
  });
}

export namespace Content {
  export type Props = Parameters<typeof Content>[0];
}

export function Title(props: BaseUIComponentProps<"h2", { type?: string }>) {
  const c = useToast();
  const id = props.id ?? c.titleId;
  const visible = !!(props.children ?? c.toast.title);
  useIsoLayoutEffect(() => {
    c.setTitleId(visible ? id : undefined);
    return () => c.setTitleId(undefined);
  }, [id, visible, c.setTitleId]);
  return useRenderElement("h2", props, {
    enabled: visible,
    state: { type: c.toast.type },
    ref: props.ref,
    props: [{ id, children: c.toast.title }, getElementProps(props)],
  });
}

export namespace Title {
  export type Props = Parameters<typeof Title>[0];
}

export function Description(props: BaseUIComponentProps<"p", { type?: string }>) {
  const c = useToast();
  const id = props.id ?? c.descriptionId;
  const visible = !!(props.children ?? c.toast.description);
  useIsoLayoutEffect(() => {
    c.setDescriptionId(visible ? id : undefined);
    return () => c.setDescriptionId(undefined);
  }, [id, visible, c.setDescriptionId]);
  return useRenderElement("p", props, {
    enabled: visible,
    state: { type: c.toast.type },
    ref: props.ref,
    props: [{ id, children: c.toast.description }, getElementProps(props)],
  });
}

export namespace Description {
  export type Props = Parameters<typeof Description>[0];
}

export function Close({
  nativeButton = true,
  disabled = false,
  ...props
}: BaseUIComponentProps<"button", { disabled: boolean }> & NativeButtonProps) {
  const c = useToasts(),
    t = useToast();
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  return useRenderElement("button", props, {
    state: { disabled },
    ref: [props.ref ?? null, buttonRef],
    props: [
      getButtonProps({
        "aria-label": "Close notification",
        onClick() {
          c.manager.close(t.toast.id);
        },
      }),
      getElementProps(props),
    ],
  });
}

export namespace Close {
  export type Props = Parameters<typeof Close>[0];
}

export function Action({
  nativeButton = true,
  disabled = false,
  ...props
}: BaseUIComponentProps<"button", { type?: string }> & NativeButtonProps) {
  const t = useToast();
  const { buttonRef, getButtonProps } = useButton({ native: nativeButton, disabled });
  const children = t.toast.actionProps?.children ?? props.children;
  return useRenderElement("button", props, {
    enabled: !!children,
    state: { type: t.toast.type },
    ref: [props.ref ?? null, buttonRef],
    props: [getButtonProps({}), getElementProps(props), t.toast.actionProps ?? {}, { children }],
  });
}

export namespace Action {
  export type Props = Parameters<typeof Action>[0];
}
