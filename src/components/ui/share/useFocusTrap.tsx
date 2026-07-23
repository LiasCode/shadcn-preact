import { useEffect, useRef } from "preact/hooks";

const FOCUSABLE =
  'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"]),details>summary';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest("[inert]") && el.offsetParent !== null,
  );
}

/**
 * Traps keyboard focus inside `containerRef` while `active` is true, and
 * restores focus to the previously focused element when deactivated.
 *
 * Pass `autoFocus: true` (default) to move focus into the container on activation.
 */
export function useFocusTrap(
  containerRef: { current: HTMLElement | null },
  active: boolean,
  { autoFocus = true }: { autoFocus?: boolean } = {},
) {
  const previousFocus = useRef<HTMLElement | null>(null);

  // Auto-focus: move focus into the container when it becomes active.
  useEffect(() => {
    if (!active || !autoFocus) return;

    previousFocus.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    if (!container) return;

    const first = getFocusable(container)[0] ?? container;
    first.focus({ preventScroll: true });
  }, [active, autoFocus, containerRef]);

  // Restore focus to the trigger when the trap deactivates.
  useEffect(() => {
    if (active) return;
    previousFocus.current?.focus({ preventScroll: true });
    previousFocus.current = null;
  }, [active]);

  // Tab / Shift+Tab cycle within the container.
  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus({ preventScroll: true });
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus({ preventScroll: true });
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [active, containerRef]);
}