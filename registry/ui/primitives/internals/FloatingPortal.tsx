import { createContext, type ComponentChildren, type RefObject } from "preact";
import { createPortal } from "preact/compat";
import { useContext, useMemo, useRef, useState } from "preact/hooks";

import { FocusGuard } from "./FocusGuard";
import type { BaseUIComponentProps } from "./types";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useRenderElement } from "./useRenderElement";

interface FocusHandlers {
  first: () => void;
  last: () => void;
}

interface PortalContextValue {
  portalNode: HTMLElement | null;
  beforeOutsideRef: RefObject<HTMLSpanElement | null>;
  afterOutsideRef: RefObject<HTMLSpanElement | null>;
  setFocusHandlers: (handlers: FocusHandlers | null) => void;
}

const PortalContext = createContext<PortalContextValue | null>(null);

export function usePortalContext() {
  return useContext(PortalContext);
}

export interface FloatingPortalProps extends BaseUIComponentProps<"div", {}> {
  container?: HTMLElement | ShadowRoot | null | RefObject<HTMLElement | ShadowRoot | null>;
}
/** A host retained in the Preact tree; nested portals mount inside their parent host. */
export function FloatingPortal(props: FloatingPortalProps) {
  const { container, children, ref, ...elementProps } = props;
  const parent = usePortalContext();
  const [target, setTarget] = useState<HTMLElement | ShadowRoot | null>(null);
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [handlers, setFocusHandlers] = useState<FocusHandlers | null>(null);
  const beforeOutsideRef = useRef<HTMLSpanElement | null>(null);
  const afterOutsideRef = useRef<HTMLSpanElement | null>(null);
  const context = useMemo(
    () => ({ portalNode: node, beforeOutsideRef, afterOutsideRef, setFocusHandlers }),
    [node],
  );
  useIsoLayoutEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setTarget(
      container === undefined
        ? parent
          ? parent.portalNode
          : window.document.body
        : container && "current" in container
          ? container.current
          : container,
    );
  });
  const host = useRenderElement("div", elementProps, {
    ref: [ref ?? null, setNode],
    props: {
      ...elementProps,
      "data-base-ui-portal": "",
      children: (
        <PortalContext.Provider value={context}>
          {children as ComponentChildren}
        </PortalContext.Provider>
      ),
    },
  });

  if (!target) {
    return null;
  }

  return (
    <>
      {handlers && <FocusGuard ref={beforeOutsideRef} onFocus={handlers.first} />}
      {createPortal(host, target)}
      {handlers && <FocusGuard ref={afterOutsideRef} onFocus={handlers.last} />}
    </>
  );
}

export namespace FloatingPortal {
  export type Props = FloatingPortalProps;

  export type State = {};
}
