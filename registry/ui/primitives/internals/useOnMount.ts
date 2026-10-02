import { type EffectCallback, useEffect } from "preact/hooks";

const EMPTY: [] = [];

/** A `useEffect` that runs once, when the component mounts. */
export function useOnMount(fn: EffectCallback) {
  useEffect(fn, EMPTY);
}