import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type TextDirection = "ltr" | "rtl";

export interface DirectionContextValue {
  direction: TextDirection;
}

export const DirectionContext = createContext<DirectionContextValue | undefined>(undefined);

/** The text direction set by the nearest `DirectionProvider`, `ltr` by default. */
export function useDirection(): TextDirection {
  const context = useContext(DirectionContext);
  return context?.direction ?? "ltr";
}
