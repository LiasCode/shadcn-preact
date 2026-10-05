import { useLayoutEffect } from "preact/hooks";

const noop = () => {};

/** `useLayoutEffect` in the browser, nothing during prerendering. */
export const useIsoLayoutEffect: typeof useLayoutEffect =
  typeof document !== "undefined" ? useLayoutEffect : noop;
