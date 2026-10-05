import { useRef, useState } from "preact/hooks";

import { useIsoLayoutEffect } from "../../useIsoLayoutEffect";
import { useStableCallback } from "../../useStableCallback";
import { useCompositeListContext } from "./CompositeList";

export function useCompositeListItem() {
  const context = useCompositeListContext();
  const elementRef = useRef<HTMLElement | null>(null);
  const [element, setElement] = useState<HTMLElement | null>(null);
  const ref = useStableCallback((node: HTMLElement | null) => {
    elementRef.current = node;
    setElement(node);
  });
  useIsoLayoutEffect(() => {
    if (element) {
      return context.register(element);
    }

    return undefined;
  }, [context.register, element]);
  return { ref, elementRef, index: context.elements.indexOf(element!) };
}
