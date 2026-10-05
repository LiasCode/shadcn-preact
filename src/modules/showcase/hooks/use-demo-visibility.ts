import type { RefObject } from "preact";
import { useEffect, useState } from "preact/hooks";

/** A section remains measurable while content-visibility skips its demo descendants. */
export function useDemoVisibility(ref: RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !ref.current) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    );
    observer.observe(ref.current.closest("section") ?? ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return visible;
}
