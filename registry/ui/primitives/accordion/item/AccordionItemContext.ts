import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { AccordionItemState } from "./AccordionItem";
export interface AccordionItemContextValue {
  state: AccordionItemState;
  triggerId: string;
  setTriggerId(id: string | undefined): void;
}
export const AccordionItemContext = createContext<AccordionItemContextValue | undefined>(undefined);
export function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("Base UI: Accordion parts must be used within Accordion.Item.");
  return context;
}