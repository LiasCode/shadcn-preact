import type { Ref } from "preact";

import { useRefWithInit } from "./useRefWithInit";

type InputRef<I> = Ref<I> | undefined | null;

type RefCleanup = () => void;

interface ForkRef<I> {
  callback: ((instance: I | null) => void) | null;
  cleanup: RefCleanup | null;
  refs: InputRef<I>[];
}

/**
 * Merges refs into a single memoized callback ref, or `null` when all refs are empty. Merges up to four refs; use
 * `useMergedRefsN` for more.
 */
export function useMergedRefs<I>(
  a: InputRef<I>,
  b?: InputRef<I>,
  c?: InputRef<I>,
  d?: InputRef<I>,
) {
  const forkRef = useRefWithInit(createForkRef<I>).current;

  if (didChange(forkRef, a, b, c, d)) {
    update(forkRef, [a, b, c, d]);
  }

  return forkRef.callback;
}

/** Merges an array of refs into a single memoized callback ref, or `null`. */
export function useMergedRefsN<I>(refs: InputRef<I>[]) {
  const forkRef = useRefWithInit(createForkRef<I>).current;

  if (didChangeN(forkRef, refs)) {
    update(forkRef, refs);
  }

  return forkRef.callback;
}

function createForkRef<I>(): ForkRef<I> {
  return { callback: null, cleanup: null, refs: [] };
}

function didChange<I>(
  forkRef: ForkRef<I>,
  a: InputRef<I>,
  b: InputRef<I>,
  c: InputRef<I>,
  d: InputRef<I>,
) {
  return (
    forkRef.refs[0] !== a || forkRef.refs[1] !== b || forkRef.refs[2] !== c || forkRef.refs[3] !== d
  );
}

function didChangeN<I>(forkRef: ForkRef<I>, newRefs: InputRef<I>[]) {
  return (
    forkRef.refs.length !== newRefs.length ||
    forkRef.refs.some((ref, index) => ref !== newRefs[index])
  );
}

function update<I>(forkRef: ForkRef<I>, refs: InputRef<I>[]) {
  forkRef.refs = refs;

  if (refs.every((ref) => ref == null)) {
    forkRef.callback = null;
    return;
  }

  forkRef.callback = (instance: I | null) => {
    if (forkRef.cleanup) {
      forkRef.cleanup();
      forkRef.cleanup = null;
    }

    if (instance != null) {
      const cleanupCallbacks: (RefCleanup | null)[] = Array(refs.length).fill(null);

      for (let i = 0; i < refs.length; i += 1) {
        const ref = refs[i];

        if (ref == null) {
          continue;
        }

        if (typeof ref === "function") {
          const refCleanup = (ref as (instance: I | null) => unknown)(instance);

          if (typeof refCleanup === "function") {
            cleanupCallbacks[i] = refCleanup as RefCleanup;
          }
        } else {
          ref.current = instance;
        }
      }

      forkRef.cleanup = () => {
        for (let i = 0; i < refs.length; i += 1) {
          const ref = refs[i];

          if (ref == null) {
            continue;
          }

          if (typeof ref === "function") {
            const cleanupCallback = cleanupCallbacks[i];

            if (typeof cleanupCallback === "function") {
              cleanupCallback();
            } else {
              (ref as (instance: I | null) => unknown)(null);
            }
          } else {
            ref.current = null;
          }
        }
      };
    }
  };
}
