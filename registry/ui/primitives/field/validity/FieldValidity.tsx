import type { ComponentChild } from "preact";
import { useContext } from "preact/hooks";

import { FieldRootContext, type FieldValidityData } from "../../internals/FieldRootContext";
import { useTransitionStatus, type TransitionStatus } from "../../internals/useTransitionStatus";

export interface FieldValidityState extends Omit<FieldValidityData, "state"> {
  validity: FieldValidityData["state"];
  transitionStatus: TransitionStatus;
}

export interface FieldValidityProps {
  children: (state: FieldValidityState) => ComponentChild;
}

export function FieldValidity({ children }: FieldValidityProps) {
  const field = useContext(FieldRootContext);

  if (!field) {
    throw new Error("Field.Validity requires Field.Root.");
  }

  const { transitionStatus } = useTransitionStatus(field.state.valid === false);
  const { state: validity, ...data } = field.validity;
  return children({ ...data, validity, transitionStatus });
}

export declare namespace FieldValidity {
  type Props = FieldValidityProps;

  type State = FieldValidityState;
}
