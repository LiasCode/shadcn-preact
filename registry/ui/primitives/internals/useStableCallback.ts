import { useRefWithInit } from "./useRefWithInit";

type Callback = (...args: any[]) => any;

/**
 * Stabilizes the function passed so it's always the same between renders, while calling the latest version.
 * Preact has no insertion effect, so the latest function is stored during render, as Base UI does when
 * `useInsertionEffect` is unavailable.
 */
export function useStableCallback<T extends Callback | undefined>(
  callback: T,
): T extends Callback ? T : () => void {
  const stable = useRefWithInit(createStableCallback).current;
  stable.callback = callback;
  return stable.trampoline as T extends Callback ? T : () => void;
}

function createStableCallback() {
  const stable = {
    callback: undefined as Callback | undefined,
    trampoline: (...args: unknown[]) => stable.callback?.(...args),
  };
  return stable;
}
