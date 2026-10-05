import { flushSync } from "preact/compat";

import { resolveRef } from "./resolveRef";
import { TransitionStatusDataAttributes } from "./stateAttributesMapping";
import { useAnimationFrame } from "./useAnimationFrame";
import { useStableCallback } from "./useStableCallback";

declare global {
  // Set to `true` to skip waiting for animations (for example, in tests).
  var BASE_UI_ANIMATIONS_DISABLED: boolean | undefined;
}

/**
 * Returns a function that runs a callback once every animation and transition of the element has finished.
 *
 * @param elementOrRef The element, or a ref to it.
 * @param waitForStartingStyleRemoved Whether to wait for `data-starting-style` to be removed first.
 * @param treatAbortedAsFinished Whether a cancelled animation counts as finished.
 */
export function useAnimationsFinished(
  elementOrRef: HTMLElement | null | { current: HTMLElement | null },
  waitForStartingStyleRemoved = false,
  treatAbortedAsFinished = true,
) {
  const frame = useAnimationFrame();

  return useStableCallback((fnToExecute: () => void, signal: AbortSignal | null = null) => {
    frame.cancel();

    const element = resolveRef(elementOrRef);

    if (element == null) {
      return;
    }

    const done = () => {
      flushSync(fnToExecute);
    };

    if (typeof element.getAnimations !== "function" || globalThis.BASE_UI_ANIMATIONS_DISABLED) {
      fnToExecute();
      return;
    }

    function exec() {
      Promise.all(element!.getAnimations().map((animation) => animation.finished))
        .then(() => {
          if (!signal?.aborted) {
            done();
          }
        })
        .catch(() => {
          if (treatAbortedAsFinished) {
            if (!signal?.aborted) {
              done();
            }

            return;
          }

          const currentAnimations = element!.getAnimations();

          if (
            !signal?.aborted &&
            currentAnimations.some(
              (animation) => animation.pending || animation.playState !== "finished",
            )
          ) {
            // Another animation started after the cancelled one; wait for it too.
            exec();
          }
        });
    }

    if (waitForStartingStyleRemoved) {
      const startingStyleAttribute = TransitionStatusDataAttributes.startingStyle;

      // The attribute can already be gone when this runs; wait a frame so the animations have started.
      if (!element.hasAttribute(startingStyleAttribute)) {
        frame.request(exec);
        return;
      }

      const attributeObserver = new MutationObserver(() => {
        if (!element.hasAttribute(startingStyleAttribute)) {
          attributeObserver.disconnect();

          exec();
        }
      });
      attributeObserver.observe(element, {
        attributes: true,
        attributeFilter: [startingStyleAttribute],
      });

      signal?.addEventListener("abort", () => attributeObserver.disconnect(), { once: true });
      return;
    }

    frame.request(exec);
  });
}
