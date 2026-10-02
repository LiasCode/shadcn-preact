import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { TabsRootState, TabsRoot } from "./TabsRoot";
export interface TabMetadata {
  element: HTMLElement;
  value: any;
  id: string;
  disabled: boolean;
}
export interface TabsContext {
  value: any;
  state: TabsRootState;
  tabs: TabMetadata[];
  panels: Map<any, string>;
  registerTab(metadata: TabMetadata): () => void;
  registerPanel(value: any, id: string): () => void;
  change(value: any, event: Event): void;
  onValueChange?: (value: any, details: TabsRoot.ChangeEventDetails) => void;
}
export const TabsRootContext = createContext<TabsContext | undefined>(undefined);
export function useTabsRootContext() {
  const context = useContext(TabsRootContext);
  if (!context) throw new Error("Base UI: Tabs parts must be used within Tabs.Root.");
  return context;
}