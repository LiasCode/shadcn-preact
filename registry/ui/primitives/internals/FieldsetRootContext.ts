import { createContext } from "preact";
export interface FieldsetContextValue {
  disabled: boolean;
  legendId?: string;
  setLegendId: (id: string | undefined) => void;
}
export const FieldsetRootContext = createContext<FieldsetContextValue | null>(null);