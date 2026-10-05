import { createContext } from "preact";
import { useContext } from "preact/hooks";

import type { BaseUIChangeEventDetails } from "../../internals/createBaseUIEventDetails";
import type { AccordionRootState } from "./AccordionRoot";

export interface AccordionContext {
  state: AccordionRootState;
  keepMounted: boolean;
  hiddenUntilFound: boolean;
  handleValueChange(
    value: unknown,
    open: boolean,
    details: BaseUIChangeEventDetails<"trigger-press" | "none">,
  ): void;
}

export const AccordionRootContext = createContext<AccordionContext | undefined>(undefined);

export function useAccordionRootContext() {
  const context = useContext(AccordionRootContext);

  if (!context) {
    throw new Error("Base UI: Accordion parts must be used within Accordion.Root.");
  }

  return context;
}
