import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { CollapsibleRootState } from "./CollapsibleRoot";
import type { useCollapsibleRoot, UseCollapsibleRootParameters } from "./useCollapsibleRoot";
export interface CollapsibleContext extends ReturnType<typeof useCollapsibleRoot> {
  state: CollapsibleRootState;
  onOpenChange: UseCollapsibleRootParameters["onOpenChange"];
}
export const CollapsibleRootContext = createContext<CollapsibleContext | undefined>(undefined);
export function useCollapsibleRootContext() {
  const context = useContext(CollapsibleRootContext);
  if (!context) throw new Error("Base UI: Collapsible parts must be used within Collapsible.Root.");
  return context;
}