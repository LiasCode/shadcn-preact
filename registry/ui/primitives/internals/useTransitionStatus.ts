import { useState } from "preact/hooks";

import { AnimationFrame } from "./useAnimationFrame";
import { useIsoLayoutEffect } from "./useIsoLayoutEffect";

export type TransitionStatus = "starting" | "ending" | "idle" | undefined;

/**
 * Tracks the transition of an element that opens and closes, so it can stay mounted while it animates out.
 * `starting` is set on the first frame after opening and `ending` while closing; they map to
 * `data-starting-style` and `data-ending-style`.
 *
 * @param open Whether the element is open.
 * @param enableIdleState Whether to settle on `idle` instead of `undefined` once opened.
 * @param deferEndingState Whether to set `ending` on the next frame instead of during render.
 */
export function useTransitionStatus(open: boolean, enableIdleState = false, deferEndingState = false) {
  const [transitionStatus, setTransitionStatus] = useState<TransitionStatus>(
    open && enableIdleState ? "idle" : undefined,
  );
  const [mounted, setMounted] = useState(open);

  if (open && !mounted) {
    setMounted(true);
    setTransitionStatus("starting");
  }

  if (!open && mounted && transitionStatus !== "ending" && !deferEndingState) {
    setTransitionStatus("ending");
  }

  if (!open && !mounted && transitionStatus === "ending") {
    setTransitionStatus(undefined);
  }

  useIsoLayoutEffect(() => {
    if (!open && mounted && transitionStatus !== "ending" && deferEndingState) {
      const frame = AnimationFrame.request(() => {
        setTransitionStatus("ending");
      });
      return () => {
        AnimationFrame.cancel(frame);
      };
    }
    return undefined;
  }, [open, mounted, transitionStatus, deferEndingState]);

  useIsoLayoutEffect(() => {
    if (!open || enableIdleState) {
      return undefined;
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus(undefined);
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open]);

  useIsoLayoutEffect(() => {
    if (!open || !enableIdleState) {
      return undefined;
    }
    if (open && mounted && transitionStatus !== "idle") {
      setTransitionStatus("starting");
    }
    const frame = AnimationFrame.request(() => {
      setTransitionStatus("idle");
    });
    return () => {
      AnimationFrame.cancel(frame);
    };
  }, [enableIdleState, open, mounted, transitionStatus]);

  return { mounted, setMounted, transitionStatus };
}