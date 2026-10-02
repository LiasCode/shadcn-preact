export interface BaseUIChangeEventDetails<Reason extends string> {
  reason: Reason;
  event: Event;
  trigger: Element | undefined;
  cancel: () => void;
  allowPropagation: () => void;
  readonly isCanceled: boolean;
  readonly isPropagationAllowed: boolean;
}
export function createChangeEventDetails<Reason extends string>(
  reason: Reason,
  event?: Event,
  trigger?: Element,
): BaseUIChangeEventDetails<Reason> {
  let canceled = false;
  let allowPropagation = false;
  return {
    reason,
    event: event ?? new Event("base-ui"),
    trigger,
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      allowPropagation = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return allowPropagation;
    },
  };
}