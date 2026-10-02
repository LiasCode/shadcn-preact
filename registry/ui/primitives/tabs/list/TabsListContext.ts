import { createContext } from "preact";
import { useContext } from "preact/hooks";
export const TabsListContext = createContext<
  | {
      activateOnFocus: boolean;
      highlightedIndex: number;
      setHighlightedIndex(index: number): void;
      element: { current: HTMLElement | null };
    }
  | undefined
>(undefined);
export function useTabsListContext() {
  const context = useContext(TabsListContext);
  if (!context) throw new Error("Base UI: Tabs.Tab must be used within Tabs.List.");
  return context;
}