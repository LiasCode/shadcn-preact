import { useOnMount } from "./useOnMount";
import { useRefWithInit } from "./useRefWithInit";

type FrameCallback = (timestamp: number) => void;

const EMPTY = null;

/** Batches every requested callback into a single `requestAnimationFrame`. */
class Scheduler {
  callbacks: (FrameCallback | null)[] = [];
  callbacksCount = 0;
  nextId = 1;
  startId = 1;
  isScheduled = false;

  tick = (timestamp: number) => {
    this.isScheduled = false;
    const currentCallbacks = this.callbacks;
    const currentCallbacksCount = this.callbacksCount;

    // Callbacks requested during this tick run on the next frame.
    this.callbacks = [];
    this.callbacksCount = 0;
    this.startId = this.nextId;

    if (currentCallbacksCount > 0) {
      for (let i = 0; i < currentCallbacks.length; i += 1) {
        currentCallbacks[i]?.(timestamp);
      }
    }
  };

  request(fn: FrameCallback) {
    const id = this.nextId;
    this.nextId += 1;
    this.callbacks.push(fn);
    this.callbacksCount += 1;

    if (!this.isScheduled) {
      requestAnimationFrame(this.tick);
      this.isScheduled = true;
    }

    return id;
  }

  cancel(id: number) {
    const index = id - this.startId;

    if (index < 0 || index >= this.callbacks.length) {
      return;
    }

    this.callbacks[index] = null;
    this.callbacksCount -= 1;
  }
}

const scheduler = new Scheduler();

export class AnimationFrame {
  static create() {
    return new AnimationFrame();
  }

  static request(fn: FrameCallback) {
    return scheduler.request(fn);
  }

  static cancel(id: number) {
    return scheduler.cancel(id);
  }

  currentId: number | null = EMPTY;

  /** Runs `fn` on the next frame, cancelling the previous request of this instance. */
  request(fn: () => void) {
    this.cancel();
    this.currentId = scheduler.request(() => {
      this.currentId = EMPTY;
      fn();
    });
  }

  cancel = () => {
    if (this.currentId !== EMPTY) {
      scheduler.cancel(this.currentId);
      this.currentId = EMPTY;
    }
  };

  disposeEffect = () => this.cancel;
}

/** An animation frame owned by the component and cancelled when it unmounts. */
export function useAnimationFrame() {
  const frame = useRefWithInit(AnimationFrame.create).current;
  useOnMount(frame.disposeEffect);
  return frame;
}
