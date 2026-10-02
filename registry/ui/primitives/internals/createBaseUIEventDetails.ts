interface ReasonToEventMap {
  none: Event;
  "escape-key": KeyboardEvent;
  "outside-press": MouseEvent | PointerEvent | TouchEvent;
  "focus-out": FocusEvent;
  "trigger-press": MouseEvent | PointerEvent | TouchEvent | KeyboardEvent;
  "track-press": PointerEvent | MouseEvent | TouchEvent;
  "input-change": InputEvent | Event;
  drag: PointerEvent | TouchEvent;
  keyboard: KeyboardEvent;
  disabled: Event;
  missing: Event;
  initial: Event;
}
export type ReasonToEvent<Reason extends string> = Reason extends keyof ReasonToEventMap
  ? ReasonToEventMap[Reason]
  : Event;
interface ChangeEventDetails<Reason extends string> {
  reason: Reason;
  event: ReasonToEvent<Reason>;
  trigger: Element | undefined;
  cancel: () => void;
  allowPropagation: () => void;
  readonly isCanceled: boolean;
  readonly isPropagationAllowed: boolean;
}
export type BaseUIChangeEventDetails<Reason extends string, Extra extends object = {}> = Reason extends string
  ? ChangeEventDetails<Reason> & Extra
  : never;
export function createChangeEventDetails<Reason extends string, Extra extends object = {}>(
  reason: Reason,
  event?: Event,
  trigger?: Element,
  extra?: Extra,
): BaseUIChangeEventDetails<Reason, Extra> {
  let canceled = false;
  let allowPropagation = false;
  return {
    ...extra,
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
  } as BaseUIChangeEventDetails<Reason, Extra>;
}
export type BaseUIGenericEventDetails<Reason extends string, Extra extends object = {}> = Reason extends string
  ? { reason: Reason; event: ReasonToEvent<Reason> } & Extra
  : never;
export function createGenericEventDetails<Reason extends string, Extra extends object = {}>(
  reason: Reason,
  event?: Event,
  extra?: Extra,
): BaseUIGenericEventDetails<Reason, Extra> {
  return { reason, event: event ?? new Event("base-ui"), ...extra } as BaseUIGenericEventDetails<Reason, Extra>;
}