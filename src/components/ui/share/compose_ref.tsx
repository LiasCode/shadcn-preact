/**
 * This funtionality is used to compose multiple refs together
 * It allows you to pass multiple refs to a single component
 * and have them all receive the same value.
 *
 * All credit goes to the original author of this code:
 * Radix UI
 */

import type { RefCallback } from "preact";
import { useCallback } from "preact/hooks";

type PossibleRef<T> = React.Ref<T | null> | undefined;

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T) {
  if (typeof ref === "function") {
    return ref(value);
  }
  if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // @ts-expect-error
  return (node) => {
    let hasCleanup = false;

    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);

      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });

    return cleanups;
  };
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return useCallback(composeRefs(...refs), refs);
}

export { composeRefs, useComposedRefs };
