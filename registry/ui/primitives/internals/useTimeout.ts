import { useOnMount } from "./useOnMount";
import { useRefWithInit } from "./useRefWithInit";

const EMPTY = 0;

export class Timeout {
  static create() {
    return new Timeout();
  }

  currentId: ReturnType<typeof setTimeout> | typeof EMPTY = EMPTY;

  /** Runs `fn` after `delay` milliseconds, clearing the previous timeout of this instance. */
  start(delay: number, fn: () => void) {
    this.clear();
    this.currentId = setTimeout(() => {
      this.currentId = EMPTY;
      fn();
    }, delay);
  }

  isStarted() {
    return this.currentId !== EMPTY;
  }

  clear = () => {
    if (this.currentId !== EMPTY) {
      clearTimeout(this.currentId);
      this.currentId = EMPTY;
    }
  };

  disposeEffect = () => this.clear;
}

/** A timeout owned by the component and cleared when it unmounts. */
export function useTimeout() {
  const timeout = useRefWithInit(Timeout.create).current;
  useOnMount(timeout.disposeEffect);
  return timeout;
}
