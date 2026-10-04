import { useContext } from "preact/hooks";

import { FieldsetRootContext } from "../../internals/FieldsetRootContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useBaseUiId } from "../../internals/useId";
import { useIsoLayoutEffect } from "../../internals/useIsoLayoutEffect";
import { useRenderElement } from "../../internals/useRenderElement";
import type { FieldsetRootState } from "../root/FieldsetRoot";
export type FieldsetLegendProps = BaseUIComponentProps<"div", FieldsetRootState>;
export function FieldsetLegend(props: FieldsetLegendProps) {
  const { ref, id: ownId, render: _render, className: _className, style: _style, ...elementProps } = props;
  const context = useContext(FieldsetRootContext);
  if (!context) throw new Error("Fieldset.Legend requires Fieldset.Root.");
  const id = useBaseUiId(ownId);
  useIsoLayoutEffect(() => {
    context.setLegendId(id);
    return () => context.setLegendId(undefined);
  }, [context.setLegendId, id]);
  return useRenderElement("div", props, { ref, state: { disabled: context.disabled }, props: { id, ...elementProps } });
}
export declare namespace FieldsetLegend {
  type Props = FieldsetLegendProps;
  type State = FieldsetRootState;
}