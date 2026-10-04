import { useContext, useRef } from "preact/hooks";

import { FieldRootContext, fieldValidityMapping, type FieldValidityData } from "../../internals/FieldRootContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useOpenChangeComplete } from "../../internals/useOpenChangeComplete";
import { useRenderElement } from "../../internals/useRenderElement";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";
import type { FieldControlState } from "../control/FieldControl";

export type FieldErrorState = FieldControlState & { transitionStatus: TransitionStatus };
export interface FieldErrorProps extends BaseUIComponentProps<"div", FieldErrorState> {
  match?: boolean | keyof FieldValidityData["state"];
}
export function FieldError(props: FieldErrorProps) {
  const { ref, id: idProp, match, render: _render, className: _className, style: _style, ...elementProps } = props;
  const field = useContext(FieldRootContext);
  if (!field) throw new Error("Field.Error requires Field.Root.");
  const id = useBaseUiId(idProp);
  const open =
    match === true ||
    (!field.state.disabled &&
      (typeof match === "string" ? Boolean(field.validity.state[match]) : field.state.valid === false));
  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);
  const errorRef = useRef<HTMLElement | null>(null);
  const lastMessage = useRef<ReturnType<typeof ErrorMessage>>(null);
  if (open) lastMessage.current = ErrorMessage(field.validity.errors, field.validity.error);
  useIsoLayoutEffect(() => (open ? field.message(id) : undefined), [open, field.message, id]);
  useOpenChangeComplete({
    open,
    ref: errorRef,
    onComplete: () => {
      if (!open) setMounted(false);
    },
  });
  return useRenderElement("div", props, {
    enabled: mounted,
    ref: [ref ?? null, errorRef],
    state: { ...field.state, transitionStatus },
    props: { id, children: lastMessage.current, ...elementProps },
    stateAttributesMapping: {
      ...fieldValidityMapping,
      transitionStatus: (status): Record<string, string> | null =>
        status === "starting"
          ? { "data-starting-style": "" }
          : status === "ending"
            ? { "data-ending-style": "" }
            : null,
    },
  });
}
function ErrorMessage(errors: string[], error: string) {
  if (errors.length > 1)
    return (
      <ul>
        {errors.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    );
  return errors[0] ?? error;
}
export declare namespace FieldError {
  type Props = FieldErrorProps;
  type State = FieldErrorState;
}