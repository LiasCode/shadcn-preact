import { useContext } from "preact/hooks";

import { FieldRootContext, fieldValidityMapping } from "../../internals/FieldRootContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { FieldControlState } from "../control/FieldControl";

export interface FieldLabelProps extends BaseUIComponentProps<"label", FieldControlState> {
  nativeLabel?: boolean;
}
export function FieldLabel(props: FieldLabelProps) {
  const {
    ref,
    id: idProp,
    nativeLabel = true,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = props;
  const field = useContext(FieldRootContext);
  if (!field) throw new Error("Field.Label requires Field.Root.");
  const id = useBaseUiId(idProp);
  useIsoLayoutEffect(() => field.label(id), [field.label, id]);
  return useRenderElement("label", props, {
    ref,
    state: field.state,
    props: [
      {
        id,
        htmlFor: nativeLabel ? field.controlId : undefined,
        onClick(event: MouseEvent) {
          if (!nativeLabel && !field.state.disabled) {
            event.preventDefault();
            if (typeof window !== "undefined" && field.controlId) document.getElementById(field.controlId)?.focus();
          }
        },
      },
      elementProps,
    ],
    stateAttributesMapping: fieldValidityMapping,
  });
}
export declare namespace FieldLabel {
  type Props = FieldLabelProps;
  type State = FieldControlState;
}