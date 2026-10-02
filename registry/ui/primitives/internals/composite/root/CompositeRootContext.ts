import { createContext } from "preact";
import { useContext } from "preact/hooks";

export interface CompositeContext {
  highlightedIndex: number;
  onHighlightedIndexChange(index: number): void;
  highlightItemOnHover: boolean;
}
export const CompositeRootContext = createContext<CompositeContext | undefined>(undefined);
export function useCompositeRootContext(optional = false) {
  const context = useContext(CompositeRootContext);
  if (!context && !optional) throw new Error("Base UI: CompositeItem must be used within CompositeRoot.");
  return context;
}