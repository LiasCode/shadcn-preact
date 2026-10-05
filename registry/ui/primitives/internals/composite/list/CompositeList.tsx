import { createContext, type ComponentChildren } from "preact";
import { useContext, useRef, useState } from "preact/hooks";

import { useIsoLayoutEffect } from "../../useIsoLayoutEffect";
import { useStableCallback } from "../../useStableCallback";

interface ListContext {
  elements: HTMLElement[];
  register(element: HTMLElement): () => void;
}

const CompositeListContext = createContext<ListContext | undefined>(undefined);

export function CompositeList({
  children,
  onMapChange,
}: {
  children: ComponentChildren;
  onMapChange?: (elements: HTMLElement[]) => void;
}) {
  const nodes = useRef(new Set<HTMLElement>());
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const sort = useStableCallback(() => {
    const next = [...nodes.current]
      .filter((node) => node.isConnected)
      .sort((a, b) => (a.compareDocumentPosition(b) & 4 ? -1 : 1));
    setElements((prev) =>
      next.length === prev.length && next.every((node, index) => node === prev[index])
        ? prev
        : next,
    );
  });
  const register = useStableCallback((element: HTMLElement) => {
    nodes.current.add(element);

    sort();
    return () => {
      nodes.current.delete(element);

      sort();
    };
  });
  const notify = useStableCallback(onMapChange);
  useIsoLayoutEffect(() => {
    notify(elements);

    if (typeof window === "undefined" || typeof MutationObserver !== "function") {
      return undefined;
    }

    const observer = new MutationObserver(sort);
    elements.forEach((node) => {
      if (node.parentElement) {
        observer.observe(node.parentElement, { childList: true });
      }
    });
    return () => observer.disconnect();
  }, [elements, sort, notify]);
  return (
    <CompositeListContext.Provider value={{ elements, register }}>
      {children}
    </CompositeListContext.Provider>
  );
}

export function useCompositeListContext() {
  const context = useContext(CompositeListContext);

  if (!context) {
    throw new Error("Base UI: List items must be used within CompositeList.");
  }

  return context;
}
