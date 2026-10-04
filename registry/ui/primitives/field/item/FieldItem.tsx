import { useContext, useRef, useState } from "preact/hooks";

import { FieldRootContext, fieldValidityMapping } from "../../internals/FieldRootContext";
import { LabelableContext } from "../../internals/LabelableContext";
import type { BaseUIComponentProps } from "../../internals/types";
import { useRenderElement } from "../../internals/useRenderElement";
import { useStableCallback } from "../../internals/useStableCallback";
import type { FieldControlState } from "../control/FieldControl";
export interface FieldItemProps extends BaseUIComponentProps<"div", FieldControlState> {
  disabled?: boolean;
}
export function FieldItem(props: FieldItemProps) {
  const {
    ref,
    disabled: ownDisabled = false,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = props;
  const field = useContext(FieldRootContext);
  if (!field) throw new Error("Field.Item requires Field.Root.");
  const state = { ...field.state, disabled: field.state.disabled || ownDisabled };
  const [controlId, setControlId] = useState<string>();
  const [labelId, setLabelId] = useState<string>();
  const [messages, setMessages] = useState<string[]>([]);
  const controlFocus = useRef<(() => void) | undefined>(undefined);
  const registerControl = useStableCallback((id: string, focus: () => void) => {
    controlFocus.current = focus;
    setControlId(id);
    return () => {
      if (controlFocus.current === focus) {
        controlFocus.current = undefined;
        setControlId(undefined);
      }
    };
  });
  const label = useStableCallback((id: string) => {
    setLabelId(id);
    return () => setLabelId((previous) => (previous === id ? undefined : previous));
  });
  const message = useStableCallback((id: string) => {
    setMessages((previous) => (previous.includes(id) ? previous : [...previous, id]));
    return () => setMessages((previous) => previous.filter((message) => message !== id));
  });
  const focusControl = useStableCallback(() => controlFocus.current?.());
  const element = useRenderElement("div", props, {
    ref,
    state,
    props: elementProps,
    stateAttributesMapping: fieldValidityMapping,
  });
  return (
    <LabelableContext.Provider
      value={{ state, controlId, labelId, messages, registerControl, label, message, focusControl }}
    >
      {element}
    </LabelableContext.Provider>
  );
}
export declare namespace FieldItem {
  type Props = FieldItemProps;
  type State = FieldControlState;
}