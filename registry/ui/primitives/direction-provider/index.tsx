import type { ComponentChildren } from "preact";
import { useMemo } from "preact/hooks";

import { DirectionContext, type TextDirection } from "../internals/direction-context";

export { useDirection, type TextDirection } from "../internals/direction-context";

export interface DirectionProviderProps {
  children?: ComponentChildren;
  /** The reading direction of the text. @default 'ltr' */
  direction?: TextDirection | undefined;
}

/** Enables RTL behavior for Base UI components. */
export function DirectionProvider(props: DirectionProviderProps) {
  const { direction = "ltr" } = props;
  const contextValue = useMemo(() => ({ direction }), [direction]);
  return (
    <DirectionContext.Provider value={contextValue}>{props.children}</DirectionContext.Provider>
  );
}

export declare namespace DirectionProvider {
  type State = {};

  type Props = DirectionProviderProps;
}
