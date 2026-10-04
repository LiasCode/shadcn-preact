import { useEffect, useRef } from "preact/hooks";

/** Skip offscreen demo rendering while preserving the page's measured section heights. */
export function useShowcaseContainment() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = ref.current;
    if (!container || typeof window === "undefined" || !window.CSS?.supports("content-visibility", "auto")) return;
    let width = -1;
    const measure = () => {
      const nextWidth = container.clientWidth;
      if (width === nextWidth) return;
      width = nextWidth;
      container.removeAttribute("data-containment-ready");
      const sections = Array.from(container.querySelectorAll<HTMLElement>(":scope > section"));
      // Read every height before writing styles, so the whole page needs only one layout pass.
      const heights = sections.map((section) => section.getBoundingClientRect().height);
      sections.forEach((section, index) => section.style.setProperty("--showcase-height", `${heights[index]}px`));
      container.setAttribute("data-containment-ready", "");
    };
    measure();
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    observer?.observe(container);
    if (!observer) window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);
  return ref;
}