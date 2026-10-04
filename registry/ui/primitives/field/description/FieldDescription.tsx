import { useContext } from "preact/hooks";

import { FieldRootContext, fieldValidityMapping } from "../../internals/FieldRootContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { FieldControlState } from "../control/FieldControl";

export type FieldDescriptionProps = BaseUIComponentProps<"p", FieldControlState>;
export function FieldDescription(props: FieldDescriptionProps) {
  const { ref, id: idProp, render: _render, className: _className, style: _style, ...elementProps } = props;
  const field = useContext(FieldRootContext);
  if (!field) throw new Error("Field.Description requires Field.Root.");
  const id = useBaseUiId(idProp);
  useIsoLayoutEffect(() => field.message(id), [field.message, id]);
  return useRenderElement("p", props, {
    ref,
    state: field.state,
    props: { id, ...elementProps },
    stateAttributesMapping: fieldValidityMapping,
  });
}
export declare namespace FieldDescription {
  type Props = FieldDescriptionProps;
  type State = FieldControlState;
}