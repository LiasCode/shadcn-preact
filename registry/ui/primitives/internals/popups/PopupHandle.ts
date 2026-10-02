import type { OverlayContextValue, OverlayChangeDetails, OverlayReason } from "./OverlayContext";
/** Shared detached-trigger association; Preact subscribes through an effect. */
export class PopupHandle<Payload = unknown> {
  context: OverlayContextValue | null = null;
  triggers = new Map<string, { element: HTMLElement; payload: Payload | undefined }>();
  listeners = new Set<() => void>();
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  notify() {
    for (const listener of this.listeners) listener();
  }
  change(
    open: boolean,
    event: Event,
    reason: OverlayReason,
    trigger?: HTMLElement,
    payload?: Payload,
  ): OverlayChangeDetails | undefined {
    return this.context?.change(open, event, reason, trigger, payload);
  }
}