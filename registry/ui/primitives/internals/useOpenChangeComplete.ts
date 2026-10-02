import { useEffect } from "preact/hooks";

import { useAnimationsFinished } from "./useAnimationsFinished";
import { useStableCallback } from "./useStableCallback";

export interface UseOpenChangeCompleteParameters {
  /** Whether the hook is enabled. @default true */
  enabled?: boolean;
  /** Whether the element is open. */
  open?: boolean;
  /** The element that animates. */
  ref: { current: HTMLElement | null };
  /** Called once the open or close animation has finished. */
  onComplete: () => void;
}

/** Calls `onComplete` once the element's open or close animation has finished. */
export function useOpenChangeComplete(parameters: UseOpenChangeCompleteParameters) {
  const { enabled = true, open, ref, onComplete: onCompleteParam } = parameters;

  const onComplete = useStableCallback(onCompleteParam);
  const runOnceAnimationsFinish = useAnimationsFinished(ref, open, false);

  useEffect(() => {
    if (!enabled) {
      return undefined;
    }
    const abortController = new AbortController();
    runOnceAnimationsFinish(onComplete, abortController.signal);
    return () => {
      abortController.abort();
    };
  }, [enabled, open, onComplete, runOnceAnimationsFinish]);
}