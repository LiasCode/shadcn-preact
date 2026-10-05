import { useIsoLayoutEffect } from "./useIsoLayoutEffect";
import { useRefWithInit } from "./useRefWithInit";

/** A ref that holds the latest committed value. */
export function useValueAsRef<T>(value: T): { current: T } {
  const latest = useRefWithInit(createLatestRef<T>, value).current;
  latest.next = value;
  useIsoLayoutEffect(latest.effect);
  return latest;
}

function createLatestRef<T>(value: T) {
  const latest = {
    current: value,
    next: value,
    effect: () => {
      latest.current = latest.next;
    },
  };
  return latest;
}
