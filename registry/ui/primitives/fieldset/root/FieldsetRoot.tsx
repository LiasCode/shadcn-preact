import { useContext, useMemo, useState } from "preact/hooks";

import { FieldsetRootContext } from "../../internals/FieldsetRootContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
export interface FieldsetRootState {
  disabled: boolean;
}
export interface FieldsetRootProps extends BaseUIComponentProps<"fieldset", FieldsetRootState> {
  disabled?: boolean;
}
export function FieldsetRoot(props: FieldsetRootProps) {
  const {
    ref,
    disabled: ownDisabled = false,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = props;
  const parent = useContext(FieldsetRootContext);
  const disabled = Boolean(parent?.disabled || ownDisabled);
  const [legendId, setLegendId] = useState<string>();
  const context = useMemo(() => ({ disabled, legendId, setLegendId }), [disabled, legendId]);
  const element = useRenderElement("fieldset", props, {
    ref,
    state: { disabled },
    props: [{ disabled, "aria-labelledby": legendId }, elementProps],
  });
  return <FieldsetRootContext.Provider value={context}>{element}</FieldsetRootContext.Provider>;
}
export declare namespace FieldsetRoot {
  type Props = FieldsetRootProps;
  type State = FieldsetRootState;
}