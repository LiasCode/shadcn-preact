import { useRef } from "preact/hooks";

const UNINITIALIZED = {};

/** A `useRef` initialized lazily with a function, called once. */
export function useRefWithInit<T>(init: () => T): { current: T };

export function useRefWithInit<T, U>(init: (arg: U) => T, initArg: U): { current: T };

export function useRefWithInit(
  init: (arg?: unknown) => unknown,
  initArg?: unknown,
): { current: unknown } {
  const ref = useRef<unknown>(UNINITIALIZED);

  if (ref.current === UNINITIALIZED) {
    ref.current = init(initArg);
  }

  return ref;
}
